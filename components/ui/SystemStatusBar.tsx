"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { AIPulse } from "./AIStateIndicator";

interface Props {
  aiActive: boolean;
  plan: string;
  total: number;
  approved: number;
  pending: number;
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <span className="text-sm font-bold text-zinc-100 tabular-nums">{value}</span>
      <span className="text-xs text-zinc-500 hidden sm:inline">{label}</span>
    </div>
  );
}

export function SystemStatusBar({ aiActive, plan, total, approved, pending }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl px-4 sm:px-5 py-3 flex items-center gap-4 sm:gap-6 flex-wrap"
    >
      {/* live status */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-xs font-semibold text-zinc-300">System online</span>
      </div>

      <div className="h-4 w-px bg-white/10 hidden sm:block" />

      {/* AI engine */}
      <div className="flex items-center gap-2">
        {aiActive ? (
          <>
            <AIPulse size={7} />
            <span className="text-xs font-medium text-violet-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI engine active
            </span>
          </>
        ) : (
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI engine off
          </span>
        )}
      </div>

      <div className="h-4 w-px bg-white/10 hidden md:block" />

      {/* metrics */}
      <div className="flex items-center gap-4 sm:gap-5 ml-auto">
        <Metric icon={<Activity className="w-3.5 h-3.5" />} label="total" value={total} color="rgb(99,102,241)" />
        <Metric icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="live" value={approved} color="rgb(16,185,129)" />
        <Metric icon={<Clock className="w-3.5 h-3.5" />} label="pending" value={pending} color="rgb(245,158,11)" />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          plan === "pro"
            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
            : "bg-white/5 text-zinc-400 border-white/10"
        }`}>
          {plan === "pro" ? "PRO" : "FREE"}
        </span>
      </div>
    </motion.div>
  );
}
