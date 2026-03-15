import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Agencies | Built for Volume | ClientEnforce",
  description:
    "Client onboarding software built for digital agencies. Run consistent onboarding across every client, automate follow-ups, and start projects with complete intake - every time.",
  path: "/onboarding-for-agencies",
  keywords: [
    "onboarding software for agencies",
    "agency client onboarding software",
    "client onboarding workflow software",
    "client onboarding automation",
    "client onboarding software",
  ],
  type: "website",
});

const agencyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do agencies need dedicated onboarding software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Agencies often onboard multiple clients at once. Dedicated onboarding software keeps required steps, documents, and approvals in one enforceable workflow so kickoff quality stays consistent.",
      },
    },
    {
      "@type": "Question",
      name: "How many onboarding templates should an agency start with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most agencies start with one template per core service line. That keeps setup simple while still standardizing onboarding across account managers.",
      },
    },
    {
      "@type": "Question",
      name: "Can account managers see all active onboardings in one place?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ClientEnforce gives visibility across active onboardings so teams can spot blockers and overdue tasks quickly.",
      },
    },
    {
      "@type": "Question",
      name: "What if a client does not complete tasks on time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automated reminders and escalation rules handle overdue tasks so account managers do not have to manually chase every item.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can an agency launch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most teams can launch their first onboarding template in under 20 minutes and refine it during the first week of live usage.",
      },
    },
  ],
};

export default function OnboardingForAgenciesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Onboarding software for agencies</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding software for agencies — built for teams that onboard at volume
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Most agency onboarding problems are not people problems. They&apos;re process problems. When you&apos;re running 5, 10, or 20 client onboardings simultaneously, the manual approach collapses - and the client experience suffers before the work even begins.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700">
                ClientEnforce gives agency teams one repeatable onboarding workflow so every client gets the same standard, and every account manager can see exactly what is complete.
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What agencies need from onboarding software</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ["Consistent process across all clients", "Every client should complete the same required steps before kickoff, not a custom process each time."],
                    ["Visibility across multiple onboardings", "Leads and ops need one view of who is blocked, who is overdue, and what can start."],
                    ["Automated follow-up", "Account managers should not spend hours manually chasing missing forms and documents."],
                    ["Audit trail for disputes and reviews", "When questions come up, teams need a timestamped record of what was submitted and approved."],
                  ].map(([title, text]) => (
                    <article key={title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How ClientEnforce works for agencies</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">1. Build one template per service line</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Create onboarding templates for SEO, paid media, design, or retainer onboarding so each team follows a clear process.</p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">2. Send the portal link when a client signs</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Clients complete intake, upload files, and sign documents in one portal instead of scattered threads.</p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">3. Track completion and kick off on time</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Ops sees completion live and delivery starts only when required onboarding is complete.</p>
                  </li>
                </ol>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <blockquote className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
                  <p className="font-medium text-zinc-900">[ADD AGENCY CUSTOMER QUOTE HERE]</p>
                </blockquote>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    ["Is this onboarding software built for agency teams?", "Yes. ClientEnforce is designed for multi-client onboarding where consistency and visibility matter."],
                    ["Can we use different templates for different services?", "Yes. Most agencies run one template per service line for cleaner handoffs."],
                    ["How does automation help account managers?", "It handles overdue nudges and status visibility so managers spend less time chasing and more time advising clients."],
                    ["Can we compare this against CRM tools?", "Yes. Start with the Dubsado alternative page if you are comparing focused onboarding software to all-in-one tools."],
                    ["Where should we start?", "Start with one onboarding template, launch it on your next client, and refine based on completion data."],
                  ].map(([question, answer]) => (
                    <article key={question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{question}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{answer}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding automation</Link>
                  <Link href="/dubsado-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">Dubsado alternative</Link>
                  <Link href="/blog" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding blog</Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Ready to standardize agency onboarding?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">Launch a template your whole team can use and stop delaying kickoffs for missing intake.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">Try ClientEnforce free</Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">View pricing</Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={agencyFaqSchema} />
    </div>
  );
}
