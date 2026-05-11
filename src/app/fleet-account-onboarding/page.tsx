import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Fleet Account Onboarding Software | ClientEnforce",
  description:
    "Fleet account onboarding software that enforces required documents, signed agreements, and compliance steps before an account goes live. Free trial.",
  path: "/fleet-account-onboarding",
  keywords: [
    "fleet account onboarding software",
    "fleet client onboarding",
    "fleet account intake",
    "fleet management client onboarding",
    "fleet account setup software",
    "client onboarding software",
  ],
  type: "website",
});

const faqItems = [
  {
    question: "What is fleet account onboarding software?",
    answer:
      "Fleet account onboarding software structures the intake process for new fleet clients — collecting required documents, signed service agreements, vehicle lists, driver authorisations, and payment information before the account goes live. It replaces email-based intake with an enforced, trackable workflow so nothing is missed.",
  },
  {
    question: "What documents are typically required for fleet account onboarding?",
    answer:
      "Fleet account onboarding typically requires: a signed service or master account agreement, company registration documents, an authorised signatories form, an initial vehicle list or fleet register, driver licence and authorisation records, insurance certificates, and payment method on file. ClientEnforce enforces completion of every required item before the account is marked active.",
  },
  {
    question: "How does ClientEnforce handle fleet accounts with multiple contacts?",
    answer:
      "Fleet accounts often involve a fleet manager, a finance contact, and sometimes a driver coordinator. ClientEnforce lets you send one portal link that multiple stakeholders can access, with each required task clearly assigned and tracked until complete.",
  },
  {
    question: "Can we use different onboarding templates for different fleet types?",
    answer:
      "Yes. Build separate templates for commercial fleet accounts, government fleet accounts, or specific service tiers. Each template defines its own required steps, documents, and intake questions.",
  },
  {
    question: "How long does fleet account setup take with ClientEnforce?",
    answer:
      "Most teams build their first fleet account onboarding template in under 20 minutes. Clients complete intake through the secure portal without creating an account — no friction on their side.",
  },
  {
    question: "How is fleet account onboarding software different from generic CRM onboarding?",
    answer:
      "Generic CRM onboarding tracks deal stages and contact history but does not enforce structured data collection from the client side. Fleet account onboarding software gives each new account a client-facing portal where required steps — vehicle lists, signed agreements, insurance certificates, driver records — must be completed before the account advances. The difference is enforcement: CRMs tell you what is missing; dedicated onboarding software prevents you from proceeding without it.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FleetAccountOnboardingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Fleet account onboarding software</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Fleet Account Onboarding Software for Multi-Location Operators
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Fleet account onboarding software gives auto service operators, dealerships, and commercial fleet managers a structured intake workflow that collects signed agreements, insurance certificates, vehicle rosters, and driver records — before the account goes live. Required steps are enforced. Automated reminders chase contacts until every item is complete.
              </p>

              {/* Cross-link to blog */}
              <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-5 py-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Want to understand the fleet onboarding process first?{" "}
                  <Link href="/blog/fleet-account-onboarding" className="font-semibold text-[var(--color-accent)] underline underline-offset-2">
                    How the fleet onboarding process works →
                  </Link>
                </p>
              </div>

              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "Fleet account onboarding software enforces required documents before account activation",
                  "Automated reminders chase contacts when tasks are overdue — no manual follow-up",
                  "Single portal link — no account creation required for fleet contacts",
                  "Full timestamped audit trail of every submission and signature",
                  "Dashboard showing completion status across all active fleet accounts",
                  "Build separate templates for commercial, government, or tiered fleet accounts",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Try ClientEnforce free
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  See all features
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  The fleet account intake problem
                </h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <li>• A new fleet account is activated before the signed service agreement arrives back.</li>
                  <li>• The vehicle list was emailed three weeks ago — the fleet manager sent the wrong version.</li>
                  <li>• Driver authorisation forms are scattered across email threads from three different contacts.</li>
                  <li>• You cannot tell which accounts have completed intake and which are still missing documents.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  How ClientEnforce handles fleet account onboarding
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Build a fleet intake template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Define every required step — service agreement signature, vehicle list upload, driver records, insurance certificate, payment setup. Mark each as required.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Send one portal link to the fleet contact</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Fleet managers complete required tasks, upload documents, and sign agreements in one secure portal — no email attachments.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Activate the account when intake is complete</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Required steps must all be complete before onboarding closes. Automated reminders chase overdue tasks. Your team is alerted when the account is ready.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  What fleet teams collect through ClientEnforce
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Signed service agreements", "Capture the master account agreement or service contract within the onboarding flow — no separate e-signature tool needed."],
                    ["Vehicle registers and fleet lists", "Clients upload their current vehicle list directly to the portal. Every submission is timestamped and version-controlled."],
                    ["Driver authorisation records", "Collect driver licence details, authorisation forms, and any required declarations as part of structured intake."],
                    ["Insurance and compliance certificates", "Required insurance documents are uploaded and verified before the account goes live — not chased after activation."],
                  ].map(([title, body]) => (
                    <article key={title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Pricing and getting started
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  ClientEnforce is free to start. Build your first fleet account onboarding template in under 20 minutes. Paid plans from £29/month for growing teams — no per-client fees, no setup costs.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">Start free trial</Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">View pricing →</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Frequently asked questions about fleet account onboarding software
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {faqItems.map((item) => (
                    <article key={item.question} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-portal-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client portal software</Link>
                  <Link href="/client-intake-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client intake software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">onboarding automation</Link>
                  <Link href="/blog/fleet-account-onboarding" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">How the fleet onboarding process works →</Link>
                  <Link href="/law-firm" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">law firm onboarding</Link>
                  <Link href="/auto-service" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">auto-service onboarding</Link>
                  <Link href="/downloads/fleet-account-onboarding-checklist" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">fleet onboarding checklist</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Ready to enforce every fleet account intake step?
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  Build your first fleet onboarding template in under 20 minutes and stop activating accounts with incomplete intake.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-bg-subtle)]">Try ClientEnforce free</Link>
                  <Link href="/blog/fleet-account-onboarding" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20">How the fleet onboarding process works →</Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={faqSchema} />
    </div>
  );
}
