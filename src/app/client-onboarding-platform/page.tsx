import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Platform for Agencies & Service Teams (2026) | ClientEnforce",
  description:
    "A dedicated client onboarding platform that enforces every required step — documents, e-signatures, intake forms, automated reminders, and a full audit trail. Built for teams who onboard clients repeatedly.",
  path: "/client-onboarding-platform",
  keywords: [
    "client onboarding platform",
    "client onboarding platform 2026",
    "onboarding platform for agencies",
    "client intake platform",
    "client onboarding software platform",
  ],
  type: "website",
});

const softwareSchema = buildSoftwareApplicationSchema({
  description: "A dedicated client onboarding platform that enforces required steps, collects documents and e-signatures, automates follow-up, and maintains a full audit trail.",
  path: "/client-onboarding-platform",
});

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce — Client Onboarding Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-onboarding-platform",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqItems = [
  {
    question: "What is a client onboarding platform?",
    answer: "A client onboarding platform is a dedicated system for managing the process of moving new clients from signed agreement to active delivery. It structures required steps, enforces completion, collects documents and signatures, sends automated reminders, and maintains an audit trail — replacing the email-based back-and-forth that most teams default to.",
  },
  {
    question: "What's the difference between a client onboarding platform and a CRM?",
    answer: "A CRM manages your client relationships across their lifetime. A client onboarding platform focuses specifically on the intake phase — getting a new client from signed to kickoff-ready. CRMs like Salesforce, HubSpot, or Dubsado include onboarding as a feature. ClientEnforce is built around it as the entire product.",
  },
  {
    question: "Do I need a client onboarding platform if I already have a CRM?",
    answer: "Most CRMs handle the relationship and pipeline well, but lack required-step enforcement, structured document collection, and compliance-grade audit trails for onboarding specifically. Teams that use both get the best of both: CRM for the relationship, ClientEnforce for the intake process.",
  },
  {
    question: "How quickly can a team get started on ClientEnforce?",
    answer: "Most teams have their first onboarding template live in under 20 minutes. No IT support or developer setup required. You build your template, send the portal link, and the platform handles follow-up automatically.",
  },
  {
    question: "Can I use different onboarding templates for different services?",
    answer: "Yes. Build a separate template for each service line — retainer clients, project engagements, compliance-heavy intakes, fleet accounts. Each runs independently with its own required steps and reminder schedule.",
  },
  {
    question: "Does ClientEnforce provide an audit trail?",
    answer: "Yes. Every document submitted, signature captured, and step completed is timestamped and logged per client. The full record is exportable as a PDF evidence pack — useful for compliance reviews, client disputes, or internal accountability.",
  },
];

const faqSchema = buildFaqPageSchema(faqItems.map((i) => ({ question: i.question, answer: i.answer })));

export default function ClientOnboardingPlatformPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client onboarding platform — updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A client onboarding platform that enforces completion — not just tracks it
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most platforms give you a place to track onboarding. ClientEnforce enforces it. Required steps cannot be bypassed. Automated reminders fire without your team doing anything. Every submission is timestamped.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                The result: clients complete onboarding before work begins — not weeks into a project, when the missing items are already causing delays.
              </p>
              <ul className="mt-5 max-w-3xl space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                {[
                  "Required steps enforced — clients cannot skip or bypass them",
                  "Automated reminders replace manual follow-up entirely",
                  "Structured document collection, e-signatures, and intake forms in one portal",
                  "Dashboard across all active onboardings — no status chasing",
                  "Full timestamped audit trail — exportable as PDF evidence pack",
                  "No client account creation required — single secure link per client",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />{item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">4.8</span>
                <span className="text-sm text-[var(--color-text-secondary)]">· 47 reviews</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Try ClientEnforce free
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  See all features
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* What makes a platform vs a tool */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What a dedicated onboarding platform does differently
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Enforces — not just tracks", desc: "A tracker shows you what's missing. A platform prevents work from starting until it's complete. Required steps are gated — clients cannot skip them, bypass them, or claim they didn't know they were needed." },
                      { title: "Automates follow-up end to end", desc: "Reminders run on the schedule you set, automatically, until every required step is done. Your team doesn't chase — they respond to exceptions flagged by the platform." },
                      { title: "Structures what gets collected", desc: "Document uploads land in the right field, not in an email attachment. Signatures are captured in-portal. Form responses are structured data, not PDFs to be manually filed." },
                      { title: "Gives visibility across all clients at once", desc: "One dashboard showing every active onboarding — which clients are on track, which are overdue, and which steps are blocked. Not per-client views you have to navigate one by one." },
                      { title: "Creates a compliance-grade record", desc: "Every action timestamped. Every document logged. Every signature recorded. Exportable as a PDF evidence pack at any point — for compliance, for disputes, for internal review." },
                      { title: "Scales without adding headcount", desc: "Whether you're onboarding three clients a month or thirty, the platform handles follow-up volume automatically. The workload on your team stays flat as client volume grows." },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* How it works */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How the platform works
                  </h2>
                  <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                    {[
                      { step: "1", title: "Build your onboarding template", desc: "Define every required step — documents, signatures, forms, questions. Mark non-negotiables as required. Set your reminder schedule. Build once, reuse for every client in that service line." },
                      { step: "2", title: "Send one portal link per client", desc: "Each new client gets a secure portal link. Everything they need to complete is in one place — no account required, no email threads, no confusion about where to send things." },
                      { step: "3", title: "Platform handles the rest", desc: "Automated reminders chase overdue tasks. Required steps block completion until done. Your dashboard shows live status. Your team gets alerted when intake is complete and work can begin." },
                    ].map((item) => (
                      <li key={item.step} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Step {item.step}</p>
                        <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeUp>

              {/* Pricing */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Pricing
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { plan: "Free", price: "£0", desc: "1 template. Up to 3 client intakes/month. Core platform features." },
                      { plan: "Pro", price: "£29/mo", desc: "Unlimited templates and active onboardings. Automated reminders. Audit trail." },
                      { plan: "Business", price: "£89/mo", desc: "Team roles. White-label client portal. Priority support." },
                      { plan: "Agency Pro", price: "£149/mo", desc: "Multi-organisation. Advanced analytics. Everything in Business." },
                    ].map((tier) => (
                      <div key={tier.plan} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{tier.plan}</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{tier.price}</p>
                        <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">{tier.desc}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/pricing" className="mt-5 inline-block text-sm font-semibold text-[var(--color-accent)] hover:underline">Full pricing details →</Link>
                </section>
              </FadeUp>

              {/* FAQ */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {faqItems.map((item) => (
                      <article key={item.question} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Related */}
              <section>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Related</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "Full overview of the ClientEnforce platform." },
                    { href: "/client-portal-software", label: "Client portal software", desc: "The portal clients use to complete onboarding." },
                    { href: "/client-intake-software", label: "Client intake software", desc: "Intake enforcement vs simple form collection." },
                    { href: "/client-onboarding-automation", label: "Onboarding automation", desc: "Automated reminders and completion enforcement." },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{link.label}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{link.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>

            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="A client onboarding platform that actually enforces completion"
          subtext="Build your first template in under 20 minutes. Required steps enforced. Automated reminders included. Free to start."
          primaryLabel="Try ClientEnforce free"
          secondaryLabel="View pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={softwareSchema} />
      <JsonLd data={ratingSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
