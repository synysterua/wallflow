import { Suspense } from "react";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import InsightsPanel from "./InsightsPanel";
import { SystemStatusBar } from "@/components/ui/SystemStatusBar";
import { LiveActivityFeed } from "@/components/ui/LiveActivityFeed";
import { Activity } from "lucide-react";

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
  const rows = (testimonials ?? []).map((t) => ({
    ...t,
    ai_score: t.ai_score ?? null,
    ai_flags: Array.isArray(t.ai_flags) ? (t.ai_flags as string[]) : [],
  }));
  const approvedCount = rows.filter((t) => t.status === "approved").length;
  const pendingCount = rows.filter((t) => t.status === "pending").length;
  const aiActive = !!process.env.GEMINI_API_KEY;
  const recent = rows.slice(0, 6);

  return (
    <div className="max-w-6xl space-y-6">
      {/* System status */}
      <SystemStatusBar
        aiActive={aiActive}
        plan={workspace.plan}
        total={rows.length}
        approved={approvedCount}
        pending={pendingCount}
      />

      {/* AI Insights */}
      {approvedCount >= 3 && (
        <Suspense fallback={<InsightsSkeleton />}>
          <InsightsPanel workspaceId={workspace.id} approvedCount={approvedCount} />
        </Suspense>
      )}

      {/* Intelligence layout: management table (left) + live activity (right) */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <DashboardClient
            workspace={{
              id: workspace.id,
              name: workspace.name,
              public_token: workspace.public_token,
              plan: workspace.plan,
            }}
            testimonials={rows}
            appUrl={appUrl}
          />
        </div>

        {recent.length > 0 && (
          <aside className="glass rounded-2xl p-5 lg:sticky lg:top-20">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Live activity
              </h2>
              <span className="relative flex h-1.5 w-1.5 ml-1">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
            </div>
            <LiveActivityFeed items={recent} />
          </aside>
        )}
      </div>
    </div>
  );
}
