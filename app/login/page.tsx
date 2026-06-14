"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { AIPulse } from "@/components/ui/AIStateIndicator";
import { Logo } from "@/components/ui/Logo";

const AUTH_ERRORS: Record<string, string> = {
  "Invalid login credentials": "Incorrect email or password.",
  "Email not confirmed": "Please confirm your email before signing in.",
  "User already registered": "An account with this email already exists.",
  "Password should be at least 6 characters": "Password must be at least 6 characters.",
};

function friendlyError(msg: string): string {
  return AUTH_ERRORS[msg] ?? msg;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(friendlyError(err.message));
      else setDone(true);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(friendlyError(err.message));
      else { router.push("/dashboard"); router.refresh(); }
    }
    setLoading(false);
  }

  if (done) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#08080B] px-4 overflow-hidden">
        <HeroBackground />
        <div className="relative text-center max-w-sm">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">Check your email</h1>
          <p className="text-zinc-400 text-sm">
            We sent a confirmation link to{" "}
            <strong className="text-zinc-200">{email}</strong>. Click it to activate
            your account, then sign in.
          </p>
          <button
            onClick={() => { setDone(false); setMode("signin"); }}
            className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#08080B] px-4 overflow-hidden">
      <HeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative glass-strong glow-ring rounded-2xl p-8 w-full max-w-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-7">
          <Logo size={32} className="rounded-lg shadow-[0_0_18px_rgba(99,102,241,0.5)]" />
          <span className="font-bold text-lg text-zinc-100 tracking-tight">Wallflow</span>
        </Link>

        <h1 className="text-base font-semibold text-zinc-200 mb-1 text-center">
          {mode === "signin" ? "Sign in to your account" : "Create your account"}
        </h1>
        <p className="text-xs text-zinc-500 mb-5 text-center flex items-center justify-center gap-1.5">
          <AIPulse size={5} color="99, 102, 241" /> AI-powered testimonial platform
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
          <input
            type="email"
            required
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <input
            type="password"
            required
            minLength={6}
            aria-label="Password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_22px_-2px_rgba(99,102,241,0.5)] hover:shadow-[0_0_32px_-2px_rgba(99,102,241,0.7)]"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-5">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in
              </button>
            </>
          )}
        </p>
      </motion.div>
    </main>
  );
}
