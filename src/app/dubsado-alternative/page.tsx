import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubsado alternative | ClientEnforce",
  description:
    "A focused Dubsado alternative for agencies that want deeper onboarding workflows, enforced completion, and audit-ready tracking.",
  path: "/dubsado-alternative",
  keywords: [
    "Dubsado alternative",
    "best Dubsado alternatives",
    "client onboarding software",
    "onboarding software for agencies",
    "client onboarding automation",
  ],
  type: "website",
});

const tableRows = [
  ["Primary focus", "Full CRM plus business management", "Client onboarding execution"],
  ["Best for", "Solo freelancers and creatives", "Agencies and ops teams (5-50 people)"],
  ["Onboarding depth", "Module within broader CRM", "Purpose-built onboarding workflow"],
  ["Audit trail", "Basic activity log", "Full timestamped evidence trail"],
  ["Compliance-ready exports", "Not purpose-built", "PDF evidence pack per client"],
  ["Automated follow-up rules", "Available", "Built around completion enforcement"],
  ["Client portal", "Yes", "Yes - no client login required"],
  ["Learning curve", "High due to broad setup", "Low with template-first rollout"],
  ["Pricing model", "Flat monthly", "Based on onboarding volume"],
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ClientEnforce a good Dubsado alternative for agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, especially for agencies that want onboarding depth without a full CRM. ClientEnforce is focused on onboarding completion, reminders, audit trails, and kickoff readiness.",
      },
    },
    {
      "@type": "Question",
      name: "Who should stay with Dubsado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Teams that need one broad suite for CRM, invoicing, and business operations may still prefer Dubsado.",
      },
    },
    {
      "@type": "Question",
      name: "Why do agencies switch from Dubsado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Agencies often switch when they need deeper onboarding control, clearer completion enforcement, and less overhead from broad CRM configuration.",
      },
    },
    {
      "@type": "Question",
      name: "Can I migrate without importing Dubsado data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Most teams start by launching a clean onboarding template in ClientEnforce and using it for new clients first.",
      },
    },
    {
      "@type": "Question",
      name: "What should I compare besides feature lists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Compare completion rates, kickoff delays, and manual follow-up load. Those outcomes usually matter more than raw feature counts.",
      },
    },
  ],
};

export default function DubsadoAlternativePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Dubsado alternative</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                The best Dubsado alternative for agencies that want focused onboarding - not another CRM
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Dubsado is a solid option for freelancers and creatives who want an all-in-one CRM. But many agencies outgrow broad systems when they need deeper onboarding execution and cleaner handoffs.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700">
                If your team does not need a full CRM and instead needs onboarding completion enforced every time, ClientEnforce is the Dubsado alternative built for that exact job.
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">ClientEnforce vs Dubsado</h2>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[760px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Feature</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Dubsado</th>
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Why people switch from Dubsado</h2>
                <ul className="mt-4 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-800">
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />They need onboarding depth without broad CRM complexity.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />They want completion enforcement, not just task tracking.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />They need cleaner audit evidence for compliance-sensitive onboarding.</li>
                </ul>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Dubsado limitations for agencies</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Dubsado can do a lot, but agencies often end up configuring around broad CRM features they do not use during onboarding. That slows adoption and can make completion standards harder to enforce across multiple account managers.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Who should choose Dubsado</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Choose Dubsado if you need invoicing, contracts, and a broad all-in-one CRM for a solo or small creative business.
                </p>
                <h2 className="mt-7 text-2xl font-semibold tracking-tight text-zinc-900">When ClientEnforce is the better choice</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Choose ClientEnforce if your team onboards 3 or more clients per month and wants focused onboarding execution: structured workflows, automated reminders, completion enforcement, and audit-ready records.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding automation</Link>
                  <Link href="/features" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding platform features</Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Try ClientEnforce free - no Dubsado import needed</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Build your first onboarding template in 20 minutes and launch with a focused workflow your team can actually run.
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
