"use client";

import { useState, use } from "react";
import { tokenSchema } from "@/lib/validation/schemas";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ token: string }>;
}

const EMPTY_FORM = {
  author_name: "",
  author_title: "",
  content: "",
  rating: 5,
  author_avatar_url: "",
};

export default function CollectPage({ params }: Props) {
  const { token } = use(params);

  if (!tokenSchema.safeParse(token).success) {
    notFound();
  }

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload: Record<string, unknown> = {
      author_name: form.author_name.trim(),
      content: form.content.trim(),
      rating: form.rating,
    };
    if (form.author_title.trim()) payload.author_title = form.author_title.trim();
    if (form.author_avatar_url.trim()) payload.author_avatar_url = form.author_avatar_url.trim();

    try {
      const res = await fetch(`/api/collect/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({})) as {
        error?: string;
        workspace_name?: string;
      };

      if (res.status === 429) {
        setErrorMsg("Too many submissions. Please wait a minute and try again.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setWorkspaceName(data.workspace_name ?? "");
      setForm(EMPTY_FORM);
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h1>
          <p className="text-gray-600 text-sm">
            Your testimonial
            {workspaceName ? ` for ${workspaceName}` : ""} has been submitted and
            will appear after review.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-indigo-600 hover:underline"
          >
            Submit another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Share your experience</h1>
        <p className="text-gray-500 text-sm mb-6">
          We&apos;d love to hear what you think.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title / Company
            </label>
            <input
              type="text"
              maxLength={120}
              value={form.author_title}
              onChange={(e) => setForm((f) => ({ ...f, author_title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="CEO at Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: star }))}
                  className={`text-2xl transition-colors leading-none ${
                    star <= form.rating ? "text-yellow-400" : "text-gray-200"
                  } hover:text-yellow-400`}
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              minLength={3}
              maxLength={600}
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Tell us about your experience…"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {form.content.length}/600
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL{" "}
              <span className="text-gray-400 font-normal">(optional, https only)</span>
            </label>
            <input
              type="url"
              maxLength={500}
              value={form.author_avatar_url}
              onChange={(e) => setForm((f) => ({ ...f, author_avatar_url: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              "Submit testimonial"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
