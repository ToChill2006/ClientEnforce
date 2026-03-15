import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Accountants | Compliant & Auditable | ClientEnforce",
  description:
    "Client onboarding software for accountants and accounting firms. Collect documents, capture signatures, run AML checks, and maintain a full audit trail - all in one structured workflow.",
  path: "/onboarding-for-accountants",
  keywords: [
    "onboarding software for accountants",
    "client onboarding software",
    "client document collection software",
    "client onboarding checklist",
    "compliance onboarding workflow",
  ],
  type: "website",
});

const accountantFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do accountants need structured onboarding software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accountants need structured onboarding because AML, KYC, engagement letters, and supporting documents must be complete, traceable, and easy to review.",
      },
    },
    {
      "@type": "Question",
      name: "Can ClientEnforce capture engagement letter signatures?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ClientEnforce supports e-signature collection within the onboarding workflow so agreements are completed alongside intake steps.",
      },
    },
    {
      "@type": "Question",
      name: "Does ClientEnforce provide audit-ready evidence?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ClientEnforce keeps timestamped records of submissions and approvals and supports PDF evidence packs for file review.",
      },
    },
    {
      "@type": "Question",
      name: "Can we enforce required compliance steps before kickoff?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Required-step enforcement helps teams ensure no compliance-critical onboarding step is skipped.",
      },
    },
    {
      "@type": "Question",
      name: "Is this only for large firms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ClientEnforce works for accounting firms and advisory teams that want a cleaner, auditable onboarding process regardless of firm size.",
      },
    },
  ],
};

export default function OnboardingForAccountantsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Onboarding software for accountants</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding software for accountants — compliant, auditable, and structured
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Accounting onboarding is compliance-heavy. AML and KYC checks, identity documents, engagement letters, and approvals must be collected correctly and kept audit-ready. Email is not built for that level of control.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700">
                ClientEnforce gives accounting teams one structured onboarding workflow to collect documents, capture signatures, and keep evidence organized from first contact to kickoff.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800">Try ClientEnforce free</Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">See how it works</Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What accountants need from onboarding software</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ["Compliance-ready audit trail", "Every onboarding action should be timestamped and reviewable for internal controls."],
                    ["Document timestamping", "Identity and financial documents must be captured with clear submission history."],
                    ["E-signatures on engagement letters", "Client agreements should be signed inside the onboarding workflow, not scattered across email attachments."],
                    ["Evidence pack export", "Teams need a clean PDF record for file reviews and compliance checks."],
                    ["Required-step checklist enforcement", "Critical AML/KYC tasks cannot be optional or easy to miss."],
                  ].map(([title, text]) => (
                    <article key={title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How ClientEnforce covers compliance needs</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce is built to make onboarding execution visible and defensible. Required-step enforcement keeps critical tasks from being skipped. Timestamped records show who submitted what and when.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  When review time comes, teams can export evidence packs and confirm onboarding completeness without rebuilding records from inbox threads.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding checklist</Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding automation</Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    ["Can we use this for AML and KYC onboarding tasks?", "Yes. Teams use required-step checklists to enforce critical document and approval steps before work starts."],
                    ["Does it replace our accounting software?", "No. ClientEnforce handles onboarding execution. Your accounting platform handles delivery and ongoing service operations."],
                    ["Can we capture engagement letters in the same workflow?", "Yes. E-signature collection is included in the onboarding flow so agreements and intake stay together."],
                    ["How does this help during compliance reviews?", "Timestamped records and evidence exports make it easier to demonstrate what was collected and approved."],
                    ["Where should we start?", "Start with one onboarding template for your most common client type and refine it after the first few onboardings."],
                  ].map(([question, answer]) => (
                    <article key={question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{question}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{answer}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Run compliant onboarding without inbox chaos</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">Collect required documents, signatures, and approvals in one auditable workflow.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Try ClientEnforce free</Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">See how it works</Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={accountantFaqSchema} />
    </div>
  );
}
