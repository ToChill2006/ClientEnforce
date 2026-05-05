import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Commercial Client Intake Software — Structured Onboarding for Business Clients | ClientEnforce",
  description:
    "Commercial client intake software that enforces required documents, signed agreements, and compliance steps before work begins. Stop managing business client intake over email.",
  path: "/commercial-client-intake",
  keywords: [
    "commercial client intake software",
    "commercial client onboarding",
    "business client intake",
    "commercial onboarding software",
    "b2b client intake",
    "client intake software",
  ],
  type: "website",
});

const faqItems = [
  {
    question: "What is commercial client intake software?",
    answer: "Commercial client intake software structures the onboarding process for business clients — collecting company registration documents, signed service agreements, authorised signatory records, and compliance documentation before work begins. It enforces required completion so your team does not start work with an incomplete client file.",
  },
  {
    question: "What documents does commercial client intake typically require?",
    answer: "Commercial client intake typically requires: company registration certificate, signed master service agreement, authorised signatory form, proof of business address, insurance certificates, payment terms agreement, and any industry-specific compliance documents. ClientEnforce enforces collection of every required item before intake is marked complete.",
  },
  {
    question: "How does ClientEnforce differ from a CRM for commercial intake?",
    answer: "CRMs track contact records and deal stages. ClientEnforce enforces required completion — a commercial client cannot progress to the next stage until mandatory documents are submitted and agreements are signed. Required steps are gates, not suggestions.",
  },
  {
    question: "Can we handle multiple contacts at a business client during intake?",
    answer: "Yes. Commercial client intake often involves a procurement contact, a legal signatory, and an operational contact. ClientEnforce sends one portal link that multiple stakeholders can access, with each required task tracked until complete.",
  },
  {
    question: "Is there an audit trail for commercial client intake?",
    answer: "Yes. Every document submitted, every signature collected, and every step completed is timestamped and stored. Export a full PDF evidence pack at any point — for compliance, dispute resolution, or internal records.",
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

export default function CommercialClientIntakePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Commercial client intake software</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Commercial client intake software — enforce every required step before work begins
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Commercial client intake is more complex than consumer onboarding. Multiple contacts, layered documentation requirements, compliance obligations, and signed service agreements — all of which need to arrive before a single billable hour begins.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce structures commercial client intake so required documents are collected, agreements are signed, and compliance steps are completed before your team starts work — not chased afterwards.
              </p>
              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "Required documents and signed agreements enforced before work begins",
                  "Multi-contact support — procurement, legal, and operational contacts in one intake",
                  "Automated reminders chase business contacts without your team following up manually",
                  "Timestamped audit trail of every submission and signature",
                  "Export a full PDF evidence pack at any time for compliance or dispute records",
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
                  Why commercial client intake fails over email
                </h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <li>• The signed service agreement is somewhere in an email thread — not in a central, auditable record.</li>
                  <li>• Three different contacts at the client have been emailed different documents — no one knows who has sent what.</li>
                  <li>• Work starts before all required compliance documents arrive because the account manager decides it is close enough.</li>
                  <li>• When something goes wrong, reconstructing the intake record takes hours of inbox archaeology.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  How ClientEnforce handles commercial client intake
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Build a commercial intake template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Define all required steps: company documents, service agreement signature, authorised signatory form, compliance records, payment setup. Mark each as required.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Send one portal link to the client</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Business contacts complete intake through one secure portal — no account needed. Documents uploaded, agreements signed, compliance steps confirmed.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Start work when intake is complete</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">All required steps must be complete before onboarding closes. Your team is notified when a client is fully onboarded — with a timestamped record of everything collected.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  What teams collect through ClientEnforce commercial intake
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Service agreements and MSAs", "Capture signed master service agreements within the intake flow. No separate e-signature tool — the agreement is part of the onboarding record."],
                    ["Company and compliance documents", "Collect registration certificates, VAT numbers, insurance certificates, and any industry-specific compliance documents as required steps."],
                    ["Authorised signatory records", "Confirm who has authority to sign on behalf of the business — part of the structured intake record before work begins."],
                    ["Billing and payment setup", "Payment method, purchase order numbers, and invoicing contacts are collected as part of intake — not chased separately when the first invoice goes out."],
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
                  <Link href="/multi-location-client-onboarding" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">multi-location onboarding</Link>
                  <Link href="/franchise-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">franchise onboarding</Link>
                  <Link href="/client-intake-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client intake software</Link>
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">onboarding automation</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Stop starting work with an incomplete client file
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  Build your commercial intake template in under 20 minutes. Every required document, signed agreement, and compliance step enforced before your team starts work.
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
