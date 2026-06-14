import { createServiceClient } from "@/lib/supabase/server";
import { tokenSchema } from "@/lib/validation/schemas";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WidgetClient from "./WidgetClient";

export const metadata: Metadata = { robots: "noindex" };

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function WidgetPage({ params }: Props) {
  const { token } = await params;

  const tokenResult = tokenSchema.safeParse(token);
  if (!tokenResult.success) notFound();

  const supabase = createServiceClient();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, plan, settings")
    .eq("public_token", token)
    .single();

  if (!workspace) notFound();

  const settings = (workspace.settings ?? {}) as {
    layout?: string;
    accent?: string;
    watermark?: boolean;
  };

  const layout = settings.layout ?? "grid";
  const accent = /^#[0-9a-fA-F]{6}$/.test(settings.accent ?? "")
    ? settings.accent!
    : "#4f46e5";
  const showWatermark = workspace.plan === "free" ? true : (settings.watermark ?? false);

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, author_name, author_title, author_avatar_url, content, rating, created_at")
    .eq("workspace_id", workspace.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <WidgetClient
        testimonials={testimonials ?? []}
        layout={layout}
        accent={accent}
        showWatermark={showWatermark}
      />
    </>
  );
}
