"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  workspaceId: string;
  plan: string;
  token: string;
  initialLayout: string;
  initialAccent: string;
  initialWatermark: boolean;
}

const LAYOUTS = [
  { value: "grid", label: "Grid", desc: "Masonry grid of cards" },
  { value: "carousel", label: "Carousel", desc: "Horizontal scrollable row" },
  { value: "single", label: "Single", desc: "One featured testimonial" },
] as const;

export default function CustomizeClient({
  workspaceId, plan, token, initialLayout, initialAccent, initialWatermark,
}: Props) {
  const isPro = plan === "pro";
  const [layout, setLayout] = useState(initialLayout);
  const [accent, setAccent] = useState(initialAccent);
  const [watermark, setWatermark] = useState(initialWatermark);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const supabase = createClient();

  async function save() {
    setSaving(true);
    setSaveError("");
    const { error } = await supabase
      .from("workspaces")
      .update({ settings: { layout, accent, watermark: isPro ? watermark : true } })
      .eq("id", workspaceId);
    setSaving(false);
    if (error) {
      setSaveError("Couldn't save. Please try again.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Customize widget</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Changes apply to your embedded widget after saving.</p>
      </div>

      {/* Layout */}
      <section className="glass-strong rounded-2xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Layout</h2>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setLayout(value)}
              className={`relative text-left rounded-xl p-3 transition-all ${
                layout === value
                  ? "glow-ring bg-indigo-500/10 shadow-[0_0_20px_-6px_rgba(99,102,241,0.5)]"
                  : "border border-white/5 bg-white/[0.02] hover:border-white/10"
              }`}
            >
              <p className={`text-sm font-medium ${layout === value ? "text-indigo-300" : "text-zinc-300"}`}>{label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Accent color */}
      <section className="glass-strong rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Accent color</h2>
          {!isPro && (
            <a href="/billing" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>
              Unlock
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            aria-label="Accent color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            disabled={!isPro}
            className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-900"
          />
          <span className="text-sm font-mono text-zinc-400">{accent}</span>
          {!isPro && <span className="text-xs text-zinc-600">(Pro only)</span>}
        </div>
      </section>

      {/* Watermark */}
      <section className="glass-strong rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            &ldquo;Powered by Wallflow&rdquo; watermark
          </h2>
          {!isPro && (
            <a href="/billing" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>
              Remove
            </a>
          )}
        </div>
        <label className={`flex items-center gap-3 ${!isPro ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={isPro ? watermark : true}
            onChange={(e) => isPro && setWatermark(e.target.checked)}
            disabled={!isPro}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-zinc-400">
            {isPro ? "Show watermark" : "Always shown on Free plan"}
          </span>
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved!</span>}
        {saveError && <span className="text-sm text-red-400">{saveError}</span>}
        <a
          href={`/widget/${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Preview →
        </a>
      </div>
    </div>
  );
}
