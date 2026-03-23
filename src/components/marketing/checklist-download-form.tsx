"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  firstName: string;
  email: string;
  companyType: "Agency" | "Consultancy" | "Accounting firm" | "Legal firm" | "Other";
};

const INITIAL_STATE: FormState = {
  firstName: "",
  email: "",
  companyType: "Agency",
};

export function ChecklistDownloadForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent("Client onboarding checklist download lead");
    const body = encodeURIComponent(
      [
        "New checklist download request:",
        `First name: ${form.firstName}`,
        `Email: ${form.email}`,
        `Company type: ${form.companyType}`,
      ].join("\n"),
    );

    // TODO: WIRE EMAIL CAPTURE
    setSubmitted(true);
    window.location.href = `mailto:info@clientenforce.com?subject=${subject}&body=${body}`;
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Your checklist is on its way - check your inbox.</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          If your email app did not open, send your request manually to info@clientenforce.com and we will share the PDF.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/blog/client-onboarding-checklist-template"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
          >
            Read the full onboarding checklist guide →
          </Link>
          <Link
            href="/client-onboarding-software"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
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
          Email
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
          <option value="Legal firm">Legal firm</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
        >
          Send me the checklist
        </button>
      </div>
    </form>
  );
}
