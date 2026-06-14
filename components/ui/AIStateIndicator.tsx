"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/design/cn";

/** Three small bouncing dots — the "AI is thinking" signal. */
export function TypingDots({ color = "rgb(139,92,246)" }: { color?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full"
          style={{
            background: color,
            animation: `typingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

/** A soft breathing orb — the AI "idle / alive" presence. */
export function AIPulse({
  size = 8,
  color = "139, 92, 246",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{ background: `rgba(${color}, 0.35)`, filter: "blur(3px)" }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: `rgb(${color})` }}
      />
    </span>
  );
}

function scoreColor(score: number): { rgb: string; text: string } {
  if (score >= 80) return { rgb: "16, 185, 129", text: "text-emerald-400" };
  if (score >= 50) return { rgb: "245, 158, 11", text: "text-amber-400" };
  return { rgb: "239, 68, 68", text: "text-red-400" };
}

/**
 * Renders the AI scoring state of a testimonial.
 * - score === null  → "scoring" (thinking) state
 * - score is number → revealed, color-coded score chip with glow
 */
export function AIScore({
  score,
  flags,
  className,
}: {
  score: number | null;
  flags: string[];
  className?: string;
}) {
  if (score === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
          "bg-violet-500/10 border border-violet-500/20 text-violet-300",
          className
        )}
        title="AI is scoring this testimonial"
      >
        <AIPulse size={6} />
        scoring
        <TypingDots />
      </span>
    );
  }

  const c = scoreColor(score);
  const tooltip = flags.length > 0 ? `Flags: ${flags.join(", ")}` : "No issues detected";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      title={tooltip}
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold cursor-help border",
        c.text,
        className
      )}
      style={{
        background: `rgba(${c.rgb}, 0.10)`,
        borderColor: `rgba(${c.rgb}, 0.25)`,
        boxShadow: `0 0 12px -4px rgba(${c.rgb}, 0.6)`,
      }}
    >
      {score}
    </motion.span>
  );
}
