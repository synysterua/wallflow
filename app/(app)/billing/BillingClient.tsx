"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AIPulse } from "@/components/ui/AIStateIndicator";

interface Props {
  plan: string;
  stripeConfigured: boolean;
  success: boolean;
  canceled: boolean;
}

const FREE_FEATURES = [
  { label: "10 testimonials", ok: true },
  { label: "Public collect form", ok: true },
  { label: "Embed widget", ok: true },
  { label: "AI quality scoring", ok: true },
  { label: "Wallflow watermark", ok: false },
  { label: "Custom colors", ok: false },
];

const PRO_FEATURES = [
  { label: "Unlimited testimonials", ok: true },
  { label: "Remove watermark", ok: true },
  { label: "All layouts", ok: true },
  { label: "Custom accent color", ok: true },
  { label: "Full AI Insights panel", ok: true },
  { label: "Priority support", ok: true },
];

export default function BillingClient({ plan, stripeConfigured, success, canceled }: Props) {
  const [loading, setLoading] = useState(false);
  const isPro = plan === "pro";

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json() as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
    else { alert(data.error ?? "Failed to start checkout."); setLoading(false); }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Billing</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Current plan:{" "}
          <span className={`font-semibold ${isPro ? "text-indigo-400" : "text-zinc-400"}`}>
            {isPro ? "Pro" : "Free"}
          </span>
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-4">
          <p className="text-emerald-400 font-medium text-sm">
            🎉 You&apos;re now on the Pro plan! Enjoy unlimited testimonials and no watermark.
          </p>
        </div>
      )}

      {canceled && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4">
          <p className="text-amber-400 text-sm">
            Checkout canceled. You&apos;re still on the Free plan.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 items-start">
        {/* Free */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Free</h2>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
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
          {!isPro && (
            <span className="block text-center text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-2">
              Current plan
            </span>
          )}
        </div>

        {/* Pro */}
        <div className="relative glow-ring rounded-2xl p-6 space-y-4 bg-gradient-to-br from-indigo-600/20 to-violet-600/5 border border-indigo-500/30 shadow-[0_0_45px_-12px_rgba(99,102,241,0.4)]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-100">Pro</h2>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100">
            €19<span className="text-sm font-normal text-zinc-500">/mo</span>
          </p>
          <ul className="space-y-2">
            {PRO_FEATURES.map(({ label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-zinc-300">
                {label === "Full AI Insights panel"
                  ? <span className="shrink-0"><AIPulse size={6} color="139, 92, 246" /></span>
                  : <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                }
                {label}
              </li>
            ))}
          </ul>
          {isPro ? (
            <span className="block text-center text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-2">
              Current plan
            </span>
          ) : stripeConfigured ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              {loading ? "Redirecting…" : "Upgrade to Pro"}
            </button>
          ) : (
            <div className="text-xs text-zinc-600 text-center bg-zinc-900 border border-white/5 rounded-lg py-2 px-3">
              Add STRIPE_SECRET_KEY &amp; NEXT_PUBLIC_STRIPE_PRICE_ID to .env.local
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
