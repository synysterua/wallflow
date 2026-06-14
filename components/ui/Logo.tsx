import { useId } from "react";

/** Wallflow brand mark — gradient squircle + geometric "W" with a cyan flow spark. */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  const raw = useId().replace(/:/g, "");
  const bg = `wf-bg-${raw}`;
  const hi = `wf-hi-${raw}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Wallflow"
      className={className}
    >
      <defs>
        <linearGradient id={bg} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <radialGradient
          id={hi}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 10) rotate(58) scale(42)"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${bg})`} />
      <rect width="64" height="64" rx="16" fill={`url(#${hi})`} />
      <path
        d="M16 20 L24 44 L32 30 L40 44 L48 20"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="29.5" r="2.8" fill="#22D3EE" />
    </svg>
  );
}
