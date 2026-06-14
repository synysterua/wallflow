import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CustomizeClient from "./CustomizeClient";

export const dynamic = "force-dynamic";

export default async function CustomizePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: workspaces } = await service
    .from("workspaces")
    .select("id, plan, settings, public_token")
    .eq("owner_id", user.id)
    .limit(1);

  const workspace = workspaces?.[0] ?? null;
  if (!workspace) redirect("/dashboard");

  const settings = (workspace.settings ?? {}) as {
    layout?: string;
    accent?: string;
    watermark?: boolean;
  };

  return (
    <CustomizeClient
      workspaceId={workspace.id}
      plan={workspace.plan}
      token={workspace.public_token}
      initialLayout={settings.layout ?? "grid"}
      initialAccent={settings.accent ?? "#4f46e5"}
      initialWatermark={settings.watermark ?? true}
    />
  );
}
