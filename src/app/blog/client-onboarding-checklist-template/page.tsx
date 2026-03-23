import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client onboarding checklist template | ClientEnforce",
  description:
    "Use this complete client onboarding checklist template to standardize intake, document collection, and kickoff readiness in 2026.",
  path: "/blog/client-onboarding-checklist-template",
  keywords: [
    "client onboarding checklist template",
    "client onboarding checklist",
    "onboarding new clients checklist",
    "how to automate client onboarding",
    "client onboarding software",
  ],
  type: "article",
});

const publishedTime = "2026-03-15T09:05:00.000Z";
const modifiedTime = "2026-03-15T09:05:00.000Z";

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Client onboarding checklist template setup",
  description:
    "A practical client onboarding checklist template with pre-onboarding, intake, document collection, and kickoff readiness steps.",
  step: [
    {
      "@type": "HowToStep",
      name: "Prepare pre-onboarding prerequisites",
      text: "Define scope, assign owner roles, and prepare template assets before sending your client portal.",
    },
    {
      "@type": "HowToStep",
      name: "Collect intake requirements",
      text: "Gather goals, contacts, access details, and required onboarding questionnaire responses.",
    },
    {
      "@type": "HowToStep",
      name: "Capture documents and signatures",
      text: "Request contracts, engagement documents, and required signatures in one structured step.",
    },
    {
      "@type": "HowToStep",
      name: "Run internal readiness checks",
      text: "Validate all required items are complete and approved before kickoff is scheduled.",
    },
    {
      "@type": "HowToStep",
      name: "Automate reminders and handoff",
      text: "Use onboarding automation to chase overdue tasks and trigger kickoff when completion criteria are met.",
    },
  ],
};

export default function ClientOnboardingChecklistTemplatePostPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <article className="py-12 sm:py-16">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Client onboarding checklist template</div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                The Complete Client Onboarding Checklist Template (2026)
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                A checklist only helps if it drives completion. Most teams already have a checklist somewhere, but it is either too vague, too long, or disconnected from the way clients actually submit information. That is why onboarding still feels chaotic even with "process docs" in place.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                This client onboarding checklist template is built for teams that onboard clients repeatedly and want a reliable path from signed agreement to kickoff-ready. Use it as-is, then adapt it to your service model and automate it in your onboarding workflow.
              </p>
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>TL;DR</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-primary)]">
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />Use one checklist across pre-onboarding, intake, document collection, and kickoff readiness.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />Assign owners to each step so accountability is explicit.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />Automate overdue reminders and readiness alerts to reduce manual follow-up.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />If you want this template enforced automatically, use <Link href="/client-onboarding-software" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">client onboarding software</Link>.</li>
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/downloads/client-onboarding-checklist" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Send me the checklist
                </Link>
                <Link href="/client-onboarding-software" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  See client onboarding software
                </Link>
              </div>
            </article>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <article className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>What makes a useful checklist versus a useless one</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  A useful onboarding checklist is specific, enforceable, and connected to action. A useless checklist is a vague wish list with no owners, no due dates, and no completion standard.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Useful checklist characteristics:
                </p>
                <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />Every step has one owner.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />Every required item has a clear completion definition.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />The sequence mirrors how clients actually complete onboarding.</li>
                  <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />The checklist is run in a system, not in static docs.</li>
                </ul>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Section 1: Pre-onboarding checklist (before portal send)</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Pre-onboarding is where most future delays are either created or prevented. If this stage is sloppy, everything after it slows down.
                </p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Confirm scope and service package in plain language.",
                    "Assign onboarding owner on your team.",
                    "Prepare onboarding template for this client type.",
                    "Define required documents and signatures.",
                    "Set expected completion timeline and due dates.",
                    "Prepare kickoff readiness criteria.",
                    "Confirm client primary contact and backup contact.",
                  ].map((item) => (
                    <li key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-primary)]">{item}</li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Section 2: Client intake requirements</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Intake quality determines delivery quality. Teams that rush this section usually pay with rework, delays, and avoidable scope confusion.
                </p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Business goals and success criteria for the engagement.",
                    "Primary stakeholder list and decision-maker contacts.",
                    "Current tools, platforms, and access dependencies.",
                    "Brand assets, guidelines, and source files.",
                    "Technical credentials and login requirements.",
                    "Approvals workflow and sign-off authority.",
                    "Communication preferences and reporting cadence.",
                    "Known risks, constraints, or launch deadlines.",
                  ].map((item) => (
                    <li key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-primary)]">{item}</li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Section 3: Document and signature collection</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  This is where many teams drop the ball because files arrive through mixed channels. Keep everything in one place and enforce required items.
                </p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Engagement letter sent and signed.",
                    "Required compliance documents uploaded.",
                    "Identity or authorization files collected.",
                    "Billing and legal contacts verified.",
                    "Contract attachments and annexes captured.",
                    "Final approval timestamp recorded.",
                  ].map((item) => (
                    <li key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-primary)]">{item}</li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Section 4: Internal kickoff readiness checks</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Kickoff should not happen because the date arrived. It should happen because onboarding is complete by definition.
                </p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "All required intake fields are complete and reviewed.",
                    "All required documents and signatures are present.",
                    "Access credentials tested by delivery owner.",
                    "Risks and constraints reviewed with project lead.",
                    "Kickoff agenda aligned to submitted onboarding context.",
                  ].map((item) => (
                    <li key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-primary)]">{item}</li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Section 5: How to turn this checklist into an automated workflow</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  A static checklist helps once. An automated checklist helps every onboarding. The goal is to enforce this process without increasing manual coordination.
                </p>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">1. Build one master template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Create a reusable sequence of required steps tied to owners and due dates.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">2. Add required fields and completion gates</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Prevent kickoff until mandatory items are complete and validated.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">3. Automate nudges and confirmations</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Trigger reminders for overdue tasks and confirmations when documents are received.</p>
                  </li>
                  <li className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">4. Monitor and improve monthly</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Review where clients stall and tighten unclear steps to improve completion rates.</p>
                  </li>
                </ol>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">how to automate client onboarding</Link>
                  <Link href="/downloads/client-onboarding-checklist" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">download checklist PDF</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view onboarding pricing</Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Want this checklist enforced automatically?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  That is exactly what ClientEnforce does. Build your onboarding workflow once, then run it consistently for every new client.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">Ready to fix your onboarding? Try ClientEnforce free.</Link>
                  <Link href="/downloads/client-onboarding-checklist" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20">Want this as a PDF? Download the client onboarding checklist.</Link>
                </div>
              </section>
            </article>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: "Client onboarding checklist template", path: "/blog/client-onboarding-checklist-template" },
        ])}
      />
      <JsonLd
        data={buildBlogPostingSchema({
          title: "The Complete Client Onboarding Checklist Template (2026)",
          description:
            "Use this complete client onboarding checklist template to standardize intake, document collection, and kickoff readiness in 2026.",
          path: "/blog/client-onboarding-checklist-template",
          publishedTime,
          modifiedTime,
          keywords: [
            "client onboarding checklist template",
            "onboarding new clients checklist",
            "client onboarding checklist",
            "how to automate client onboarding",
          ],
        })}
      />
      <JsonLd data={howToSchema} />
    </div>
  );
}
