// Shared design tokens — single source of truth for the visual system.
// Keep in sync with the CSS custom properties in app/globals.css.

export const glow = {
  indigo: "99, 102, 241",
  violet: "139, 92, 246",
  cyan: "34, 211, 238",
  blue: "59, 130, 246",
  emerald: "16, 185, 129",
} as const;

export type GlowColor = keyof typeof glow;

export function glowRgb(color: GlowColor, alpha = 1): string {
  return `rgba(${glow[color]}, ${alpha})`;
}

export const blur = { sm: 8, md: 16, lg: 28 } as const;

export const duration = { fast: 0.18, base: 0.4, slow: 0.7 } as const;

export const easing = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};
