import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Checklist Template (Free, Printable) | ClientEnforce",
  description:
    "The complete 25-step client onboarding checklist for agencies, consultants, and service businesses — printable, free, ready to use.",
  path: "/downloads/client-onboarding-checklist/view",
  keywords: ["client onboarding checklist", "client onboarding template", "new client checklist"],
  type: "website",
});

const phases = [
  {
    number: "01",
    title: "Internal setup",
    description: "Complete before the client is involved — this is your house in order.",
    items: [
      "Create the client record in your CRM or project management tool",
      "Assign a dedicated account owner and backup contact internally",
      "Confirm the scope of work, deliverables, and timeline from the signed agreement",
      "Set up internal project folders, file naming conventions, and access permissions",
      "Review the contract for any non-standard terms, payment schedules, or deliverable milestones",
      "Brief internal team members who will be working on this account",
    ],
  },
  {
    number: "02",
    title: "Client intake — days 1–3",
    description: "Collect everything you need from the client before work can begin.",
    items: [
      "Send the welcome email with your onboarding portal link or intake form",
      "Collect legal business name, billing address, and preferred billing contact",
      "Collect primary point of contact and their preferred communication method",
      "Collect access credentials or invites needed (ad accounts, analytics, CMS, etc.)",
      "Collect brand assets: logo files, brand guidelines, color codes, font files",
      "Collect key business context: target customer, main competitors, and positioning",
      "Collect any existing content, campaigns, or data you will build on",
      "Confirm kickoff call date and time — calendar invite sent and accepted",
    ],
  },
  {
    number: "03",
    title: "Document and signature collection",
    description: "All agreements and compliance items must be signed before work begins.",
    items: [
      "Confirm signed service agreement or statement of work is on file",
      "Collect W-9 (or W-8 for international clients) if required for accounting",
      "Collect payment method on file or confirm invoice delivery method",
      "Send and collect signed NDA if required by either party",
      "Confirm all documents are filed and accessible to the account owner",
    ],
  },
  {
    number: "04",
    title: "Kickoff readiness",
    description: "Final checks before the first meeting and first deliverable.",
    items: [
      "Verify all required steps in Phases 1–3 are complete — no open items",
      "Prepare kickoff meeting agenda: goals, timeline, communication cadence, escalation path",
      "Send client a pre-kickoff checklist confirming what they should bring to the call",
      "Confirm all access credentials collected in Phase 2 are working and tested",
      "Set up recurring status update cadence and add to calendar (both parties)",
      "Send the client a welcome summary: who their team is, what happens next, and when",
    ],
  },
];

export default function ClientOnboardingChecklistViewPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Header */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-10 sm:py-14">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Free checklist — Agencies, consultants, and service businesses</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Client Onboarding Checklist
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                25 required steps across 4 phases. Use this checklist to standardize how you onboard every new client — so nothing gets missed, no matter who is running the account.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrintButton />
                <Link
                  href="/client-onboarding-software"
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
                  Clients complete their steps through a secure portal. Automated reminders handle follow-up. Required steps block kickoff until everything is done. No spreadsheet, no manual chasing.
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
