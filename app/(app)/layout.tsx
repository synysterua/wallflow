import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "./AppShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: workspaces } = await service
    .from("workspaces")
    .select("name, public_token, plan")
    .eq("owner_id", user.id)
    .limit(1);

  const workspace = workspaces?.[0] ?? null;

  return (
    <AppShell
      workspaceName={workspace?.name ?? "My Workspace"}
      plan={workspace?.plan ?? "free"}
      email={user.email ?? ""}
      token={workspace?.public_token ?? ""}
    >
      {children}
    </AppShell>
  );
}
