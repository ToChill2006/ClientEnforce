import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Client Onboarding Tools 2026 | Compared | ClientEnforce",
  description:
    "Comparing the best client onboarding tools in 2026. Honest breakdown of ClientEnforce vs Dubsado vs HoneyBook vs manual process - with a clear recommendation for each use case.",
  path: "/client-onboarding-tools",
  keywords: [
    "best client onboarding tools",
    "client onboarding software comparison",
    "client onboarding automation tools",
    "onboarding software for agencies",
  ],
  type: "website",
});

const toolRows = [
  [
    "ClientEnforce",
    "Agencies, consultants, accountants who onboard at volume",
    "Purpose-built - entire product",
    "Full timestamped trail",
    "Paid plans from pricing",
  ],
  [
    "Dubsado",
    "Solo freelancers and creatives who want all-in-one CRM",
    "Module within CRM",
    "Basic activity log",
    "From $20/mo",
  ],
  [
    "HoneyBook",
    "Independent creative professionals managing full client lifecycle",
    "Part of clientflow platform",
    "Activity log",
    "From $19/mo",
  ],
  [
    "Content Snare",
    "Teams that primarily need document and information collection",
    "Document collection focused",
    "Basic",
    "From $12/mo",
  ],
  [
    "Manual (email + spreadsheet)",
    "Very early stage, very low volume",
    "None",
    "None",
    "Free",
  ],
] as const;

export default function ClientOnboardingToolsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Client onboarding tools</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Best client onboarding tools for agencies and service teams
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                The best tool depends on your team size, onboarding volume, and how much completion enforcement you need before kickoff.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">The best client onboarding tools compared (2026)</h2>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[940px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Tool</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Best for</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Onboarding depth</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Audit trail</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Price range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-zinc-100 px-4 py-3 font-medium text-zinc-900">{row[0]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[1]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[2]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[3]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-zinc-600">
                  This comparison was last updated March 2026. Pricing and features change - verify current details on each provider&apos;s website.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Which tool is right for your team?</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you are an agency or service team onboarding multiple clients per month and your main pain is the chase - chasing documents, chasing signatures, chasing approvals - ClientEnforce is built specifically for that problem.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you are a solo freelancer who needs invoicing, contracts, and CRM in one place, Dubsado or HoneyBook will serve you better.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If your only problem is collecting documents and nothing else, Content Snare is a simpler and cheaper option.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you are just getting started and your volume is low enough to manage manually, a Google Form and a spreadsheet is fine. You&apos;ll outgrow it - but there&apos;s no need to pay for software until the pain is real.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding software
                  </Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding automation
                  </Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding checklist
                  </Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    view pricing
                  </Link>
                  <Link href="/dubsado-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    Dubsado alternative
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
