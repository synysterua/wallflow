"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Star, ArrowRight } from "lucide-react";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { AIPulse } from "@/components/ui/AIStateIndicator";

const DEMO_TOKEN = "cafecafe000000000000000000000000";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// above-the-fold: animate immediately
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  };
}
// below-the-fold: cinematic scroll reveal
function inView(delay = 0) {
  return {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
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
    <div className="bg-[#08080B] text-zinc-50">

      {/* ── HERO ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 text-center overflow-hidden">
        <HeroBackground />

        <motion.div {...fadeUp(0)} className="relative">
          <span className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-bold text-indigo-200 mb-7">
            <AIPulse size={6} color="99, 102, 241" />
            Now with AI Insights
          </span>
        </motion.div>

        <motion.h1 {...fadeUp(0.08)} className="relative text-5xl sm:text-[4rem] font-extrabold leading-[1.05] tracking-tight mb-6">
          <span className="text-gradient">Turn happy customers into</span>
          <br />
          <span className="text-gradient-accent">your best marketing</span>
        </motion.h1>

        <motion.p {...fadeUp(0.16)} className="relative text-lg text-zinc-400 mb-9 max-w-2xl mx-auto">
          Collect testimonials, approve in one click, embed a beautiful wall anywhere.
          AI-powered quality scoring included — free.
        </motion.p>

        <motion.div {...fadeUp(0.24)} className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all shadow-[0_0_24px_-2px_rgba(99,102,241,0.55)] hover:shadow-[0_0_36px_-2px_rgba(99,102,241,0.8)]"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="text-sm font-medium text-zinc-300 hover:text-white glass rounded-xl px-7 py-3.5 transition-all hover:border-white/15"
          >
            See live demo ↓
          </a>
        </motion.div>

        <motion.p {...fadeUp(0.32)} className="relative text-xs text-zinc-500 mt-6">
          Free forever · No credit card · 2-minute setup
        </motion.p>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <motion.section {...inView()} className="border-y border-white/5 py-7 bg-white/[0.015]">
        <div className="max-w-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex -space-x-2">
            {AVATARS.map((initials) => (
              <div key={initials} className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center border-2 border-[#08080B]">
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
      <section id="demo" className="max-w-5xl mx-auto px-6 py-24">
        <motion.h2 {...inView()} className="text-3xl font-extrabold text-zinc-100 text-center mb-3">
          Your wall of love, live
        </motion.h2>
        <motion.p {...inView(0.08)} className="text-center text-zinc-500 text-sm mb-8">
          Real testimonials. Collected, approved, and embedded in under 2 minutes.
        </motion.p>
        <motion.div {...inView(0.12)} className="rounded-2xl overflow-hidden glass-strong p-1.5">
          <iframe
            src={`${APP_URL}/widget/${DEMO_TOKEN}`}
            style={{ width: "100%", minHeight: "420px", border: "none", borderRadius: "12px" }}
            title="Wallflow live demo"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-y border-white/5 bg-white/[0.015] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 {...inView()} className="text-3xl font-extrabold text-zinc-100 text-center mb-14">
            Up and running in 3 steps
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={item.step} {...inView(i * 0.1)} className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-400/60 to-violet-500/10 mb-3 font-mono">{item.step}</div>
                <h3 className="font-bold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURE ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...inView()}>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 block">
              Wallflow Insights
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-100 mb-5">AI that works for you</h2>
            <ul className="space-y-3.5">
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

          <motion.div {...inView(0.12)} className="glass-strong glow-ring rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AIPulse size={8} color="139, 92, 246" />
              <span className="text-sm font-bold text-zinc-100">AI Insights</span>
              <span className="text-[11px] glass px-2 py-0.5 rounded-full text-zinc-400 ml-auto">Powered by Gemini</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Overall sentiment</span>
                <span className="font-bold text-zinc-200">94%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["#Easy to use", "#Great support", "#Fast setup"].map((t) => (
                <span key={t} className="text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm text-zinc-400 italic">&ldquo;Customers consistently love the simplicity and instant embed.&rdquo;</p>
            <p className="text-xs text-zinc-600">Based on 7 approved testimonials · Updated hourly</p>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-y border-white/5 bg-white/[0.015] py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...inView()} className="text-3xl font-extrabold text-zinc-100 text-center mb-3">
            Simple pricing
          </motion.h2>
          <motion.p {...inView(0.08)} className="text-center text-zinc-500 text-sm mb-10">
            Start free. Upgrade when you need more.
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div {...inView(0.1)} className="glass rounded-2xl p-6 space-y-5">
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
            <motion.div {...inView(0.16)} className="relative glow-ring rounded-2xl p-6 space-y-5 bg-gradient-to-br from-indigo-600/20 to-violet-600/5 border border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.4)]">
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
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.h2 {...inView()} className="text-2xl font-bold text-zinc-100 mb-3">
          One script tag. That&apos;s it.
        </motion.h2>
        <motion.p {...inView(0.08)} className="text-zinc-500 text-sm mb-6">
          Drop this into any HTML page and your wall of love appears instantly.
        </motion.p>
        <motion.code
          {...inView(0.12)}
          className="block glass border-white/5 text-emerald-400 text-xs rounded-xl px-6 py-4 text-left overflow-x-auto font-mono"
        >
          {`<script src="${APP_URL}/embed.js" data-token="<your-token>" async></script>`}
        </motion.code>
      </section>
    </div>
  );
}
