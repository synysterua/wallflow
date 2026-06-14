"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { AIPulse } from "@/components/ui/AIStateIndicator";

interface Props {
  themes: string[];
  sentiment: number;
  oneliner: string;
  count: number;
}

export default function InsightsPanelClient({ themes, sentiment, oneliner, count }: Props) {
  const [copied, setCopied] = useState(false);

  function copyOneliner(): void {
    void navigator.clipboard.writeText(oneliner).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="glass-strong glow-ring rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <AIPulse size={8} color="139, 92, 246" />
        <span className="text-sm font-bold text-zinc-100">AI Insights</span>
        <span className="text-[11px] glass px-2 py-0.5 rounded-full text-zinc-400 ml-auto">
          Powered by Gemini
        </span>
      </div>

      {/* Sentiment */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Overall sentiment</span>
          <span className="font-bold text-zinc-200">{sentiment}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${sentiment}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"
          />
        </div>
      </div>

      {/* Themes */}
      {themes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <span
              key={theme}
              className="text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full"
            >
              #{theme}
            </span>
          ))}
        </div>
      )}

      {/* One-liner */}
      {oneliner && (
        <div className="flex items-start gap-3">
          <p className="flex-1 text-sm text-zinc-400 italic">&ldquo;{oneliner}&rdquo;</p>
          <button
            onClick={copyOneliner}
            aria-label="Copy one-liner to clipboard"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      <p className="text-xs text-zinc-500">
        Based on {count} approved testimonial{count !== 1 ? "s" : ""} · Updated hourly
      </p>
    </div>
  );
}
