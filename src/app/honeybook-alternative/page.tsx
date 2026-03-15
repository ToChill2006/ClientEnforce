import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "HoneyBook alternative | ClientEnforce",
  description:
    "A practical HoneyBook alternative for agencies and consultants who want onboarding depth, completion enforcement, and audit-ready workflows.",
  path: "/honeybook-alternative",
  keywords: [
    "HoneyBook alternative",
    "honeybook competitors",
    "client onboarding software",
    "onboarding software for agencies",
    "client onboarding automation",
  ],
  type: "website",
});

const tableRows = [
  ["Primary focus", "All-in-one clientflow and business suite", "Client onboarding execution"],
  ["Best for", "Creative professionals", "Agencies, consultants, and compliance-sensitive teams"],
  ["Onboarding depth", "Part of broader workflow", "Purpose-built onboarding workflow"],
  ["Audit trail", "General activity history", "Timestamped onboarding evidence trail"],
  ["Compliance exports", "Not the core use case", "Built for audit-ready onboarding records"],
  ["Automation", "Workflow automation available", "Automation centered on completion enforcement"],
  ["Client portal", "Yes", "Yes - no client login required"],
  ["Learning curve", "Moderate with broad setup", "Fast template-first launch"],
  ["Pricing model", "Flat subscription", "Based on onboarding volume"],
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ClientEnforce a strong HoneyBook alternative for agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ClientEnforce is a strong HoneyBook alternative for teams that want focused onboarding execution rather than a broad clientflow business suite.",
      },
    },
    {
      "@type": "Question",
      name: "Who should stay with HoneyBook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Creative professionals who want one broad platform for proposals, invoicing, and overall client management may still prefer HoneyBook.",
      },
    },
    {
      "@type": "Question",
      name: "Why do consulting and agency teams switch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They switch when onboarding needs become more complex and they need stricter completion rules, better visibility, and stronger audit evidence.",
      },
    },
    {
      "@type": "Question",
      name: "Can ClientEnforce handle compliance-heavy onboarding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce supports structured document collection, signatures, timestamps, and evidence packs that help teams run auditable onboarding workflows.",
      },
    },
    {
      "@type": "Question",
      name: "What should we evaluate first before switching?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by mapping your onboarding bottlenecks, then compare completion enforcement, reminder automation, and visibility across active onboardings.",
      },
    },
  ],
};

export default function HoneyBookAlternativePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">HoneyBook alternative</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                The best HoneyBook alternative for teams that want deeper onboarding execution
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                HoneyBook is strong for creative professionals who want a broad clientflow platform. But teams with high onboarding volume often need a dedicated system that enforces completion and protects kickoff quality.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700">
                If you are looking for a HoneyBook alternative focused on onboarding depth, ClientEnforce is built for agencies, consultants, and operations-led service teams.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800">
                  Try ClientEnforce free
                </Link>
                <Link href="/client-onboarding-software" className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                  Explore client onboarding software
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">ClientEnforce vs HoneyBook</h2>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[760px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Feature</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">HoneyBook</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-zinc-100 px-4 py-3 font-medium text-zinc-900">{row[0]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[1]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Who should choose HoneyBook</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  HoneyBook is a good fit for creative professionals and smaller teams that want broad business management in one place, including client communication, proposals, and billing.
                </p>

                <h2 className="mt-7 text-2xl font-semibold tracking-tight text-zinc-900">Who should choose ClientEnforce</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Choose ClientEnforce if your team needs onboarding done right every time: required-step workflows, document collection, signatures, reminder automation, and evidence trails for audit confidence.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding automation</Link>
                  <Link href="/features" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding platform features</Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Try ClientEnforce free and launch in one afternoon</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Build your first onboarding template in 20 minutes and replace manual follow-up loops with enforced completion.
                </p>
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
      <JsonLd data={faqSchema} />
    </div>
  );
}
