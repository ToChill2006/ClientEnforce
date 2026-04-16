"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  firstName: string;
  email: string;
  companyType: "Agency" | "Consultancy" | "Accounting firm" | "Auto / Fleet service" | "Legal firm" | "Other";
};

const INITIAL_STATE: FormState = {
  firstName: "",
  email: "",
  companyType: "Agency",
};

type Props = {
  /** Slug sent to /api/leads/capture — matches assetMeta keys in the route */
  asset?: string;
  /** URL shown in the success state so the user can view the checklist immediately */
  viewHref?: string;
  viewLabel?: string;
};

export function ChecklistDownloadForm({
  asset = "client-onboarding-checklist",
  viewHref = "/downloads/client-onboarding-checklist/view",
  viewLabel = "View the checklist →",
}: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          companyType: form.companyType,
          asset,
        }),
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
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Check your inbox — the checklist is on its way.
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          We&apos;ve sent the checklist link to <strong>{form.email}</strong>. You can also view it right now below.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={viewHref}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
          >
            {viewLabel}
          </Link>
          <Link
            href="/client-onboarding-software"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
          >
            See how ClientEnforce automates this checklist →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="firstName" className="text-sm font-medium text-[var(--color-text-primary)]">
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          value={form.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="Alex"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="alex@company.com"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="companyType" className="text-sm font-medium text-[var(--color-text-primary)]">
          Company type
        </label>
        <select
          id="companyType"
          name="companyType"
          value={form.companyType}
          onChange={(event) => updateField("companyType", event.target.value as FormState["companyType"])}
          className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-accent)]"
        >
          <option value="Agency">Agency</option>
          <option value="Consultancy">Consultancy</option>
          <option value="Accounting firm">Accounting firm</option>
          <option value="Auto / Fleet service">Auto / Fleet service</option>
          <option value="Legal firm">Legal firm</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {error && (
        <p className="sm:col-span-2 text-sm text-[var(--color-danger)]">{error}</p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send me the checklist"}
        </button>
      </div>
    </form>
  );
}
