import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Automation | Automate Follow-Ups and Intake | ClientEnforce",
  description:
    "Automate your client onboarding with structured workflows, automated reminders, and completion enforcement. Stop chasing clients manually - let the system do it.",
  path: "/client-onboarding-automation",
  keywords: [
    "client onboarding automation",
    "how to automate client onboarding",
    "automated client onboarding",
    "client onboarding workflow software",
    "client onboarding software",
  ],
  type: "website",
});

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to automate client onboarding",
  description:
    "A step-by-step guide to automating your client onboarding workflow to reduce manual follow-up and speed up time to kickoff.",
  step: [
    {
      "@type": "HowToStep",
      name: "Map your current onboarding sequence",
      text: "List every step from signed agreement to kickoff-ready. Identify where clients stall and where your team manually follows up.",
    },
    {
      "@type": "HowToStep",
      name: "Build a template with required steps",
      text: "Turn your onboarding sequence into a structured template with required documents, signatures, and tasks clearly defined.",
    },
    {
      "@type": "HowToStep",
      name: "Set automation rules for reminders",
      text: "Configure automated nudges so clients are prompted when tasks are overdue without your team manually following up.",
    },
    {
      "@type": "HowToStep",
      name: "Send the client portal link",
      text: "Send each new client a secure portal link so they can complete all required onboarding steps in one place.",
    },
    {
      "@type": "HowToStep",
      name: "Track completion and trigger kickoff",
      text: "Monitor completion status in real time. When all required steps are done, trigger the project kickoff with a full audit trail of what was submitted.",
    },
  ],
};

export default function ClientOnboardingAutomationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Client onboarding automation</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding automation for teams that are done being the reminder system
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Automating client onboarding means your team stops being the reminder system. Instead of manually following up every time a client stalls on a task, the system nudges them automatically - and you get a clear view of exactly where each client is in the process.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800">
                  Build your first onboarding template
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What to automate first in your onboarding process</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ["1. The portal send and welcome message", "When a new client signs, automatically send them a portal link with a personalised welcome message explaining exactly what they need to do. No manual email needed."],
                    ["2. Overdue task reminders", "When a client has not completed a required step by a set time, send them an automated nudge. Configure the timing - 24 hours overdue, 48 hours, 72 hours - without writing the email yourself each time."],
                    ["3. Document receipt confirmation", "When a required document is submitted, automatically confirm receipt to the client. Removes the back-and-forth of \"did you get it?\""],
                    ["4. Kickoff readiness notification", "When all required onboarding steps are complete, automatically notify your team that the client is kickoff-ready. No manual checking of completion status."],
                  ].map(([title, description]) => (
                    <article key={title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What not to automate</h2>
                <ul className="mt-4 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-800">
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />Expectation-setting conversations at the start of a new relationship</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />Bespoke scope questions that depend on the specific client&apos;s situation</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />Escalation conversations when something is significantly delayed</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />The kickoff call itself</li>
                </ul>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Automation handles the logistics. Humans handle the relationship.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How to automate client onboarding properly</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">1. Map your real workflow, not your ideal one</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Document what happens today, including where clients stall and where your team manually follows up.</p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">2. Enforce required steps in one system</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Move intake forms, files, and signatures into one client onboarding workflow software path.</p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">3. Trigger reminders and handoff alerts</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Set automation rules for overdue tasks and for kickoff readiness when all required items are complete.</p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">4. Review completion data monthly</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Track where onboarding slows down, then tighten unclear tasks and owner accountability.</p>
                  </li>
                </ol>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-tools" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding tools</Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding checklist</Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Ready to automate client onboarding?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Replace manual follow-up loops with enforced completion and real-time onboarding visibility.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                    Try ClientEnforce free
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">
                    See how it works
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={howToSchema} />
    </div>
  );
}
