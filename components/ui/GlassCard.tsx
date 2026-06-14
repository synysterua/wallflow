"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/design/cn";
import { spring } from "@/lib/design/motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** adds an animated gradient hairline border */
  ring?: boolean;
  /** lifts + brightens on hover */
  interactive?: boolean;
  /** glow color spilled behind the card */
  glow?: "indigo" | "violet" | "cyan" | "none";
}

const GLOW_BG: Record<string, string> = {
  indigo: "before:bg-[radial-gradient(120px_80px_at_50%_0%,rgba(99,102,241,0.18),transparent)]",
  violet: "before:bg-[radial-gradient(120px_80px_at_50%_0%,rgba(139,92,246,0.18),transparent)]",
  cyan: "before:bg-[radial-gradient(120px_80px_at_50%_0%,rgba(34,211,238,0.16),transparent)]",
  none: "",
};

export function GlassCard({
  children,
  className,
  ring = false,
  interactive = false,
  glow = "none",
}: GlassCardProps) {
  return (
    <motion.div
      {...(interactive ? { whileHover: { y: -3 }, transition: spring } : {})}
      className={cn(
        "relative rounded-2xl glass",
        ring && "glow-ring",
        interactive && "transition-colors hover:border-white/15",
        glow !== "none" &&
          cn(
            "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-500",
            interactive ? "hover:before:opacity-100" : "before:opacity-100",
            GLOW_BG[glow]
          ),
        className
      )}
    >
      {children}
    </motion.div>
  );
}
