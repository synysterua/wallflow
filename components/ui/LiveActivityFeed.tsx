"use client";

import { motion } from "framer-motion";
import { stagger, revealItem } from "@/lib/design/motion";
import { AIScore } from "./AIStateIndicator";

interface ActivityItem {
  id: string;
  author_name: string;
  status: string;
  ai_score: number | null;
  ai_flags: string[];
  created_at: string;
}

const STATUS_META: Record<string, { dot: string; label: string }> = {
  approved: { dot: "bg-emerald-400", label: "approved & live" },
  pending: { dot: "bg-amber-400", label: "awaiting review" },
  hidden: { dot: "bg-zinc-500", label: "hidden" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function LiveActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null;

  return (
    <motion.ul
      variants={stagger(0.06)}
      initial="hidden"
      animate="show"
      className="flex flex-col"
    >
      {items.map((it) => {
        const meta = STATUS_META[it.status] ?? STATUS_META.pending!;
        return (
          <motion.li
            key={it.id}
            variants={revealItem}
            className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
          >
            <span className={`relative flex h-2 w-2 shrink-0`}>
              {it.status === "pending" && (
                <span className={`absolute inline-flex h-full w-full rounded-full ${meta.dot} opacity-50 animate-ping`} />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${meta.dot}`} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200 truncate">
                <span className="font-medium">{it.author_name}</span>{" "}
                <span className="text-zinc-500">— {meta.label}</span>
              </p>
            </div>

            <AIScore score={it.ai_score} flags={it.ai_flags} />
            <span className="text-xs text-zinc-600 tabular-nums w-16 text-right shrink-0">
              {relativeTime(it.created_at)}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
