import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare, Zap, ShieldCheck } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { LeadCaptureInline } from "@/components/marketing/lead-capture-inline";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Consultant Client Intake Checklist (Free Download) | ClientEnforce",
  description: "The complete consultant client intake checklist — 20+ items covering pre-call prep, contract signing, first week, and pre-kickoff sign-off. Free download for independent consultants and firms.",
  path: "/resources/consultant-intake-checklist",
  keywords: ["consultant client intake checklist", "consultant onboarding checklist", "client intake checklist for consultants", "consulting intake process"],
  type: "website",
});

const checklistPhases = [
  {
    phase: "Phase 1 — Before the First Call",
    description: "Internal preparation before you engage the prospect as a new client.",
    items: [
      "Research the prospect's business, industry, and publicly available context",
      "Define the scope of engagement you are prepared to offer",
      "Confirm internal capacity — do you have bandwidth to take on this client?",
      "Prepare a project brief template and tailor it to the engagement type",
      "Draft the initial proposal or letter of engagement",
      "Identify any conflicts of interest with existing clients",
    ],
  },
  {
    phase: "Phase 2 — At Contract Signing",
    description: "Items to collect and confirm at the point the engagement is confirmed.",
    items: [
      "Collect signed engagement letter or consulting agreement",
      "Collect signed NDA or confidentiality agreement if applicable",
      "Confirm scope, deliverables, and timeline in writing — no verbal agreements",
      "Collect billing contact details: name, email, invoicing address",
      "Confirm payment terms: rate, billing cycle, expense policy, late fees",
      "Collect payment method on file or bank details for invoicing",
      "Obtain signed data processing agreement if handling personal data",
      "Confirm which entities are party to the agreement (client company vs individual)",
    ],
  },
  {
    phase: "Phase 3 — First Week",
    description: "Information and access required to begin delivery work properly.",
    items: [
      "Conduct structured intake call — record with client's permission",
      "Document client goals, success criteria, and constraints",
      "Collect access to relevant systems: internal tools, data, dashboards",
      "Request prior reports, audits, or documentation relevant to the engagement",
      "Identify key stakeholders and decision-makers within the client organization",
      "Confirm preferred communication channel and response time expectations",
      "Set up a shared folder or collaboration workspace",
      "Create an internal engagement record with all collected information",
    ],
  },
  {
    phase: "Phase 4 — Pre-Kickoff Sign-off",
    description: "Final checks before delivery work formally begins.",
    items: [
      "Confirm all required documents have been received and are on file",
      "Confirm all access credentials are working and have been tested",
      "Send client a written kickoff confirmation summarizing scope and next steps",
      "Verify audit trail is complete — all signed documents timestamped and stored",
      "Set the first milestone date and confirm it with the client in writing",
    ],
  },
];

const faqItems = [
  {
    question: "What should a consultant's client intake checklist include?",
    answer: "A complete consultant intake checklist covers four stages: pre-call internal preparation, contract and document collection at signing, first-week information gathering, and pre-kickoff sign-off. The most commonly skipped items are written confirmation of scope and a data processing agreement — both of which become significant problems later in the engagement.",
  },
  {
    question: "How is a consultant intake checklist different from an agency onboarding checklist?",
    answer: "Consultant intake tends to be more document-heavy and legally precise — because consultants typically work under independent contract rather than a service agreement, the paperwork needs to be cleaner. It also places more emphasis on stakeholder mapping and understanding decision-making authority, which matters more in a consulting context than a typical agency engagement.",
  },
  {
    question: "How do I make sure my intake checklist is completed before work starts?",
    answer: "The answer is enforcement, not reminders. Telling clients you need documents is different from making it structurally impossible to proceed without them. The most effective approach is a client portal where required steps are gated — the client cannot mark items as done without actually submitting them, and automated follow-ups go out for anything outstanding. ClientEnforce is built for exactly this.",
  },
  {
    question: "Should I use the same intake checklist for every client engagement?",
    answer: "The core checklist should be standardized — the legal and administrative items are nearly identical for every engagement. But the discovery questions in weeks one and two should be customized to the engagement type. A good system gives you a reusable base template that you can extend per service line without rebuilding from scratch each time.",
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

export default function ConsultantIntakeChecklistPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-20">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <Link href="/resources" className="transition hover:text-[var(--color-text-primary)]">Resources</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">Consultant Intake Checklist</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Free download
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Consultant Client Intake Checklist (Free Download)
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Most consulting engagements fail in the intake phase — not the delivery phase. Ambiguous scope, missing documents, and unconfirmed payment terms create disputes that are almost impossible to resolve cleanly six months in. This checklist closes those gaps before work starts.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <LeadCaptureInline
                asset="consultant-intake-checklist"
                vertical="consultants"
                buttonLabel="Get the free checklist"
                placeholder="your@consultancy.com"
              />
              <Link
                href="#automate"
                className="inline-flex w-fit items-center text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
              >
                Turn it into an enforced portal →
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Checklist content */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                The complete consultant client intake checklist
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                27 items across four phases. Structured from internal preparation through to pre-kickoff sign-off — in the order they should happen.
              </p>
            </FadeUp>

            <div className="mt-10 space-y-8">
              {checklistPhases.map((phase, phaseIdx) => (
                <FadeUp key={phase.phase} delay={phaseIdx * 60}>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                      {phase.phase}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{phase.description}</p>
                    <ul className="mt-5 space-y-3">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={240}>
              <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                <p className="text-sm font-semibold text-[var(--color-accent)]">
                  Want the formatted PDF version and a ready-to-use template?
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Enter your email and we&apos;ll send you the link. View online or print as PDF.
                </p>
                <div className="mt-4">
                  <LeadCaptureInline
                    asset="consultant-intake-checklist"
                    vertical="consultants"
                    buttonLabel="Send me the PDF"
                  />
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Automate section */}
        <section id="automate" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Turn this checklist into an enforced portal with ClientEnforce
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                A checklist tells you what to collect. It does not make clients submit it. Consultants who rely on email follow-up to collect signed documents, access credentials, and intake information spend hours on admin that should be automatic.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce converts your intake checklist into a structured client portal. Clients access it via a single link — no login required. Required steps are enforced: the engagement cannot proceed until every item is completed. Automated reminders handle the chasing. The audit trail handles the compliance.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <CheckSquare className="h-5 w-5" />,
                  title: "Required steps, enforced",
                  body: "Clients cannot skip required intake items. Every document, signature, and form is tracked — the engagement does not move forward until intake is complete.",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "Automated follow-up",
                  body: "Outstanding items trigger automatic reminders. You stop chasing clients for signed NDAs and start spending that time on the work they are paying for.",
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  title: "Audit trail for every engagement",
                  body: "Every document received, every step completed, every e-signature collected — timestamped and stored. Exportable as a PDF evidence pack on demand.",
                },
              ].map((card, i) => (
                <FadeUp key={card.title} delay={i * 80}>
                  <article className="card-lift rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {card.icon}
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{card.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Client intake that runs itself"
          subtext="Your consulting practice needs intake that enforces completion — not a checklist that relies on you remembering to chase. Set it up once, use it for every client."
          primaryLabel="Start free — live in 20 minutes"
          secondaryLabel="See all features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {faqItems.map((item) => (
                <FadeUp key={item.question}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related links */}
        <section className="bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/resources/agency-onboarding-checklist", label: "Agency onboarding checklist" },
                { href: "/consultants", label: "ClientEnforce for consultants" },
                { href: "/client-intake-software", label: "Client intake software" },
                { href: "/blog/what-is-client-onboarding", label: "What is client onboarding?" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

      </main>
      <PublicFooter />
      <JsonLd data={faqSchema} />
    </div>
  );
}
