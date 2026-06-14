import { NextRequest, NextResponse, after } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { TestimonialSchema, tokenSchema } from "@/lib/validation/schemas";
import {
  sanitizeName,
  sanitizeTitle,
  sanitizeContent,
  sanitizeAvatarUrl,
} from "@/lib/security/sanitize";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { scoreTestimonial } from "@/lib/ai/gemini";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;

  if (!tokenSchema.safeParse(token).success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimit(`collect:${ip}:${token}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Trim string fields before validation
  if (body !== null && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (typeof b.author_name === "string") b.author_name = b.author_name.trim();
    if (typeof b.author_title === "string") b.author_title = b.author_title.trim();
    if (typeof b.content === "string") b.content = b.content.trim();
    if (typeof b.author_avatar_url === "string")
      b.author_avatar_url = b.author_avatar_url.trim();
  }

  // Silently drop invalid avatar URL instead of returning 400
  if (body !== null && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (b.author_avatar_url !== undefined) {
      const safe = sanitizeAvatarUrl(b.author_avatar_url as string | undefined);
      b.author_avatar_url = safe ?? undefined;
    }
  }

  const parsed = TestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const supabase = createServiceClient();

  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("id, plan, name")
    .eq("public_token", token)
    .single();

  if (wsError ?? !workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  if (workspace.plan === "free") {
    const { count } = await supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id);

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Testimonial limit reached for free plan" },
        { status: 403 }
      );
    }
  }

  const { data: input } = parsed;

  const { data: inserted, error: insertError } = await supabase
    .from("testimonials")
    .insert({
      workspace_id: workspace.id,
      author_name: sanitizeName(input.author_name),
      author_title: input.author_title ? sanitizeTitle(input.author_title) : null,
      content: sanitizeContent(input.content),
      rating: input.rating ?? null,
      author_avatar_url: sanitizeAvatarUrl(input.author_avatar_url) ?? null,
      source: "form",
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError ?? !inserted) {
    return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 });
  }

  // AI scoring runs AFTER the response is sent, but `after()` keeps the
  // serverless function alive until it completes (plain fire-and-forget
  // would be frozen/killed on Vercel before the Gemini call returns).
  const testimonialId = inserted.id;
  const authorName = sanitizeName(input.author_name);
  const content = sanitizeContent(input.content);
  after(async () => {
    try {
      const { score, flags } = await scoreTestimonial(content, authorName);
      await createServiceClient()
        .from("testimonials")
        .update({ ai_score: score, ai_flags: flags })
        .eq("id", testimonialId);
    } catch {
      /* scoring is best-effort; ai_score stays null on failure */
    }
  });

  return NextResponse.json(
    { success: true, workspace_name: workspace.name, testimonial_id: testimonialId },
    { status: 201 }
  );
}
