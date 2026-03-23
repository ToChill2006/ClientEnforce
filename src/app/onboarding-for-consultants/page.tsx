import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Consultants | Structured Intake | ClientEnforce",
  description:
    "Client onboarding software built for consultants. Collect discovery documents, capture engagement agreements, and start every project with complete intake - without chasing clients over email.",
  path: "/onboarding-for-consultants",
  keywords: [
    "onboarding software for consultants",
    "consultant client onboarding",
    "client intake software for consultants",
    "client onboarding automation",
    "client onboarding software",
  ],
  type: "website",
});

const consultantFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do consultants need dedicated onboarding software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consultants rely on clean discovery and intake to deliver quality work. Dedicated onboarding software ensures required documents, signed agreements, and intake questionnaires arrive before the engagement starts.",
      },
    },
    {
      "@type": "Question",
      name: "What documents can consultants collect through ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consultants can collect any required files, signed engagement letters, completed intake questionnaires, and supporting documents through the client portal.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use different templates for different types of engagements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can create one onboarding template per engagement type — strategy, audit, implementation — so each client follows the right intake process.",
      },
    },
    {
      "@type": "Question",
      name: "What if a client does not complete intake tasks before kickoff?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automated reminders chase clients on overdue tasks so you do not have to. Required steps must be completed before the onboarding is marked complete.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can I get started?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most consultants set up their first onboarding template in under 20 minutes and send their first portal link the same day.",
      },
    },
  ],
};

export default function OnboardingForConsultantsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Onboarding software for consultants</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client onboarding software for consultants — complete intake before the engagement begins
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Every delayed kickoff starts the same way: a client who did not finish intake. Discovery questionnaires sit unanswered, signed agreements arrive late, and required documents never make it to your inbox.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce gives consultants a structured onboarding workflow so every engagement starts with complete information — without email chains and manual follow-ups.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">Try ClientEnforce free</Link>
                <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">See all features</Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Sound familiar?</h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <li>• You sent the discovery questionnaire two weeks ago and still have not received it back.</li>
                  <li>• The signed engagement letter is somewhere in an email thread, but you cannot find the final version.</li>
                  <li>• The kickoff call is tomorrow and you are still missing three documents the client was supposed to provide.</li>
                  <li>• Each new engagement uses a slightly different intake process because it lives in your head, not a system.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>How ClientEnforce works for consultants</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Build a template per engagement type</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Create intake templates for strategy engagements, audits, retainers, or any engagement type so every client follows a clear process.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Send one portal link when the contract is signed</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Clients complete questionnaires, upload files, and sign agreements in one portal — no email attachment chains.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Start the engagement with everything you need</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Required steps must be complete before kickoff moves forward. Automated reminders chase stragglers so you do not have to.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>What consultants use ClientEnforce for</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Discovery questionnaires", "Send structured intake forms that clients complete before the first session — no more half-prepared kickoff calls."],
                    ["Engagement letter signatures", "Capture signed agreements inside the onboarding flow without a separate e-signature tool."],
                    ["Document collection", "Collect financial records, existing reports, access credentials, or any required files in one trackable place."],
                    ["Audit trail", "Every step completed, every document received, every signature captured — timestamped and exportable if there is ever a question."],
                  ].map(([title, body]) => (
                    <article key={title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    ["Is this built for solo consultants or consulting firms?", "Both. Solo consultants use it to standardize their own intake process. Firms use it to make onboarding consistent across multiple consultants."],
                    ["Can I customise the intake questions per engagement?", "Yes. Each template has its own set of required steps, questions, and file requests — fully customisable per engagement type."],
                    ["How does the client portal work?", "Clients get a secure link — no account required. They complete tasks, upload files, and sign documents directly in the portal."],
                    ["Does ClientEnforce replace my contract tool?", "No. It complements it. Clients can sign the engagement letter inside the onboarding flow after your contract tool generates it."],
                    ["Where should I start?", "Start with one template for your most common engagement type, launch it on your next client, and refine from there."],
                  ].map(([question, answer]) => (
                    <article key={question} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{question}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{answer}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding automation</Link>
                  <Link href="/dubsado-alternative" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">Dubsado alternative</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Ready to start every engagement with complete intake?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">Build your first onboarding template in under 20 minutes and stop chasing clients for missing information.</p>
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
      <JsonLd data={consultantFaqSchema} />
    </div>
  );
}
