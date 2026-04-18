import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Multi-Location Client Onboarding Software — Consistent Intake Across Sites | ClientEnforce",
  description:
    "Multi-location client onboarding software that enforces the same intake process across every site, branch, or location. One template, consistent execution, full visibility.",
  path: "/multi-location-client-onboarding",
  keywords: [
    "multi-location client onboarding",
    "multi location onboarding software",
    "multi-site client intake",
    "client onboarding for multi-location businesses",
    "franchise client onboarding",
    "client onboarding software",
  ],
  type: "website",
});

const faqItems = [
  {
    question: "What is multi-location client onboarding software?",
    answer: "Multi-location client onboarding software lets you run the same structured intake process across every site, branch, or location without rebuilding templates for each one. One master template drives consistent intake across your whole operation — every required document, every signature, every step enforced the same way regardless of which location is onboarding the client.",
  },
  {
    question: "How does ClientEnforce handle onboarding across multiple locations?",
    answer: "Build one onboarding template and deploy it across all your locations. Each location sends its own client portal links, but every client follows the same required intake steps. Your dashboard shows completion status across all active onboardings regardless of location.",
  },
  {
    question: "Can different locations customise their intake steps?",
    answer: "Yes. You can build a shared base template with required steps that apply to all locations, then create location-specific variants that add local requirements on top. Each location sends its own portal links from its own account.",
  },
  {
    question: "Is there a dashboard that shows onboarding status across all locations?",
    answer: "Yes. The ClientEnforce dashboard shows all active onboardings across your account in one view — with completion status, outstanding steps, and overdue items visible without switching between accounts.",
  },
  {
    question: "How does this differ from managing onboarding in a CRM?",
    answer: "CRMs track contacts and deals. ClientEnforce enforces required completion — clients cannot reach the next stage until mandatory steps are done. Required documents, signatures, and intake tasks are gated, not just tracked.",
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

export default function MultiLocationClientOnboardingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Multi-location client onboarding</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Multi-location client onboarding software — the same intake process across every site, every time
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                When your business operates across multiple locations, client onboarding should be consistent — but in practice, every location does it differently. One site collects documents over email. Another uses a Google Form. A third relies on whoever is available to follow up.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce gives multi-location businesses one structured onboarding template that every site deploys — so intake is consistent, required steps are enforced, and your head office has visibility across all active onboardings.
              </p>
              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "One template deployed consistently across all locations",
                  "Required steps enforced — no location can skip intake documents",
                  "Dashboard visibility across all active onboardings",
                  "Automated reminders chase clients without location staff following up manually",
                  "Exportable audit trail per client for compliance or dispute resolution",
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
                  Why multi-location onboarding breaks down
                </h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <li>• Location A uses email. Location B uses a PDF form. Location C relies on whoever answered the phone.</li>
                  <li>• Head office cannot see which clients are mid-intake across any location without asking each site individually.</li>
                  <li>• Required documents are collected inconsistently — some clients start work before intake is complete.</li>
                  <li>• When a client dispute arises, there is no central record of what was signed or submitted.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  How ClientEnforce works for multi-location businesses
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Build a master onboarding template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Define the required intake steps that every location must follow — documents, agreements, signatures, intake questions. One source of truth for your entire business.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Each location sends portal links</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">When a client is signed, the location sends a single portal link. Clients complete their intake without creating an account — all steps tracked automatically.</p>
                  </li>
                  <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Head office sees everything</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">One dashboard shows completion status across all active onboardings. Required steps cannot be bypassed. Every submission is timestamped and exportable.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Who uses ClientEnforce for multi-location onboarding
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Franchise networks", "Ensure every franchisee onboards new clients using the same required steps — signed agreements, setup documents, and compliance records collected consistently."],
                    ["Multi-branch service businesses", "Auto service groups, dental practices, and financial advisory firms with multiple locations run consistent intake across every site."],
                    ["Regional agencies", "Marketing and consulting agencies with multiple regional teams use one template to standardise client intake across all offices."],
                    ["Operations and compliance teams", "Head office teams who need visibility into intake completion across locations — without chasing each site for status updates."],
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
                  <Link href="/franchise-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">franchise onboarding</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">onboarding automation</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Consistent client onboarding across every location
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  One template. Every location. Full visibility. Build your first multi-location onboarding workflow in under 20 minutes.
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
