import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Process: A Step-by-Step Guide (2026) | ClientEnforce",
  description: "A complete guide to the client onboarding process — 7 steps from signed agreement to kickoff-ready, why onboarding fails, and how to enforce completion at scale. Updated April 2026.",
  path: "/client-onboarding-process",
  keywords: [
    "client onboarding process",
    "client onboarding steps",
    "new client onboarding process",
    "client onboarding workflow",
    "client onboarding best practices",
    "client onboarding software",
  ],
  type: "website",
});

const processSteps = [
  {
    number: "01",
    title: "Welcome and contract signing",
    body: "Send a formal welcome communication and the engagement agreement simultaneously. The contract should be signed before any other onboarding step begins — it defines scope, terms, and the client's obligations. A signed agreement is the trigger that activates the onboarding sequence.",
    tip: "Enforce contract signing as a hard gate. No onboarding steps should be accessible until the agreement is executed.",
  },
  {
    number: "02",
    title: "Client intake form",
    body: "Collect the structured information your team needs to deliver the service: company details, key contacts, billing information, communication preferences, and any service-specific inputs. An intake form replaces the 'can you send me your details' email thread with a single, required step.",
    tip: "Keep the intake form to the questions you actually use. Every unnecessary field reduces completion rates.",
  },
  {
    number: "03",
    title: "Document collection",
    body: "Request every required document before work begins — not when you discover it is missing mid-project. For agencies: brand assets, logins, and briefs. For accountants: prior returns, bank statements, and identity documents. For consultants: existing reports and data. Define which documents are required before kickoff and enforce their collection.",
    tip: "Label each document requirement clearly and explain why you need it. Clients are more likely to complete steps when the purpose is obvious.",
  },
  {
    number: "04",
    title: "E-signatures on key documents",
    body: "For engagement letters, terms of service, data processing agreements, or compliance-sensitive documents, require a signature before the onboarding portal advances. E-signatures provide a timestamped record that protects both parties and is essential for regulated industries.",
    tip: "Do not ask for signatures at the end of onboarding. Get them early, before any work is started.",
  },
  {
    number: "05",
    title: "System and account setup",
    body: "Provision any access, accounts, or systems your team needs to deliver the service — CRM records, project management boards, shared drives, communication channels. This step is often internal, but it should be tracked as part of the onboarding sequence so nothing is missed before kickoff.",
    tip: "Include internal setup tasks in your onboarding template so your team's checklist is as enforced as the client's.",
  },
  {
    number: "06",
    title: "Kickoff call scheduling",
    body: "Once the intake is complete and all required documents are received, schedule the kickoff call with the client. Only complete onboarding should trigger kickoff scheduling — starting the relationship before intake is done sets a problematic precedent and leads to rework.",
    tip: "Gate kickoff scheduling on intake completion. The kickoff call agenda should be informed by what was submitted in steps 1–4.",
  },
  {
    number: "07",
    title: "Kickoff and handoff",
    body: "Run the kickoff call with a complete client file in hand. Confirm deliverables, timelines, and points of contact. After the call, send a kickoff summary that documents what was agreed. At this point, the onboarding is complete — hand the relationship to your delivery team with a full intake record.",
    tip: "A post-kickoff summary doubles as a written record of scope. Disagreements about what was agreed upon are significantly reduced when this step is standard.",
  },
];

const failureReasons = [
  {
    title: "No required-step enforcement",
    body: "If clients can skip intake steps without consequences, they will. Onboarding that relies on goodwill produces incomplete files, delayed kickoffs, and frustrated teams.",
  },
  {
    title: "Manual follow-up as the enforcement mechanism",
    body: "Asking your account manager to chase every client for every document is not a process — it is a recurring emergency. It does not scale, and quality depends on who is doing the chasing.",
  },
  {
    title: "No visibility across active onboardings",
    body: "Without a dashboard that shows which onboardings are complete and which are stalled, issues surface when they have already caused delays — not when they could still be fixed.",
  },
  {
    title: "Starting work before intake is finished",
    body: "Pressure to begin delivery before all onboarding steps are complete is one of the most common ways client relationships start badly. It signals that your process has no teeth.",
  },
  {
    title: "Inconsistency across team members",
    body: "If each account manager runs onboarding differently, client experience varies by person — and so does the quality of the intake file your delivery team receives.",
  },
];

const faqItems = [
  {
    question: "What is the client onboarding process?",
    answer: "The client onboarding process is the structured sequence of steps that takes a new client from signed agreement to kickoff-ready. A standard onboarding process includes contract signing, intake form completion, document collection, e-signatures, internal account setup, kickoff scheduling, and a formal kickoff call. The goal is to ensure your team has everything needed before delivery begins — and to give the client a clear, professional first experience with your business.",
  },
  {
    question: "How many steps should a client onboarding process have?",
    answer: "Most effective client onboarding processes have between 5 and 9 steps. Fewer than 5 steps often means required information is being collected reactively rather than upfront. More than 9 steps introduces drop-off risk — especially if steps are not clearly necessary. The right number is however many steps are genuinely required before your team can deliver quality work without any missing information.",
  },
  {
    question: "How long should client onboarding take?",
    answer: "The client onboarding process should take between 3 and 10 business days for most agencies, consultants, and accountants. The main variable is client responsiveness to completing required steps. With automated reminders and required-step enforcement, most onboardings complete in under one week. Without them, the average extends to 3–4 weeks in many service businesses.",
  },
  {
    question: "What is the most common mistake in the client onboarding process?",
    answer: "The most common mistake is starting work before onboarding is complete. This happens because there is no enforcement gate between intake and kickoff — teams feel pressure to begin delivery and assume they will collect missing information later. In practice, missing intake information causes rework, scope disputes, and a worse client experience than if delivery had waited for a complete file.",
  },
  {
    question: "How do you automate the client onboarding process?",
    answer: "To automate client onboarding, build a template that defines every required step from contract signing to kickoff-ready, configure automated reminders that trigger when steps are overdue, and send each new client a portal link that enforces the sequence. The key distinction between automation and just sending reminder emails is required-step enforcement — clients cannot advance past a step until it is completed, which replaces manual chasing with system-driven accountability.",
  },
  {
    question: "What software is best for managing the client onboarding process?",
    answer: "The best software for managing the client onboarding process enforces required-step completion rather than just tracking it. ClientEnforce is purpose-built for this: every required document, signature, and task is gated so clients cannot advance until it is done. Automated reminders handle follow-up, and a dashboard gives your team visibility across every active onboarding simultaneously. For agencies, consultants, and accountants running multiple concurrent onboardings, this produces dramatically faster completion times and a more consistent client experience.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Client onboarding process: step-by-step guide",
  description: "A 7-step process for onboarding new clients from signed agreement to kickoff-ready.",
  step: processSteps.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.body,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com",
  description: "Client onboarding software that enforces required-step completion, automates follow-ups, and maintains a full audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function ClientOnboardingProcessPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <Link href="/client-onboarding-checklist" className="transition hover:text-[var(--color-text-primary)]">Onboarding resources</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">Client onboarding process</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Updated April 2026
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              The client onboarding process: a 7-step guide for agencies, consultants, and accountants
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              A structured client onboarding process gets every new client from signed agreement to kickoff-ready — without missing documents, delayed starts, or manual chasing. Here is what it looks like, step by step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Build your onboarding template free
              </Link>
              <Link href="/client-onboarding-checklist" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                Get the free checklist
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* 7-step process */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>The 7 steps of an effective client onboarding process</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">These steps apply across service businesses — agencies, consultancies, accounting firms, and any team that onboards recurring clients. Adapt the document types and intake questions to your service, but keep the sequence.</p>
            </FadeUp>
            <div className="mt-10 space-y-5">
              {processSteps.map((step, i) => (
                <FadeUp key={step.number} delay={i * 60}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                    <div className="flex items-start gap-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent)]">
                        {step.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.body}</p>
                        <div className="mt-4 flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)] px-4 py-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                          <p className="text-xs leading-5 text-[var(--color-text-secondary)]"><span className="font-semibold text-[var(--color-accent)]">Best practice:</span> {step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Why it fails */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Why client onboarding processes fail</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">Most client onboarding problems are not caused by bad intentions — they are caused by processes that have no enforcement mechanism. Here are the five most common failure modes.</p>
            </FadeUp>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {failureReasons.map((reason, i) => (
                <FadeUp key={reason.title} delay={i * 70}>
                  <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{reason.body}</p>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* How enforcement works */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>How to enforce your client onboarding process</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">Enforcement is the difference between a process that exists and a process that runs. ClientEnforce builds the enforcement layer on top of your existing onboarding sequence.</p>
            </FadeUp>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {[
                { step: "01", title: "Build your process template once", body: "Map every required step from signed agreement to kickoff-ready. Define which documents are mandatory, which signatures are needed, and which tasks block advancement. Takes under 20 minutes." },
                { step: "02", title: "Send one portal link per client", body: "Each new client gets a secure portal link. They see every required step in order. They cannot skip a step or access later tasks until earlier ones are complete." },
                { step: "03", title: "Automation handles the follow-up", body: "When steps are overdue, clients receive automated reminders. Your team sees the completion dashboard — no chasing, no status emails, no missed gaps." },
              ].map((item, i) => (
                <FadeUp key={item.step} delay={i * 100}>
                  <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <span className="text-5xl font-bold text-[var(--color-bg-muted)]" style={{ fontFamily: "var(--font-display)" }}>{item.step}</span>
                    <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={200}>
              <div className="mt-6 flex items-center gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]">
                  Build your first onboarding template
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Industry variants */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Client onboarding process by industry</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">The 7-step structure applies across service businesses. The required documents and intake questions vary by industry.</p>
            </FadeUp>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Agencies", href: "/client-onboarding-software-for-agencies", description: "Brand assets, logins, brief, account access, signed scope. Block kickoff until the full brief is submitted." },
                { title: "Accounting firms", href: "/accountants", description: "Prior returns, bank statements, ID documents, engagement letter. Timestamped audit trail for every submission." },
                { title: "Consultants", href: "/client-onboarding-software", description: "Discovery questionnaire, NDA, engagement terms, data sharing consent. Gate the first call on intake completion." },
                { title: "Law firms", href: "/law-firm", description: "Retainer, ID verification, conflict check, engagement letter. Required steps enforce bar compliance from day one." },
                { title: "Financial advisors", href: "/financial-advisors", description: "CIP documents, suitability questionnaire, ADV acknowledgement. Full audit trail for regulator examinations." },
                { title: "Multi-location businesses", href: "/multi-location-client-onboarding", description: "One template, consistent intake across every site. Dashboard visibility across all active onboardings." },
              ].map((item) => (
                <FadeUp key={item.href}>
                  <Link href={item.href} className="card-lift block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 transition hover:border-[var(--color-accent)]">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-5 text-[var(--color-text-secondary)]">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold text-[var(--color-accent)]">See onboarding guide →</p>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Stop running onboarding from your inbox"
          subtext="Build your first onboarding process template in under 20 minutes — required steps enforced, reminders automated, audit trail included."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See how it works →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions about the client onboarding process</h2>
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

        {/* Related */}
        <section className="bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
                { href: "/client-onboarding-software", label: "Onboarding platform" },
                { href: "/best-client-onboarding-software", label: "Best onboarding software" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                  {link.label}
                </Link>
              ))}
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
