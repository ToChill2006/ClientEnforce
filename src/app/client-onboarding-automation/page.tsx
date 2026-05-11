import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Automation Software | ClientEnforce",
  description: "Automate client onboarding — enforced required steps, automated reminders, document collection, e-signatures. Stop chasing clients manually. Free trial.",
  path: "/client-onboarding-automation",
  keywords: [
    "client onboarding automation",
    "how to automate client onboarding",
    "automated client onboarding",
    "automate client onboarding",
    "client onboarding workflow automation",
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

const faqItems = [
  {
    question: "What is client onboarding automation?",
    answer: "Client onboarding automation is the use of software to handle the repetitive, manual parts of the onboarding process — sending reminders when clients are overdue, confirming document receipt, tracking completion status, and triggering kickoff when all required steps are done. Instead of your team manually following up with every client, automation handles the logistics so you can focus on the relationship.",
  },
  {
    question: "How do you automate client onboarding?",
    answer: "To automate client onboarding, start by mapping every step your team currently handles manually — the portal link send, overdue reminders, document confirmations, and kickoff notifications. Then move those steps into a client onboarding platform that enforces required completion and triggers automated nudges based on task status. The goal is to replace manual follow-up with system-driven reminders, so no client falls through the cracks.",
  },
  {
    question: "What parts of client onboarding should be automated?",
    answer: "The best parts of client onboarding to automate are the logistical and repetitive ones: sending the portal link when a client signs, triggering reminders when steps are overdue, confirming document receipt automatically, and alerting your team when a client is kickoff-ready. Do not automate expectation-setting conversations, bespoke scope questions, or escalation calls — those require human judgment.",
  },
  {
    question: "What are the best client onboarding automation tools?",
    answer: "The best client onboarding automation tools enforce required-step completion rather than just sending generic emails. ClientEnforce is purpose-built for this: it sends automated reminders tied to specific overdue tasks, not time-based sequences. Other tools like Dubsado and HoneyBook include basic automation, but are designed as general client management systems rather than onboarding-specific enforcement platforms.",
  },
  {
    question: "How long does it take to set up automated client onboarding?",
    answer: "With ClientEnforce, most teams have a first automated onboarding template live within 20 minutes. Map your required steps, define which items are mandatory, set your reminder timing, and send the portal link when a new client signs. You do not need developer support or custom integrations — the automation runs at the platform level.",
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

const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-onboarding-automation",
  description: "Client onboarding automation software that enforces required-step completion, automates follow-up reminders, and maintains a full audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function ClientOnboardingAutomationPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Client onboarding automation</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to automate client onboarding — automated client onboarding for agencies and service teams
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Automated client onboarding means your team stops being the reminder system. Instead of manually following up every time a client stalls on a task, the system nudges them automatically — and you get a clear view of exactly where each client is in the process.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce handles the repetitive parts of onboarding — the follow-up emails, the deadline tracking, the &quot;did you get my last message?&quot; loops — so your team can focus on client relationships and delivery.
              </p>
              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "Automated reminders when steps are overdue",
                  "Required completion gates that prevent skipped steps",
                  "Document receipt confirmations sent without manual input",
                  "Kickoff-ready alerts when intake is fully complete",
                  "Progress tracking visible across all active onboardings",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Build your first onboarding template
                </Link>
                <Link href="/client-onboarding-software" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  Explore client onboarding software
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What to automate first in your onboarding process
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ["1. The portal send and welcome message", "When a new client signs, automatically send them a portal link with a personalised welcome message explaining exactly what they need to do. No manual email needed."],
                    ["2. Overdue task reminders", "When a client has not completed a required step by a set time, send them an automated nudge. Configure the timing - 24 hours overdue, 48 hours, 72 hours - without writing the email yourself each time."],
                    ["3. Document receipt confirmation", "When a required document is submitted, automatically confirm receipt to the client. Removes the back-and-forth of \"did you get it?\""],
                    ["4. Kickoff readiness notification", "When all required onboarding steps are complete, automatically notify your team that the client is kickoff-ready. No manual checking of completion status."],
                  ].map(([title, description]) => (
                    <article key={title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What not to automate
                </h2>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />Expectation-setting conversations at the start of a new relationship</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />Bespoke scope questions that depend on the specific client&apos;s situation</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />Escalation conversations when something is significantly delayed</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />The kickoff call itself</li>
                </ul>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Automation handles the logistics. Humans handle the relationship.
                </p>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  How to automate client onboarding properly
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Map your real workflow, not your ideal one</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Document what happens today, including where clients stall and where your team manually follows up.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Enforce required steps in one system</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Move intake forms, files, and signatures into one client onboarding workflow software path.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Trigger reminders and handoff alerts</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Set automation rules for overdue tasks and for kickoff readiness when all required items are complete.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">4. Review completion data monthly</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Track where onboarding slows down, then tighten unclear tasks and owner accountability.</p>
                  </li>
                </ol>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-platform" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding platform</Link>
                  <Link href="/client-onboarding-checklist" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding checklist</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Frequently asked questions about client onboarding automation
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {faqItems.map((item) => (
                    <article key={item.question} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ready to automate client onboarding?
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  Replace manual follow-up loops with enforced completion and real-time onboarding visibility.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-bg-subtle)]">
                    Try ClientEnforce free
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20">
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
      <JsonLd data={faqSchema} />
      <JsonLd data={aggregateRatingSchema} />
    </div>
  );
}
