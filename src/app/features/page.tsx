import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce Features | Client Onboarding Automation Tools",
  description:
    "Document collection, e-signatures, automated reminders, audit trail, and client portal - every feature ClientEnforce has is built for one job: getting clients through onboarding completely.",
  path: "/features",
  keywords: [
    "client onboarding software features",
    "client onboarding automation tools",
    "client onboarding workflow software",
  ],
  type: "website",
});

const features = [
  {
    name: "Client portal",
    description:
      "Clients see exactly what they need to do - in one link. No login required. No confusion about where to send things.",
  },
  {
    name: "Document collection",
    description:
      "Required files get submitted in the portal, not scattered across email threads. You see what&apos;s arrived and what&apos;s still missing.",
  },
  {
    name: "E-signatures",
    description:
      "Engagement letters and agreements get signed inside the onboarding flow - no separate DocuSign account needed.",
  },
  {
    name: "Automated reminders",
    description:
      "When a client&apos;s task is overdue, the system nudges them automatically. Your team stops being the reminder service.",
  },
  {
    name: "Audit trail",
    description:
      "Every document received, every step completed, every signature collected - timestamped and exportable. Full evidence trail per client.",
  },
  {
    name: "Progress tracking",
    description:
      "One dashboard. Every active onboarding. See instantly which clients are on track and which are stuck - without asking anyone.",
  },
  {
    name: "Template library",
    description:
      "Build one onboarding template per service line. Reuse it every time. Consistency without the manual setup.",
  },
  {
    name: "Completion enforcement",
    description:
      "Required steps are required - clients cannot skip them. Kickoff happens when intake is actually done, not assumed to be.",
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Features</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding features built for execution
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Every feature in ClientEnforce supports one goal: getting clients from signed agreement to kickoff-ready without inbox chaos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Feature highlights</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <article key={feature.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                      <h3 className="text-base font-semibold text-zinc-900">{feature.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{feature.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Built for onboarding - not bolted onto a CRM
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Most tools that handle client onboarding do it as one module inside a broader platform. Dubsado is a CRM. HoneyBook is a clientflow tool. ClickUp is project management.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce was built specifically for the onboarding phase and nothing else. That focus means every feature - the portal, the reminders, the audit trail, the completion enforcement - is designed around one outcome: getting clients through intake completely, every time.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/dubsado-alternative"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    See how we compare to Dubsado →
                  </Link>
                  <Link
                    href="/honeybook-alternative"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    See how we compare to HoneyBook →
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Ready to run onboarding properly?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Launch a repeatable onboarding workflow with one portal, automated follow-ups, and clear completion visibility.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Start free trial
                  </Link>
                  <Link
                    href="/client-onboarding-software"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    Explore client onboarding software
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
