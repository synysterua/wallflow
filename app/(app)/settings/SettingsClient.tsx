"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { updateWorkspaceName } from "@/lib/actions/workspace";

interface Props {
  email: string;
  workspaceName: string;
  geminiConfigured: boolean;
}

export default function SettingsClient({ email, workspaceName, geminiConfigured }: Props) {
  const [name, setName] = useState(workspaceName);
  const [nameError, setNameError] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    startTransition(async () => {
      const result = await updateWorkspaceName(name);
      if (result.error) {
        setNameError(result.error);
      } else {
        setNameSaved(true);
        setTimeout(() => setNameSaved(false), 2000);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your account and workspace.</p>
      </div>

      {/* Account */}
      <section className="glass rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Account</h2>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
          <p className="text-sm text-zinc-300 bg-zinc-900 border border-white/5 rounded-lg px-3 py-2">
            {email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Sign out
        </button>
      </section>

      {/* Workspace */}
      <section className="glass rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Workspace</h2>
        <form onSubmit={handleSaveName} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Workspace name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {nameError && <p className="text-xs text-red-400 mt-1">{nameError}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-all"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            {nameSaved && <span className="text-sm text-emerald-400">Saved!</span>}
          </div>
        </form>
      </section>

      {/* API Keys */}
      <section className="glass rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">API Keys</h2>
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-zinc-200">Gemini API Key</p>
            <p className="text-xs text-zinc-600 mt-0.5">Powers AI scoring and Insights panel</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            geminiConfigured
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {geminiConfigured ? "✓ Configured" : "✗ Missing"}
          </span>
        </div>
        {!geminiConfigured && (
          <p className="text-xs text-zinc-500 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
            Add{" "}
            <code className="font-mono text-amber-400">GEMINI_API_KEY</code> to{" "}
            <code className="font-mono text-zinc-400">.env.local</code>. Free at{" "}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              aistudio.google.com
            </a>{" "}
            (1500 req/day).
          </p>
        )}
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-red-500/20 p-5 space-y-3 bg-red-500/5">
        <h2 className="text-xs font-semibold text-red-500 uppercase tracking-wider">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-200">Delete account</p>
            <p className="text-xs text-zinc-600">Permanently remove your account and all data.</p>
          </div>
          <button
            disabled
            title="Contact support to delete your account"
            className="text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg cursor-not-allowed opacity-50"
          >
            Delete
          </button>
        </div>
        <p className="text-xs text-zinc-600">Contact support@wallflow.app to delete your account.</p>
      </section>
    </div>
  );
}
