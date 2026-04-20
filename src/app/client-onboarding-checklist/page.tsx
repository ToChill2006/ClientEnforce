import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Checklist 2026 — Free Template | ClientEnforce",
  description:
    "A complete client onboarding checklist covering every step from signed agreement to kickoff-ready. Free to use and adapt. Plus: how to enforce it automatically so nothing gets skipped.",
  path: "/client-onboarding-checklist",
  keywords: [
    "client onboarding checklist",
    "client onboarding checklist template",
    "new client onboarding checklist",
    "client onboarding steps",
    "client intake checklist",
    "onboarding checklist for agencies",
  ],
  type: "website",
});

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Client onboarding checklist — complete process",
  description: "A step-by-step client onboarding checklist covering pre-onboarding, intake, documents, and kickoff.",
  step: [
    { "@type": "HowToStep", name: "Send and collect signed agreement", text: "Issue the engagement letter, service agreement, or contract. Collect a signed copy before any work begins." },
    { "@type": "HowToStep", name: "Collect required documents", text: "Request all documents needed before kickoff: IDs, insurance certificates, brand assets, prior records, or compliance documents." },
    { "@type": "HowToStep", name: "Complete intake questionnaire", text: "Gather business information, project goals, preferences, and access requirements through a structured intake form." },
    { "@type": "HowToStep", name: "Collect access credentials", text: "Obtain logins, API keys, platform access, and any other credentials needed to begin work." },
    { "@type": "HowToStep", name: "Confirm payment method on file", text: "Verify billing details and confirm payment method before the engagement begins." },
    { "@type": "HowToStep", name: "Send portal access or kickoff instructions", text: "Give the client access to any ongoing collaboration tools and confirm the kickoff date and first deliverable." },
  ],
};

const faqItems = [
  {
    question: "What should a client onboarding checklist include?",
    answer: "A complete client onboarding checklist should cover: signed service agreement or engagement letter, required documents (IDs, certificates, prior records), intake questionnaire (business info, goals, preferences), access credentials, payment method confirmation, and kickoff instructions. The exact items vary by industry and service type.",
  },
  {
    question: "How do I stop clients from skipping steps on my onboarding checklist?",
    answer: "A static checklist cannot enforce itself — clients skip steps because there's no consequence for doing so. Client onboarding software like ClientEnforce enforces required steps at the platform level: clients cannot mark a step complete without actually completing it, and automated reminders fire until every item is done.",
  },
  {
    question: "What's the difference between a client onboarding checklist and client onboarding software?",
    answer: "A checklist tells you what should happen. Software enforces that it does happen — with required-step gates, automated reminders, structured document uploads, e-signatures, and a timestamped audit trail. Use a checklist to design your process; use software to run it reliably at scale.",
  },
  {
    question: "How long should client onboarding take?",
    answer: "For most service businesses, client onboarding should be completable in 2–5 business days from the client's side. If it's taking longer, the bottleneck is usually incomplete steps, slow follow-up, or missing enforcement. Required-step automation typically cuts intake time by 50–70%.",
  },
  {
    question: "Do I need a different checklist for different client types?",
    answer: "Yes. Retainer clients, project clients, and compliance-heavy clients all have different intake requirements. Build separate checklists (or templates in software) for each service line — then reuse each one consistently rather than rebuilding from scratch per client.",
  },
  {
    question: "Can I use this checklist as a template in ClientEnforce?",
    answer: "Yes. Every item on this checklist maps directly to a requirement type in ClientEnforce — signature steps, document uploads, text questions, checkboxes, and multiple-choice fields. Build your first template in under 20 minutes using this as your starting point.",
  },
];

const faqSchema = buildFaqPageSchema(faqItems.map((i) => ({ question: i.question, answer: i.answer })));

const checklistSections = [
  {
    phase: "Phase 1 — Pre-onboarding (before portal opens)",
    items: [
      "Agreement or proposal signed by both parties",
      "Project/engagement scope confirmed in writing",
      "Start date and key milestones agreed",
      "Onboarding portal link sent to client contact(s)",
      "Internal team notified of new client",
    ],
  },
  {
    phase: "Phase 2 — Signed documents",
    items: [
      "Service agreement / engagement letter signed",
      "NDA signed (if applicable)",
      "Scope of work document signed",
      "Data processing agreement signed (if applicable)",
      "Any sector-specific compliance forms signed",
    ],
  },
  {
    phase: "Phase 3 — Required documents",
    items: [
      "Proof of identity / company registration documents",
      "Insurance certificate(s) (if applicable)",
      "Prior records or handover documents from previous provider",
      "Brand asset pack (logos, fonts, colours)",
      "AML/KYC documentation (if applicable)",
      "Any other compliance or sector-specific documents",
    ],
  },
  {
    phase: "Phase 4 — Intake information",
    items: [
      "Business background and goals questionnaire completed",
      "Primary contact and decision-maker confirmed",
      "Communication preferences noted (email, Slack, calls)",
      "Reporting requirements confirmed",
      "Specific exclusions or constraints documented",
    ],
  },
  {
    phase: "Phase 5 — Access and credentials",
    items: [
      "Platform logins or admin access granted",
      "API keys or integration credentials provided",
      "Google Analytics / Search Console / ad account access",
      "CMS or hosting access (if applicable)",
      "Any third-party tool access required",
    ],
  },
  {
    phase: "Phase 6 — Payment and billing",
    items: [
      "Payment method on file and confirmed",
      "First invoice issued (if applicable)",
      "Billing contact confirmed",
      "Payment terms acknowledged",
    ],
  },
  {
    phase: "Phase 7 — Kickoff confirmation",
    items: [
      "All required steps complete — nothing outstanding",
      "Kickoff call scheduled and confirmed",
      "Internal handoff complete (account manager briefed)",
      "First deliverable date confirmed",
      "Client welcomed and next steps communicated",
    ],
  },
];

export default function ClientOnboardingChecklistPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client onboarding checklist — updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The complete client onboarding checklist (2026)
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                A checklist covering every step from signed agreement to kickoff-ready — for agencies, consultants, accountants, and service teams. Use it as a starting point, then adapt it to your service line.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Below the checklist: why static checklists fail at scale, and how to enforce every step automatically.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Build your checklist in ClientEnforce — free
                </Link>
                <Link href="/client-onboarding-software" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  See the full platform
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* The checklist */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    The client onboarding checklist
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Adapt to your service type. Mark items as required vs. optional for your client base.</p>
                  <div className="mt-6 space-y-6">
                    {checklistSections.map((section) => (
                      <div key={section.phase}>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{section.phase}</h3>
                        <ul className="mt-2 space-y-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                          {section.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[var(--color-text-secondary)]">
                              <span className="mt-2 h-3 w-3 shrink-0 rounded border border-[var(--color-border-strong)] bg-white" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Why checklists fail */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Why a checklist alone isn&apos;t enough
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    <p>
                      A checklist tells you what should happen. It cannot enforce that it does. When intake is managed over email — sharing the checklist in a PDF or pasting it into a message — clients skip items, respond partially, or ignore it entirely until you follow up manually.
                    </p>
                    <p>
                      The result: you&apos;re chasing the same items across every client, projects kick off with missing information, and there&apos;s no record of what was collected and when.
                    </p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      The fix isn&apos;t a better checklist. It&apos;s enforcing the checklist — with required steps clients cannot bypass, automated reminders that fire without your team lifting a finger, and a timestamped record of every submission.
                    </p>
                  </div>
                </section>
              </FadeUp>

              {/* How ClientEnforce enforces it */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How to enforce your onboarding checklist automatically
                  </h2>
                  <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                    {[
                      { step: "Step 1", title: "Build your checklist as a template", desc: "Map every item on this checklist to a requirement in ClientEnforce — signature steps, document uploads, text questions, checkboxes. Mark the non-negotiables as required. Takes under 20 minutes." },
                      { step: "Step 2", title: "Send one link per client", desc: "Each new client gets a secure portal link. Their checklist is pre-loaded. They complete it at their own pace — no login required, no email attachments, no ambiguity about what's needed." },
                      { step: "Step 3", title: "Automated reminders handle the chasing", desc: "When a step is overdue, ClientEnforce sends the reminder automatically. Required steps block intake from closing until they're done. Your team sees live status across all active onboardings." },
                    ].map((item) => (
                      <li key={item.step} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{item.step}</p>
                        <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeUp>

              {/* Industry variants */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Checklist variations by industry
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { title: "Agency onboarding checklist", desc: "Add brand assets, access credentials, signed brief, and NDA. Agencies typically run 5–15 concurrent onboardings — enforcement is essential at that volume.", href: "/client-onboarding-software-for-agencies" },
                      { title: "Accounting firm checklist", desc: "Add AML/KYC documents, prior-year records, signed engagement letter, and Companies House confirmation. Compliance audit trail required.", href: "/accountants" },
                      { title: "Law firm / solicitor checklist", desc: "Add conflict check confirmation, signed retainer, ID verification, and source-of-funds declaration. Every step needs a timestamped record.", href: "/law-firm" },
                      { title: "Consultant checklist", desc: "Add signed proposal, discovery questionnaire, access requirements, and NDA. Focus on getting everything before the first paid hour.", href: "/consultants" },
                      { title: "Financial adviser checklist", desc: "Add KYC/CIP documentation, Form ADV acknowledgement, suitability questionnaire, and signed disclosures before account opening.", href: "/financial-advisors" },
                      { title: "Fleet account checklist", desc: "Add vehicle register, driver authorisation forms, insurance certificate, signed account agreement, and payment method.", href: "/fleet-account-onboarding" },
                    ].map((item) => (
                      <Link key={item.title} href={item.href} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 transition hover:-translate-y-0.5 block">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">{item.desc}</p>
                        <span className="mt-2 inline-block text-xs font-semibold text-[var(--color-accent)]">View →</span>
                      </Link>
                    ))}
                  </div>
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
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "Enforce your checklist automatically — not just track it." },
                    { href: "/client-intake-software", label: "Client intake software", desc: "Structured intake that enforces completion before kickoff." },
                    { href: "/client-onboarding-automation", label: "Onboarding automation", desc: "Automated reminders and required-step enforcement." },
                    { href: "/dubsado-vs-honeybook", label: "Dubsado vs HoneyBook", desc: "Compare the leading onboarding tools side by side." },
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
          heading="Turn your checklist into an enforced workflow"
          subtext="Build your first template in under 20 minutes. Required steps enforced. Automated reminders included. Free to start."
          primaryLabel="Start free — no credit card needed"
          secondaryLabel="View pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
