"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  firstName: string;
  email: string;
  companyType: "Agency" | "Consultant" | "Accountant" | "Other";
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

    setSubmitted(true);
    window.location.href = `mailto:info@clientenforce.com?subject=${subject}&body=${body}`;
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
        <h3 className="text-lg font-semibold text-zinc-900">Thanks, your checklist request is in.</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-700">
          If your email app did not open, send your request manually to info@clientenforce.com and we will share the PDF.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/blog/client-onboarding-checklist-template"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Read the checklist template guide
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Go to ClientEnforce homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="firstName" className="text-sm font-medium text-zinc-800">
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          value={form.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
          placeholder="Alex"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-zinc-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
          placeholder="alex@company.com"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="companyType" className="text-sm font-medium text-zinc-800">
          Company type
        </label>
        <select
          id="companyType"
          name="companyType"
          value={form.companyType}
          onChange={(event) => updateField("companyType", event.target.value as FormState["companyType"])}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
        >
          <option value="Agency">Agency</option>
          <option value="Consultant">Consultant</option>
          <option value="Accountant">Accountant</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
        >
          Send me the checklist
        </button>
      </div>
    </form>
  );
}
