export default function Loading() {
  return (
    <div className="max-w-5xl space-y-5 animate-pulse">
      <div className="h-6 w-40 bg-white/5 rounded" />
      <div className="glass rounded-xl p-5 space-y-3">
        <div className="h-3 w-32 bg-white/5 rounded" />
        <div className="h-9 w-full bg-white/5 rounded-lg" />
      </div>
      <div className="glass rounded-xl p-5 space-y-4">
        <div className="h-3 w-28 bg-white/5 rounded" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 w-full bg-white/5 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
