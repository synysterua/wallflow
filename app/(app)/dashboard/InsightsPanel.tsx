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
  return { ...result, count: data.length };
}

export default async function InsightsPanel({ workspaceId, approvedCount }: Props) {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;

  if (approvedCount < 3) return null;

  if (!geminiConfigured) {
    return (
      <div className="bg-white rounded-xl border-l-4 border-indigo-400 border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-gray-900">✨ AI Insights</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            Powered by Gemini
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Add{" "}
          <code className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">
            GEMINI_API_KEY
          </code>{" "}
          to <code className="font-mono text-gray-600">.env.local</code> for AI insights
          (free at{" "}
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            aistudio.google.com
          </a>
          ).
        </p>
      </div>
    );
  }

  const cachedFetch = unstable_cache(
    () => fetchInsights(workspaceId),
    [`insights-${workspaceId}`],
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
