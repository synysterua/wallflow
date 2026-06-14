import { createServiceClient } from "@/lib/supabase/server";
import { analyzeTestimonials } from "@/lib/ai/gemini";
import { unstable_cache } from "next/cache";
import InsightsPanelClient from "./InsightsPanelClient";

interface Props {
  workspaceId: string;
  approvedCount: number;
}

async function fetchInsights(workspaceId: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("testimonials")
    .select("content, rating")
    .eq("workspace_id", workspaceId)
    .eq("status", "approved")
    .limit(30);

  if (!data || data.length < 3) return null;

  const result = await analyzeTestimonials(
    data.map((t) => ({ content: t.content, rating: t.rating }))
  );
  // Don't cache an empty/failed analysis — hide the panel instead so the
  // next load retries rather than showing a broken 0% card.
  if (result.sentiment === 0 && result.themes.length === 0 && !result.oneliner) {
    return null;
  }
  return { ...result, count: data.length };
}

export default async function InsightsPanel({ workspaceId, approvedCount }: Props) {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;

  if (approvedCount < 3) return null;

  if (!geminiConfigured) {
    return (
      <div className="glass rounded-2xl border-l-2 border-indigo-500/50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-zinc-100">✨ AI Insights</span>
          <span className="text-[11px] glass px-2 py-0.5 rounded-full text-zinc-400">
            Powered by Gemini
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Add{" "}
          <code className="font-mono text-indigo-300 bg-indigo-500/10 px-1 rounded">
            GEMINI_API_KEY
          </code>{" "}
          to <code className="font-mono text-zinc-300">.env.local</code> for AI insights
          (free at{" "}
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            aistudio.google.com
          </a>
          ).
        </p>
      </div>
    );
  }

  // Key by approved count so the analysis refreshes whenever a testimonial is
  // approved/added (and naturally busts any stale/failed cache entry).
  const cachedFetch = unstable_cache(
    () => fetchInsights(workspaceId),
    [`insights-${workspaceId}-${approvedCount}`],
    { revalidate: 3600 }
  );

  const insights = await cachedFetch();
  if (!insights) return null;

  return (
    <InsightsPanelClient
      themes={insights.themes}
      sentiment={insights.sentiment}
      oneliner={insights.oneliner}
      count={insights.count}
    />
  );
}
