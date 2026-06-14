import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PatchSchema = z
  .object({
    id: z.string().uuid(),
    status: z.enum(["pending", "approved", "hidden"]),
  })
  .strict();

const DeleteSchema = z.object({ id: z.string().uuid() }).strict();

async function getWorkspaceId(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1);

  return data?.[0]?.id ?? null;
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const supabase = await createServerSupabaseClient();
  const workspaceId = await getWorkspaceId(supabase);
  if (!workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as unknown;
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 422 });
  }

  const { id, status } = parsed.data;

  const { error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  revalidatePath("/dashboard");

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const supabase = await createServerSupabaseClient();
  const workspaceId = await getWorkspaceId(supabase);
  if (!workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as unknown;
  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 422 });
  }

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", parsed.data.id)
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  revalidatePath("/dashboard");
  return NextResponse.json({ success: true });
}
