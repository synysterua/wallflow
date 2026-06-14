"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Copy, Check, ExternalLink } from "lucide-react";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  content: string;
  rating: number | null;
  status: string;
  created_at: string;
  ai_score: number | null;
  ai_flags: string[];
}

interface WorkspaceInfo {
  id: string;
  name: string;
  public_token: string;
  plan: string;
}

interface Props {
  workspace: WorkspaceInfo;
  testimonials: Testimonial[];
  appUrl: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  hidden: "bg-zinc-800 text-zinc-500 border border-white/5",
};

function AiScorePill({ score, flags }: { score: number | null; flags: string[] }) {
  if (score === null) return <span className="text-zinc-700 text-xs font-mono">—</span>;
  const color =
    score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
    score >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
    "bg-red-500/10 text-red-400 border-red-500/20";
  const tooltip = flags.length > 0 ? flags.join(", ") : "No issues";
  return (
    <span title={tooltip} className={`text-xs font-bold px-1.5 py-0.5 rounded border cursor-help ${color}`}>
      {score}
    </span>
  );
}

export default function DashboardClient({ workspace, testimonials, appUrl }: Props) {
  const [items, setItems] = useState(testimonials);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedCollect, setCopiedCollect] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const embedSnippet = `<script src="${appUrl}/embed.js" data-token="${workspace.public_token}" async></script>`;
  const collectUrl = `${appUrl}/collect/${workspace.public_token}`;
  const pendingCount = items.filter((t) => t.status === "pending").length;

  async function updateStatus(id: string, status: string): Promise<void> {
    setLoadingId(id);
    const res = await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      router.refresh();
    }
    setLoadingId(null);
  }

  async function deleteTestimonial(id: string): Promise<void> {
    if (!confirm("Delete this testimonial?")) return;
    setLoadingId(id);
    const res = await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    }
    setLoadingId(null);
  }

  function copy(text: string, which: "embed" | "collect"): void {
    void navigator.clipboard.writeText(text).then(() => {
      if (which === "embed") {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      } else {
        setCopiedCollect(true);
        setTimeout(() => setCopiedCollect(false), 2000);
      }
    });
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-100">Dashboard</h1>
        {pendingCount > 0 && (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full">
            {pendingCount} pending review
          </span>
        )}
      </div>

      {/* Embed snippet */}
      <div className="glass rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Embed widget</h2>
        <div className="flex gap-2">
          <code className="flex-1 bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-emerald-400 overflow-x-auto whitespace-nowrap font-mono">
            {embedSnippet}
          </code>
          <button
            onClick={() => copy(embedSnippet, "embed")}
            aria-label="Copy embed snippet"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedEmbed ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">Collect form:</span>
          <a
            href={collectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono truncate flex items-center gap-1"
          >
            {collectUrl}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <button
            onClick={() => copy(collectUrl, "collect")}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto shrink-0"
          >
            {copiedCollect ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Testimonials */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Testimonials ({items.length})
          </h2>
          <a
            href={`/widget/${workspace.public_token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Preview widget <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {items.length === 0 && (
          <div className="px-5 py-14 text-center space-y-3">
            <p className="text-sm text-zinc-400 font-medium">No testimonials yet.</p>
            <p className="text-xs text-zinc-600">Share your collect link to get your first testimonial.</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <a
                href={collectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono break-all flex items-center gap-1"
              >
                {collectUrl} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <button
                onClick={() => copy(collectUrl, "collect")}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap"
              >
                {copiedCollect ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="divide-y divide-white/5">
            {items.map((t) => {
              const isAutoApprove = t.ai_score !== null && t.ai_score >= 85 && t.status === "pending";
              return (
                <div key={t.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-zinc-100">{t.author_name}</span>
                      {t.author_title && (
                        <span className="text-xs text-zinc-500">{t.author_title}</span>
                      )}
                      {t.rating !== null && (() => {
                        const r = Math.max(0, Math.min(5, t.rating));
                        return (
                          <span className="text-xs">
                            <span className="text-yellow-400">{"★".repeat(r)}</span>
                            <span className="text-zinc-700">{"☆".repeat(5 - r)}</span>
                          </span>
                        );
                      })()}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status] ?? "bg-zinc-800 text-zinc-500"}`}>
                        {t.status}
                      </span>
                      <AiScorePill score={t.ai_score} flags={t.ai_flags} />
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2">{t.content}</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {t.status !== "approved" && (
                      <button
                        onClick={() => void updateStatus(t.id, "approved")}
                        disabled={loadingId === t.id}
                        className="text-xs px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1"
                      >
                        {isAutoApprove && <span title="AI recommends"><Sparkles className="w-3 h-3" /></span>}
                        Approve
                      </button>
                    )}
                    {t.status !== "hidden" && (
                      <button
                        onClick={() => void updateStatus(t.id, "hidden")}
                        disabled={loadingId === t.id}
                        className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        Hide
                      </button>
                    )}
                    {t.status !== "pending" && (
                      <button
                        onClick={() => void updateStatus(t.id, "pending")}
                        disabled={loadingId === t.id}
                        className="text-xs px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        Pending
                      </button>
                    )}
                    <button
                      onClick={() => void deleteTestimonial(t.id)}
                      disabled={loadingId === t.id}
                      className="text-xs px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
