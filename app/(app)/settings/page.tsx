import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: workspaces } = await service
    .from("workspaces")
    .select("name")
    .eq("owner_id", user.id)
    .limit(1);

  const workspace = workspaces?.[0] ?? null;

  return (
    <SettingsClient
      email={user.email ?? ""}
      workspaceName={workspace?.name ?? "My Workspace"}
      geminiConfigured={!!process.env.GEMINI_API_KEY}
    />
  );
}
