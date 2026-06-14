"use client";

import { motion } from "framer-motion";
import { reveal, stagger, revealItem } from "@/lib/design/motion";

/** Reveals children on enter (or when scrolled into view). */
export function Reveal({
  children,
  delay = 0,
  inView = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  inView?: boolean;
  className?: string;
}) {
  const animateProps = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-80px" } }
    : { animate: "show" };

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      {...animateProps}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — wrap RevealChild items inside. */
export function RevealGroup({
  children,
  gap = 0.08,
  delay = 0,
  inView = true,
  className,
}: {
  children: React.ReactNode;
  gap?: number;
  delay?: number;
  inView?: boolean;
  className?: string;
}) {
  const animateProps = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-60px" } }
    : { animate: "show" };

  return (
    <motion.div
      variants={stagger(gap, delay)}
      initial="hidden"
      {...animateProps}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealChild({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealItem} className={className}>
      {children}
    </motion.div>
  );
}
