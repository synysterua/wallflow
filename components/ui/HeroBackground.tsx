// Decorative, GPU-only hero backdrop: drifting glow orbs + an animated
// node constellation with flowing energy lines. No JS animation loop.

const NODES = [
  { x: 120, y: 110, c: "99,102,241", r: 4, d: "0s" },
  { x: 320, y: 70, c: "139,92,246", r: 3, d: "0.6s" },
  { x: 540, y: 130, c: "34,211,238", r: 4, d: "1.1s" },
  { x: 690, y: 90, c: "99,102,241", r: 3, d: "0.3s" },
  { x: 220, y: 300, c: "34,211,238", r: 3, d: "0.9s" },
  { x: 430, y: 340, c: "139,92,246", r: 5, d: "0.2s" },
  { x: 640, y: 300, c: "99,102,241", r: 3, d: "1.4s" },
  { x: 380, y: 200, c: "34,211,238", r: 4, d: "0.7s" },
];

const LINKS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [0, 7], [7, 5], [4, 5], [5, 6], [2, 7], [1, 7], [5, 2],
];

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* drifting glow orbs */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full blur-[130px] animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)" }} />
      <div className="absolute top-[24%] left-[22%] w-[360px] h-[300px] rounded-full blur-[110px] animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)" }} />
      <div className="absolute top-[20%] right-[18%] w-[320px] h-[260px] rounded-full blur-[100px] animate-float"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)" }} />

      {/* grid */}
      <div className="absolute inset-0 bg-grid mask-radial opacity-60" />

      {/* node constellation */}
      <svg
        className="absolute inset-0 w-full h-full mask-radial"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {LINKS.map(([a, b], i) => {
          const na = NODES[a]!;
          const nb = NODES[b]!;
          return (
            <g key={i}>
              <line
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
              <line
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={`rgba(${na.c}, 0.7)`} strokeWidth="1.5"
                className="animate-flow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </g>
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 3} fill={`rgba(${n.c}, 0.18)`}
              className="animate-pulse-glow" style={{ animationDelay: n.d, transformOrigin: `${n.x}px ${n.y}px` }} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={`rgb(${n.c})`} />
          </g>
        ))}
      </svg>
    </div>
  );
}
