import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Franchise Onboarding Software — Consistent Client Intake Across Every Location | ClientEnforce",
  description:
    "Franchise onboarding software that enforces the same client intake process across every franchisee. Standardise documents, signatures, and required steps without relying on each location to figure it out.",
  path: "/franchise-onboarding-software",
  keywords: [
    "franchise onboarding software",
    "franchisee client onboarding",
    "franchise client intake",
    "franchise onboarding process",
    "onboarding software for franchises",
    "client onboarding software",
  ],
  type: "website",
});

const faqItems = [
  {
    question: "What is franchise onboarding software?",
    answer: "Franchise onboarding software structures the client intake process so every franchisee follows the same required steps — collecting documents, capturing signed agreements, and completing compliance steps before a client is activated. It removes reliance on individual franchisee habits and replaces inconsistent email-based intake with a single enforced workflow.",
  },
  {
    question: "How does ClientEnforce help franchise networks standardise client onboarding?",
    answer: "The franchisor builds a master onboarding template with all required intake steps. Each franchisee sends portal links to their new clients using that template. Clients complete intake through a secure portal — no account required. The franchisor gets a dashboard view of completion status across all active onboardings.",
  },
  {
    question: "Can individual franchisees customise their intake templates?",
    answer: "Yes. You can enforce a shared base template across all franchisees while allowing locations to add their own local intake steps on top. The core required steps remain consistent; local variations are additive.",
  },
  {
    question: "Does ClientEnforce support compliance documentation for regulated industries?",
    answer: "Yes. ClientEnforce enforces required document collection and provides a timestamped audit trail of every submission. It supports structured intake for regulated industries including financial services, health and wellness, and automotive. Note: ClientEnforce is onboarding workflow software and does not provide legal or regulatory advice.",
  },
  {
    question: "How quickly can a franchise network get started?",
    answer: "A franchisor can build the master onboarding template in under 20 minutes. Franchisees start sending portal links the same day — no developer setup, no complex integrations.",
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

export default function FranchiseOnboardingSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Franchise onboarding software</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Franchise onboarding software — standardise client intake across every franchisee
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                In a franchise network, the strength of your client intake process depends entirely on the weakest franchisee. If head office does not enforce intake, each location defaults to whatever they think works — email, paper forms, verbal checklists.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce gives franchise networks a single structured intake workflow that every location uses — same required steps, same documents, same enforced completion — with full visibility from head office.
              </p>
              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "Master template enforced across every franchisee location",
                  "Required steps cannot be bypassed — clients complete intake before activation",
                  "Head office dashboard showing completion across all locations",
                  "Automated reminders replace manual follow-up from each location",
                  "Timestamped audit trail per client — exportable for compliance",
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
                  The franchise onboarding problem
                </h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <li>• Franchisee A collects everything correctly. Franchisee B activates clients before documents arrive. Franchisee C does not collect signed agreements at all.</li>
                  <li>• Head office cannot see which clients are mid-intake across the network without calling each location.</li>
                  <li>• When a compliance issue arises, there is no central record of what was collected or signed.</li>
                  <li>• Training new franchisees on intake is a verbal handoff — not a system they can follow.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  How ClientEnforce works for franchise networks
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Franchisor builds the master template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Define every required intake step — documents, signed agreements, compliance records, payment setup. This becomes the standard every franchisee follows.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Franchisees send one portal link</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Each new client gets a secure portal link. They complete all required steps directly — no email attachments, no paper forms. Automated reminders chase overdue tasks.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Head office sees the full picture</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Dashboard shows all active onboardings across the network. Required steps are enforced. Every submission is timestamped and exportable for audit.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  What franchise networks use ClientEnforce for
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Standardised client agreements", "Every franchisee captures the same signed service agreement — no location skips this step because the system enforces it."],
                    ["Document collection across the network", "KYC documents, insurance certificates, compliance records — all collected through the same structured intake regardless of location."],
                    ["Compliance visibility for head office", "Full audit trail per client across the network — what was submitted, when, and by whom. Exportable as a PDF evidence pack."],
                    ["New franchisee onboarding to the system", "Onboarding a new franchisee location takes minutes — send the template, they start using it immediately without training calls."],
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
                  Frequently asked questions
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
                  <Link href="/multi-location-client-onboarding" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">multi-location onboarding</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">onboarding automation</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Standardise intake across your entire franchise network
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  Build one master template. Every franchisee follows it. Head office sees everything.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-bg-subtle)]">Try ClientEnforce free</Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20">View pricing</Link>
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
