import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Multi-Location Fleet Account Onboarding Checklist | ClientEnforce",
  description:
    "The complete 30-step fleet account onboarding checklist for multi-location auto service operators — printable, free, ready to use.",
  path: "/downloads/fleet-account-onboarding-checklist/view",
  keywords: ["fleet account onboarding checklist", "fleet onboarding steps", "multi-location fleet checklist"],
  type: "website",
});

const phases = [
  {
    number: "01",
    title: "Fleet account intake and stakeholder assignment",
    description: "Complete before creating the account or assigning service capacity.",
    items: [
      "Collect legal business name, tax ID (EIN), and billing address",
      "Confirm fleet account type: corporate, government, wholesale, or independent",
      "Identify fleet manager (primary contact) and their direct contact details",
      "Identify billing/AP contact separately — do not assume the same person",
      "Identify safety or compliance contact if applicable (DOT-regulated fleets)",
      "Confirm preferred invoicing method: PO-based, net terms, or card on file",
      "Record expected monthly service volume and vehicle count",
      "Assign an internal account owner and set account activation target date",
    ],
  },
  {
    number: "02",
    title: "Vehicle and asset data collection",
    description: "Collect per-vehicle data before any service is scheduled.",
    items: [
      "Collect VIN for each vehicle in the fleet",
      "Record license plate number, state, and registration expiration date",
      "Record vehicle year, make, model, and trim for service planning",
      "Note current odometer reading or hours (for planned maintenance scheduling)",
      "Capture existing maintenance history or last service date if available",
      "Record driver assignment for each vehicle (or 'pool' if unassigned)",
      "Note any active recalls, known issues, or priority vehicles",
    ],
  },
  {
    number: "03",
    title: "Compliance documents and signed agreements",
    description: "No services should be rendered until all documents in this phase are complete.",
    items: [
      "Collect certificate of insurance — verify coverage dates and minimums",
      "Collect copy of state motor carrier operating authority if applicable",
      "Collect signed fleet service agreement (MSA or equivalent)",
      "Collect signed rate schedule or pricing addendum",
      "Collect completed credit application if net terms are requested",
      "Collect ACH authorization or payment card on file if applicable",
      "Collect W-9 for tax reporting if required by your state",
      "Confirm receipt of all documents and log submission date with timestamp",
      "Internal review: all compliance items approved before activation",
    ],
  },
  {
    number: "04",
    title: "Account activation and kickoff readiness",
    description: "Final checks before the account goes live and the first service is scheduled.",
    items: [
      "Verify all required steps in Phases 1–3 are complete (no open items)",
      "Create the account in your service management or DMS system",
      "Set up billing profile: terms, PO requirements, invoice delivery method",
      "Send account activation confirmation to fleet manager with first-service instructions",
      "Schedule first service visit or confirm fleet manager has booking access",
      "Notify service team: new fleet account activated, account tier, and any notes",
    ],
  },
];

export default function FleetChecklistViewPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Header */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-10 sm:py-14">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Free checklist — Multi-location fleet operators</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Multi-Location Fleet Account Onboarding Checklist
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                30 required steps across 4 phases. Use this checklist to standardize fleet account setup across every location and every account manager — so nothing gets missed before the first service call.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Print / Save as PDF
                </button>
                <Link
                  href="/auto-service"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                >
                  See how ClientEnforce enforces this checklist →
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Checklist phases */}
        <section className="print:py-0">
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12 print:space-y-4 print:py-4">
              {phases.map((phase) => (
                <div
                  key={phase.number}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] print:border print:shadow-none sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-0.5 shrink-0 text-4xl font-bold text-[var(--color-bg-muted)] print:text-3xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {phase.number}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                        Phase {phase.number}: {phase.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{phase.description}</p>
                      <ul className="mt-5 space-y-3">
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            {/* Print checkbox */}
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[var(--color-border)] print:rounded-sm" aria-hidden="true" />
                            <span className="text-sm leading-6 text-[var(--color-text-secondary)] print:text-xs">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Automate callout */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 print:hidden sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Want this enforced automatically?</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  ClientEnforce turns this checklist into a required-step workflow
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  Fleet contacts complete their steps through a secure portal. Automated reminders handle follow-up. Required steps block account activation until everything is done. No spreadsheet, no manual chasing.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                  >
                    Start free — live in 20 minutes
                  </Link>
                  <a
                    href="https://calendar.app.google/QfkFs4hWUoCbKupj7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                  >
                    Book a 20-min walkthrough
                  </a>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <div className="print:hidden">
        <PublicFooter />
      </div>
    </div>
  );
}
