import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-zinc-100 px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl font-black text-indigo-500/40 mb-2">404</div>
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Page not found</h1>
        <p className="text-sm text-zinc-500 mb-6">
          The page or link you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
