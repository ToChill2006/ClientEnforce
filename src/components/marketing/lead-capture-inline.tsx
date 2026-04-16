"use client";

import { useState } from "react";

type Props = {
  asset: string;
  vertical?: string;
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
};

export function LeadCaptureInline({
  asset,
  vertical = "",
  placeholder = "your@email.com",
  buttonLabel = "Get the free checklist",
  successMessage = "Check your inbox — the checklist link is on its way.",
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: "", email, asset, vertical }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-sm font-semibold text-[var(--color-success)]">
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {loading ? "Sending…" : buttonLabel}
      </button>
      {error && (
        <p className="w-full text-xs text-[var(--color-danger)]">{error}</p>
      )}
    </form>
  );
}
