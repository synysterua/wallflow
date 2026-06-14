"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Star, ArrowRight } from "lucide-react";

const DEMO_TOKEN = "cafecafe000000000000000000000000";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.45, ease: "easeOut" as const },
  };
}

const AVATARS = ["AB", "JD", "MK", "RL", "PW"];

const HOW_IT_WORKS = [
  { step: "01", title: "Share your link", desc: "Customers submit testimonials via your public collect form — no account needed." },
  { step: "02", title: "Review AI scores", desc: "Every testimonial is scored 0–100 for quality. Approve the best ones in one click." },
  { step: "03", title: "Copy the snippet", desc: "Paste one script tag on any website. Your wall of love appears instantly." },
];

const FREE_FEATURES = [
  { label: "Up to 10 testimonials", ok: true },
  { label: "1 embeddable widget", ok: true },
  { label: "AI quality scoring", ok: true },
  { label: "Grid layout", ok: true },
  { label: "Wallflow watermark", ok: false },
  { label: "Custom colors", ok: false },
];

const PRO_FEATURES = [
  { label: "Unlimited testimonials", ok: true },
  { label: "Remove watermark", ok: true },
  { label: "All layouts (grid, carousel, single)", ok: true },
  { label: "Custom accent color", ok: true },
  { label: "Full AI Insights panel", ok: true },
  { label: "Priority support", ok: true },
];

export default function HomePage() {
  return (
    <div className="bg-[#09090B] text-zinc-50">

      {/* ── HERO ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-28 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-purple-500/10 rounded-full blur-[80px]" />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at center, black, transparent 75%)",
          }} />
        </div>

        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-1.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Now with AI Insights
          </span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-tight mb-5">
          Turn happy customers into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            your best marketing
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
          Collect testimonials, approve in one click, embed a beautiful wall anywhere.
          AI-powered quality scoring included — free.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 border border-white/10 hover:border-white/20 px-7 py-3.5 rounded-xl transition-all"
          >
            See live demo ↓
          </a>
        </motion.div>

        <motion.p {...fadeUp(0.4)} className="text-xs text-zinc-600 mt-5">
          Free forever · No credit card · 2-minute setup
        </motion.p>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <motion.section {...fadeUp(0.5)} className="border-y border-white/5 py-7 bg-white/[0.02]">
        <div className="max-w-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex -space-x-2">
            {AVATARS.map((initials) => (
              <div key={initials} className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center border-2 border-[#09090B]">
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-400">
            Join founders already using Wallflow ·{" "}
            <span className="font-semibold text-zinc-200">500+ walls created</span>
          </p>
        </div>
      </motion.section>

      {/* ── LIVE DEMO ── */}
      <section id="demo" className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp(0)} className="text-3xl font-extrabold text-zinc-100 text-center mb-3">
          Your wall of love, live
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-center text-zinc-500 text-sm mb-8">
          Real testimonials. Collected, approved, and embedded in under 2 minutes.
        </motion.p>
        <motion.div {...fadeUp(0.15)} className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <iframe
            src={`${APP_URL}/widget/${DEMO_TOKEN}`}
            style={{ width: "100%", minHeight: "420px", border: "none" }}
            title="Wallflow live demo"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 {...fadeUp(0)} className="text-3xl font-extrabold text-zinc-100 text-center mb-12">
            Up and running in 3 steps
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={item.step} {...fadeUp(i * 0.1)} className="text-center">
                <div className="text-4xl font-black text-indigo-500/30 mb-3 font-mono">{item.step}</div>
                <h3 className="font-bold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURE ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)}>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">
              Wallflow Insights
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-100 mb-4">AI that works for you</h2>
            <ul className="space-y-3">
              {[
                "Every testimonial scored 0–100 for quality and authenticity",
                "Spam and fake reviews flagged automatically",
                "Instant themes analysis: know what customers love most",
                "Powered by Gemini — free, no extra cost",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-zinc-400">
                  <Star className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-100">✨ AI Insights</span>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Powered by Gemini</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Overall sentiment</span>
                  <span className="font-bold text-zinc-200">94%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full">
                  <div className="h-full w-[94%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["#Easy to use", "#Great support", "#Fast setup"].map((t) => (
                  <span key={t} className="text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-sm text-zinc-400 italic">&ldquo;Customers consistently love the simplicity and instant embed.&rdquo;</p>
              <p className="text-xs text-zinc-600">Based on 7 approved testimonials · Updated hourly</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-y border-white/5 bg-white/[0.02] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-3xl font-extrabold text-zinc-100 text-center mb-3">
            Simple pricing
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-center text-zinc-500 text-sm mb-10">
            Start free. Upgrade when you need more.
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Free</h3>
                <p className="text-3xl font-extrabold text-zinc-100 mt-1">
                  €0<span className="text-sm font-normal text-zinc-500">/mo</span>
                </p>
              </div>
              <ul className="space-y-2">
                {FREE_FEATURES.map(({ label, ok }) => (
                  <li key={label} className={`flex items-center gap-2 text-sm ${ok ? "text-zinc-300" : "text-zinc-600"}`}>
                    {ok
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <XCircle className="w-4 h-4 text-zinc-700 shrink-0" />
                    }
                    {label}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-semibold py-2.5 rounded-xl text-sm transition-all">
                Get started
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div {...fadeUp(0.15)} className="relative rounded-2xl p-6 space-y-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Most popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Pro</h3>
                <p className="text-3xl font-extrabold text-zinc-100 mt-1">
                  €19<span className="text-sm font-normal text-zinc-500">/mo</span>
                </p>
              </div>
              <ul className="space-y-2">
                {PRO_FEATURES.map(({ label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    {label}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                Get started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ONE SCRIPT TAG ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.h2 {...fadeUp(0)} className="text-2xl font-bold text-zinc-100 mb-3">
          One script tag. That&apos;s it.
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-zinc-500 text-sm mb-6">
          Drop this into any HTML page and your wall of love appears instantly.
        </motion.p>
        <motion.code
          {...fadeUp(0.15)}
          className="block bg-zinc-900 border border-white/5 text-emerald-400 text-xs rounded-xl px-6 py-4 text-left overflow-x-auto font-mono"
        >
          {`<script src="${APP_URL}/embed.js" data-token="<your-token>" async></script>`}
        </motion.code>
      </section>
    </div>
  );
}
