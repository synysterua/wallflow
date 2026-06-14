import { Suspense } from "react";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import InsightsPanel from "./InsightsPanel";

export const dynamic = "force-dynamic";

function InsightsSkeleton() {
  return (
    <div className="glass rounded-xl border-l-2 border-indigo-500/40 p-5 space-y-4 animate-pulse">
      <div className="h-4 w-28 bg-white/5 rounded" />
      <div className="h-1.5 w-full bg-white/5 rounded-full" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-white/5 rounded-full" />
        <div className="h-6 w-24 bg-white/5 rounded-full" />
        <div className="h-6 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="h-3 w-3/4 bg-white/5 rounded" />
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();

  // Insert is idempotent — unique index on owner_id silently rejects duplicates
  await service.from("workspaces").insert({
    owner_id: user.id,
    name: "My Workspace",
  });

  // Always fetch after the attempted insert
  const { data: workspaces } = await service
    .from("workspaces")
    .select("id, name, public_token, plan, settings")
    .eq("owner_id", user.id)
    .limit(1);

  const workspace = workspaces?.[0] ?? null;

  if (!workspace) {
    return <p className="text-red-500 text-sm">Failed to load workspace.</p>;
  }

  const { data: testimonials } = await service
    .from("testimonials")
    .select(
      "id, author_name, author_title, content, rating, status, created_at, ai_score, ai_flags"
    )
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const rows = testimonials ?? [];
  const approvedCount = rows.filter((t) => t.status === "approved").length;

  return (
    <div className="max-w-5xl space-y-6">
      {approvedCount >= 3 && (
        <Suspense fallback={<InsightsSkeleton />}>
          <InsightsPanel workspaceId={workspace.id} approvedCount={approvedCount} />
        </Suspense>
      )}

      <DashboardClient
        workspace={{
          id: workspace.id,
          name: workspace.name,
          public_token: workspace.public_token,
          plan: workspace.plan,
        }}
        testimonials={rows.map((t) => ({
          ...t,
          ai_score: t.ai_score ?? null,
          ai_flags: Array.isArray(t.ai_flags) ? (t.ai_flags as string[]) : [],
        }))}
        appUrl={appUrl}
      />
    </div>
  );
}
