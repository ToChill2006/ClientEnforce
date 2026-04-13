import type { Metadata } from "next";
import Link from "next/link";
import { CheckSquare, Zap, FileText } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Agency Client Onboarding Checklist (Free Download) | ClientEnforce",
  description: "The complete agency client onboarding checklist — 20+ items grouped by phase. Free download. Cover pre-kickoff setup, day-one tasks, week-one milestones, and ongoing standards.",
  path: "/resources/agency-onboarding-checklist",
  keywords: ["agency onboarding checklist", "client onboarding checklist for agencies", "agency client onboarding", "onboarding checklist template"],
  type: "website",
});

const checklistPhases = [
  {
    phase: "Phase 1 — Pre-kickoff (Internal Setup)",
    description: "Complete before the client receives any communication.",
    items: [
      "Assign a dedicated account manager and internal point of contact",
      "Create a client folder in your project management system",
      "Draft the onboarding timeline and set internal milestone dates",
      "Prepare the client's portal or shared workspace",
      "Generate contract, SOW, and NDA using approved templates",
      "Confirm billing setup — invoice schedule, payment method, late-payment terms",
    ],
  },
  {
    phase: "Phase 2 — Day 1–3 (Client-Facing Intake)",
    description: "What the client must complete before any delivery work begins.",
    items: [
      "Send welcome email with onboarding portal link and next steps",
      "Collect signed contract and statement of work",
      "Collect signed NDA if required",
      "Gather all required ID or business verification documents",
      "Collect brand assets: logo files, brand guidelines, color codes, fonts",
      "Collect access credentials: website, analytics, ad accounts, CMS logins",
      "Confirm billing contact name, email, and payment method on file",
      "Set client expectations: response time, revision policy, escalation path",
    ],
  },
  {
    phase: "Phase 3 — Week 1 (Discovery and Setup)",
    description: "Deepen understanding and configure your systems for delivery.",
    items: [
      "Conduct discovery call — record and save the transcript",
      "Document client goals, KPIs, and definition of success",
      "Audit any existing assets, campaigns, or prior work relevant to the engagement",
      "Create internal briefing document shared with the delivery team",
      "Set up client reporting template and confirm preferred cadence",
      "Confirm communication channel (Slack, email, project tool) and set expectations",
      "Invite client to relevant shared channels or collaboration tools",
    ],
  },
  {
    phase: "Phase 4 — Ongoing Standards",
    description: "Practices that should hold for the duration of the engagement.",
    items: [
      "Maintain an up-to-date audit trail of documents received and signed",
      "Log all client-facing communications with date and summary",
      "Check that required steps are complete before each phase of delivery begins",
      "Send automated or manual reminders for outstanding items — do not wait",
      "Review onboarding completion before the 30-day mark and flag any gaps",
    ],
  },
];

const faqItems = [
  {
    question: "What should an agency client onboarding checklist include?",
    answer: "A complete agency onboarding checklist covers four areas: internal setup (assigning account managers, building the workspace), client intake (contracts, credentials, brand assets), discovery (goals, KPIs, existing audits), and ongoing standards (audit trail, communication logs, reminder protocols). Missing any phase creates downstream delivery problems.",
  },
  {
    question: "How many steps should be in an agency onboarding checklist?",
    answer: "Most agencies find 20–30 items is the right range for a complete onboarding. Fewer than 15 typically means critical intake steps are being skipped; more than 35 usually means the checklist has merged onboarding with project delivery. The four-phase structure above covers the right scope.",
  },
  {
    question: "How do you enforce a client onboarding checklist across a team?",
    answer: "The most common failure is making the checklist optional or leaving it in a Google Doc. Enforcement means the checklist is baked into the workflow: account managers cannot mark an onboarding complete without every required step being checked, and clients receive automated reminders until they submit outstanding items. That is what ClientEnforce is built to do.",
  },
  {
    question: "What happens if a client doesn't complete onboarding before work starts?",
    answer: "Agencies that start delivery before onboarding is complete consistently report the same problems: rework because requirements were not captured, disputes because expectations were not documented, and billing friction because contract terms were not confirmed. Enforcing onboarding completion before kickoff is not bureaucracy — it is risk management.",
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

export default function AgencyOnboardingChecklistPage() {
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
              <span className="text-[var(--color-text-primary)]">Agency Onboarding Checklist</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Free download
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Agency Client Onboarding Checklist (Free Download)
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Without a standardized onboarding checklist, agencies repeat the same mistakes: delivery starts before requirements are captured, documents go missing, account managers chase clients manually, and onboarding looks different every time. This checklist fixes that.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto"
              >
                Download the checklist — free
              </Link>
              <Link
                href="#automate"
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto"
              >
                See how to automate it
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Checklist content */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                The complete agency onboarding checklist
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                24 items across four phases. Every agency should complete all four phases in sequence — a new client who begins work before phase two is finished is a client who will cause problems at billing.
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
                  Want this as a PDF checklist to share with your team?
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Sign up to ClientEnforce and get the formatted PDF version plus a pre-built onboarding template your team can use immediately.
                </p>
                <Link
                  href="/signup"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
                >
                  Download the checklist PDF
                </Link>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Automate section */}
        <section id="automate" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Automate this checklist with ClientEnforce
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                A PDF checklist solves the "what do we need" problem. It does not solve the enforcement problem. Clients still miss steps. Account managers still chase manually. Onboarding still looks inconsistent across team members.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce turns this static checklist into an enforced, automated workflow. Build it once as a template. Every new client gets their own portal link — no login required. Required steps must be completed before the onboarding is marked done. Automated reminders go out until every item is ticked.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <FileText className="h-5 w-5" />,
                  title: "One template, consistent every time",
                  body: "Build your agency onboarding checklist as a reusable template. Every new client triggers the same structured process — no steps skipped, no items forgotten.",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "Automated reminders until complete",
                  body: "Clients who have not submitted required documents receive automatic follow-up. Your team stops chasing and starts delivering.",
                },
                {
                  icon: <CheckSquare className="h-5 w-5" />,
                  title: "Full audit trail, always",
                  body: "Every document received, every step completed, every signature collected — timestamped and exportable. Compliance-ready by default.",
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
          heading="Stop managing onboarding in a spreadsheet"
          subtext="Your agency's onboarding checklist should enforce itself — not rely on someone remembering to chase the client. ClientEnforce does the chasing so your team can focus on delivery."
          primaryLabel="Start free — no credit card needed"
          secondaryLabel="See how it works →"
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
                { href: "/resources/consultant-intake-checklist", label: "Consultant intake checklist" },
                { href: "/agencies", label: "ClientEnforce for agencies" },
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
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
