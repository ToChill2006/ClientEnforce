import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software | Stop Chasing Clients | ClientEnforce",
  description:
    "ClientEnforce is client onboarding software that enforces completion - not just tracks it. Built for agencies, consultants, and accountants. Start free.",
  path: "/",
  keywords: [
    "client onboarding software",
    "client onboarding automation",
    "client onboarding checklist",
    "best client onboarding tools",
    "onboarding software for agencies",
  ],
  type: "website",
});

const outcomeFeatures = [
  {
    title: "You stop chasing people over email",
    description:
      "Clients get nudged automatically when tasks are overdue, so your team is not the reminder system.",
  },
  {
    title: "Kickoff happens with complete intake",
    description:
      "Required forms, files, and approvals stay in one flow, so projects do not start with missing information.",
  },
  {
    title: "Every onboarding follows the same standard",
    description:
      "Use templates and progress rules to keep onboarding quality consistent across every account manager.",
  },
  {
    title: "Questions are easy to resolve later",
    description:
      "Every submission and approval is timestamped, giving you a clear audit trail when a client asks what happened.",
  },
  {
    title: "Clients get a cleaner experience",
    description:
      "One portal gives clients a clear path to completion instead of scattered links and fragmented requests.",
  },
  {
    title: "Ops can see risk before it turns into delay",
    description:
      "Track status across onboardings and spot blockers early instead of finding them right before kickoff.",
  },
] as const;

const painPoints = [
  "You've sent the same document request three times and still have not heard back.",
  "A new project is technically started, but half the intake information is still missing.",
  "Your team tracks onboarding status across email threads, a spreadsheet, and someone's memory.",
  "A client blamed your team for delays that started because they never completed onboarding.",
] as const;

const whoItsFor = [
  {
    title: "Agencies",
    pain: "You are onboarding multiple clients at once, and account managers keep rebuilding the same process.",
    solution:
      "ClientEnforce gives every service line a repeatable onboarding template with required steps and live status.",
  },
  {
    title: "Consultants",
    pain: "Discovery and intake details get buried in email, then delivery starts with avoidable gaps.",
    solution:
      "ClientEnforce keeps intake, documents, and approvals in one portal before kickoff can move forward.",
  },
  {
    title: "Accountants",
    pain: "Compliance and engagement docs must be complete and traceable, but inbox collection is unreliable.",
    solution:
      "ClientEnforce enforces required submissions and keeps an audit-ready timeline for every onboarding.",
  },
  {
    title: "Ops teams",
    pain: "You need consistent execution across people, not one-off heroics from your most organized teammate.",
    solution:
      "ClientEnforce standardizes onboarding workflows so quality stays high as volume increases.",
  },
] as const;

const homepageFaqItems = [
  {
    question: "What is client onboarding software?",
    answer:
      "Client onboarding software is a structured system that moves a new client from signed agreement to active delivery with trackable steps, document collection, e-signatures, and reminders.",
  },
  {
    question: "How is ClientEnforce different from a CRM like Dubsado or HoneyBook?",
    answer:
      "ClientEnforce focuses on onboarding execution. Instead of broad CRM management, it is built to enforce completion from contract to kickoff-ready.",
  },
  {
    question: "Who is ClientEnforce built for?",
    answer:
      "ClientEnforce is built for agencies, consultants, accountants, and operations-led service teams that onboard clients repeatedly.",
  },
  {
    question: "How long does it take to set up ClientEnforce?",
    answer:
      "Most teams can launch a first onboarding template in under 20 minutes, then refine it as they onboard real clients.",
  },
  {
    question: "Does ClientEnforce replace my project management tool?",
    answer:
      "No. ClientEnforce handles onboarding, while your project management tool handles delivery after kickoff.",
  },
] as const;

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Acme Agency onboarding</div>
            <div className="mt-1 text-xs text-zinc-600">Client portal and completion enforcement</div>
          </div>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
            4 tasks overdue
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
            <span>Onboarding completion</span>
            <span>76%</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
            <div className="h-2 w-[76%] rounded-full bg-zinc-900" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-medium text-zinc-900">Documents received</div>
            <div className="mt-1 text-sm text-zinc-700">7 of 8 required files uploaded.</div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-medium text-zinc-900">Signatures complete</div>
            <div className="mt-1 text-sm text-zinc-700">Engagement letter signed by all contacts.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">Automated reminder queue</div>
          <div className="mt-1 text-sm text-zinc-700">
            Three clients will receive overdue task nudges in the next 2 hours.
          </div>
        </div>
      </div>
    </div>
  );
}

const homepageSoftwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Client onboarding software that replaces email chaos with structured workflows, document collection, e-signatures, automated reminders, and audit-ready tracking.",
  url: "https://clientenforce.com",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "0",
    offerCount: "3",
  },
};

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is client onboarding software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Client onboarding software is a structured system that moves a new client from signed agreement to active delivery. It replaces ad hoc email threads and manual checklists with trackable steps, document collection, e-signatures, and automated reminders in one place.",
      },
    },
    {
      "@type": "Question",
      name: "How is ClientEnforce different from a CRM like Dubsado or HoneyBook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce is purpose-built for onboarding execution, not general CRM. Where Dubsado and HoneyBook are broad business management tools, ClientEnforce focuses entirely on getting clients from contract to kickoff-ready with enforced completion, audit trails, and structured workflows built specifically for that phase.",
      },
    },
    {
      "@type": "Question",
      name: "Who is ClientEnforce built for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce is built for agencies, consultants, accountants, and operations-led service teams who onboard clients repeatedly and need a reliable, repeatable system for intake, documents, signatures, and approvals.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to set up ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most teams build their first onboarding template in under 20 minutes. The setup is designed to be fast. Start with a standard intake template, customize the required steps, and send your first client portal link the same day.",
      },
    },
    {
      "@type": "Question",
      name: "Does ClientEnforce replace my project management tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ClientEnforce handles the onboarding phase from signed agreement to kickoff-ready. Your project management tool handles delivery. The two work together so your team has everything it needs before the project starts.",
      },
    },
  ],
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-zinc-100/70 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-zinc-100/70 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Client onboarding software for agencies, consultants, and accountants
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding software that enforces completion - not just tracks it
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg">
                Most teams lose hours every week chasing clients for documents, signatures, and approvals over email.
                ClientEnforce replaces that chaos with one structured workflow your clients actually complete.
              </p>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-700 sm:text-base">
                Built for agencies, consultants, and accountants who are done managing onboarding over email.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div>
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm font-medium text-zinc-700 sm:px-6 lg:px-8">
            Trusted by agencies, consultants, and accountants to run cleaner onboarding - without the inbox chaos.
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-600 sm:text-sm">
              {/* REPLACE WITH REAL CUSTOMER LOGOS AND QUOTES */}
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                ★★★★★ "Game changer for our agency intake" - placeholder
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">placeholder logo</span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">placeholder logo</span>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Sound familiar?</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {painPoints.map((pain) => (
                <article key={pain} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                  <p className="text-sm leading-6 text-zinc-800">{pain}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">How ClientEnforce works</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700 sm:text-base">
              Your team builds one onboarding template, sends one portal link, and tracks completion in one place. That is how client onboarding automation should work: clear steps, automatic reminders, and no guessing about what is still missing.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {outcomeFeatures.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-zinc-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Built for teams who onboard clients repeatedly
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {whoItsFor.map((segment) => (
                <article key={segment.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-zinc-900">{segment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{segment.pain}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-800">{segment.solution}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                client onboarding software
              </Link>
              <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                client onboarding automation
              </Link>
              <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                client onboarding checklist
              </Link>
              <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                view pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {homepageFaqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-zinc-900">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Your next client deserves a better start.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base">
                Set up your first onboarding template in under 20 minutes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial - no credit card needed
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                >
                  See how it works →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={homepageSoftwareSchema} />
      <JsonLd data={homepageFaqSchema} />
    </div>
  );
}
