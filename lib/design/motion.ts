import type { Variants, Transition } from "framer-motion";

// Unified spring + tween presets so every interaction shares timing.
export const spring: Transition = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 };
export const springSoft: Transition = { type: "spring", stiffness: 200, damping: 26 };
export const easeOut: Transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

// Enter/scroll reveal
export const reveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

// Staggered container for lists / grids
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: easeOut },
};

// Hover lift used by interactive glass cards
export const hoverLift = {
  whileHover: { y: -3, transition: spring },
  whileTap: { scale: 0.985 },
};
