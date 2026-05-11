import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "The Complete Client Onboarding Guide | ClientEnforce",
  description:
    "Everything you need to build a client onboarding process that actually works — steps, checklist, automation, tools, and common mistakes. The definitive guide for US agencies, consultants, and accountants.",
  path: "/blog/client-onboarding-guide",
  keywords: [
    "client onboarding guide",
    "client onboarding process",
    "client onboarding checklist",
    "how to onboard clients",
    "client onboarding automation",
    "client onboarding steps",
  ],
  type: "article",
  ogImage: "https://clientenforce.com/images/og/clientenforce-homepage-og.png",
});

const toc = [
  { id: "what-is", label: "What is client onboarding?" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "steps", label: "The onboarding process: step by step" },
  { id: "checklist", label: "Client onboarding checklist" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "automation", label: "How to automate onboarding" },
  { id: "tools", label: "Tools that help" },
  { id: "enforcement", label: "Why enforcement beats tracking" },
];

const onboardingSteps = [
  {
    n: "01",
    title: "Contract signed — start the clock",
    body: "The moment a client signs, onboarding has started. Every hour between signature and kickoff is time your relationship can deteriorate. Send the portal link immediately.",
  },
  {
    n: "02",
    title: "Collect required intake information",
    body: "Gather everything your team needs to deliver: brand assets, access credentials, key contacts, signed agreements, and any documents specific to your service line. Do not start delivery without this.",
  },
  {
    n: "03",
    title: "Collect required documents and signatures",
    body: "Engagement letters, NDAs, scope agreements, proof of identity — whatever your service requires. These need to be collected in a structured, traceable way, not over email.",
  },
  {
    n: "04",
    title: "Verify completion before kickoff",
    body: "Your kickoff call or project start should be conditional on intake completion. If a client hasn't finished onboarding, the project clock shouldn't be running.",
  },
  {
    n: "05",
    title: "Hand off to delivery with a clean record",
    body: "The delivery team should receive a complete record of everything collected — not just a 'they're ready' message. Every document, every answer, timestamped.",
  },
  {
    n: "06",
    title: "Follow up automatically on anything outstanding",
    body: "Automated reminders handle overdue items without your account managers manually chasing. If a step is outstanding 48 hours later, the client gets nudged — not your team.",
  },
];

const checklistItems = [
  {
    phase: "Pre-kickoff",
    items: [
      "Contract or engagement letter signed",
      "Scope of work confirmed in writing",
      "Primary client contact identified",
      "Secondary / billing contact identified",
      "Invoice or payment method set up",
    ],
  },
  {
    phase: "Document collection",
    items: [
      "Required documents submitted (NDA, agreements, etc.)",
      "Brand assets received (if applicable)",
      "Access credentials shared securely",
      "ID or proof of identity collected (if required)",
      "Insurance or compliance documents received",
    ],
  },
  {
    phase: "Setup and configuration",
    items: [
      "Client added to project management system",
      "Shared workspace or portal created",
      "Team members assigned to the account",
      "Kickoff date confirmed with client",
      "Success metrics and KPIs agreed",
    ],
  },
  {
    phase: "Kickoff sign-off",
    items: [
      "All required intake steps confirmed complete",
      "Delivery team briefed on account",
      "Client expectations set in writing",
      "First milestone date communicated",
      "Onboarding record archived for compliance",
    ],
  },
];

const mistakes = [
  {
    title: "Starting delivery before intake is complete",
    body: "This is the most expensive mistake in client services. Projects start under-informed, scope creeps immediately, and the client thinks the delay is your problem — not theirs.",
  },
  {
    title: "Using email as your onboarding system",
    body: "Email is unstructured, unsearchable, and has no enforcement. Things get lost. Attachments go missing. There is no audit trail. It is not a system — it is a liability.",
  },
  {
    title: "Letting clients self-report completion",
    body: '"They said they\'d send it by Friday" is not a completion record. Required-step enforcement means the system verifies completion — not the client\'s promise.',
  },
  {
    title: "One person owns the process",
    body: "When the account manager who 'knows the process' leaves, onboarding quality collapses. Documented, templated processes survive staff turnover. Tribal knowledge does not.",
  },
  {
    title: "No audit trail",
    body: "Disputes happen. Clients claim they submitted something they didn't. Regulators ask for records you can't produce. A timestamped audit trail is not optional for professional service firms.",
  },
];

const faqItems = [
  {
    q: "How long should client onboarding take?",
    a: "For most service businesses, the intake phase — collecting documents, signatures, and information — should take 3–7 business days. Kickoff should not happen until this phase is complete. If it's taking longer, the process needs enforcement, not more patience.",
  },
  {
    q: "What's the difference between client onboarding and project management?",
    a: "Onboarding handles intake: getting a client from signed agreement to kickoff-ready. Project management handles delivery after that. The two phases need different tools. Conflating them is a common source of chaos for service teams.",
  },
  {
    q: "Should client onboarding be automated?",
    a: "Yes — the follow-up and reminder layer should be fully automated. Your team should spend time on high-value account management, not manually chasing clients for documents they should have submitted a week ago.",
  },
  {
    q: "What software do you need for client onboarding?",
    a: "You need a tool that handles structured intake, document collection, e-signatures, and automated reminders. ClientEnforce is built specifically for this phase. General CRMs and project management tools can be adapted, but they were not designed for onboarding enforcement.",
  },
  {
    q: "What is onboarding enforcement?",
    a: "Onboarding enforcement means required steps are gated — clients cannot move forward or mark a task complete without actually doing it. It's the difference between a checklist (informational) and an enforced workflow (mandatory). Enforcement eliminates the need for manual follow-up on required items.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Complete Client Onboarding Guide: Process, Checklist & Automation",
  description:
    "Everything you need to build a client onboarding process that works — steps, checklist, automation, tools, and common mistakes.",
  url: "https://clientenforce.com/blog/client-onboarding-guide",
  datePublished: "2026-04-13",
  dateModified: "2026-04-13",
  author: { "@type": "Organization", name: "ClientEnforce" },
  publisher: { "@type": "Organization", name: "ClientEnforce", url: "https://clientenforce.com" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ClientOnboardingGuidePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <Link href="/blog" className="transition hover:text-[var(--color-text-primary)]">Blog</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">Client Onboarding Guide</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              The definitive guide
            </div>
            <h1
              className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The complete client onboarding guide: process, checklist, and automation
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Everything you need to build a client onboarding process that actually gets completed — not just started. Built for US agencies, consultants, and accounting firms that onboard clients repeatedly.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span>By ClientEnforce</span>
              <span>·</span>
              <span>Updated April 2026</span>
              <span>·</span>
              <span>20 min read</span>
            </div>
          </PageContainer>
        </section>

        {/* Table of contents */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-8">
          <PageContainer>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">In this guide</p>
            <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </PageContainer>
        </section>

        {/* What is client onboarding */}
        <section id="what-is" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                What is client onboarding?
              </h2>
              {/* Featured snippet target */}
              <div className="mt-5 rounded-[var(--radius-lg)] border-l-4 border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-5 py-4">
                <p className="text-base font-medium leading-7 text-[var(--color-text-primary)]">
                  Client onboarding is the structured process of transitioning a new client from signed agreement to active project delivery. It includes intake forms, document collection, e-signatures, and completion of required steps — ensuring all information and approvals are gathered before any delivery work begins.
                </p>
              </div>
              <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>
                  A well-run client onboarding process protects both sides of the relationship. For your team: you start every project with complete information, signed agreements, and a clear mandate. For your client: they know exactly what&apos;s expected of them and when.
                </p>
                <p>
                  Most onboarding problems come from the same root cause: the process is informal. It lives in email, relies on a single account manager&apos;s judgment, and has no enforcement mechanism. When a step is skipped — and it will be — nobody finds out until it causes a problem downstream.
                </p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Why it matters */}
        <section id="why-it-matters" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why client onboarding matters more than most teams think
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    stat: "Week 1",
                    label: "When most project problems are planted",
                    body: "Delivery issues that surface in week 4 were usually created in week 1 — by missing information, unclear scope, or unverified assets that someone assumed were coming.",
                  },
                  {
                    stat: "67%",
                    label: "Of service firms cite delayed intake as a top cause of project delays",
                    body: "The intake phase is the most predictable bottleneck in client services. It is also the most preventable — with the right system.",
                  },
                  {
                    stat: "3×",
                    label: "More likely to churn clients who had a poor onboarding experience",
                    body: "The first 30 days set the tone for the entire relationship. A chaotic onboarding signals operational immaturity — before you&apos;ve delivered a single piece of work.",
                  },
                ].map((item) => (
                  <article key={item.stat} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <p className="text-4xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>{item.stat}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.body}</p>
                  </article>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Step by step */}
        <section id="steps" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                The client onboarding process: step by step
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                This is the sequence that works across agencies, consulting firms, and accounting practices. Adapt the specific steps for your service line — the structure should stay the same.
              </p>
            </FadeUp>
            <div className="mt-10 flex flex-col gap-4">
              {onboardingSteps.map((step, i) => (
                <FadeUp key={step.n} delay={i * 60}>
                  <div className="flex gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 shadow-[var(--shadow-sm)]">
                    <span className="text-4xl font-bold text-[var(--color-bg-muted)] shrink-0" style={{ fontFamily: "var(--font-display)" }}>{step.n}</span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Checklist */}
        <section id="checklist" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Client onboarding checklist
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Use this as a starting point. The exact items will vary by service type — but every item on this list matters.
              </p>
            </FadeUp>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {checklistItems.map((phase, i) => (
                <FadeUp key={phase.phase} delay={i * 60}>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">{phase.phase}</h3>
                    <ul className="mt-4 space-y-2">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--color-border-strong)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={200}>
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-accent)]">Want this checklist enforced automatically?</p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  ClientEnforce turns this static checklist into an enforced workflow — clients can&apos;t skip required steps, and your team gets automated follow-up when anything is overdue.{" "}
                  <Link href="/signup" className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
                    Start free →
                  </Link>
                </p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Common mistakes */}
        <section id="mistakes" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Common client onboarding mistakes (and how to fix them)
              </h2>
            </FadeUp>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mistakes.map((m, i) => (
                <FadeUp key={m.title} delay={i * 60}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 shadow-[var(--shadow-sm)]">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{m.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{m.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Automation */}
        <section id="automation" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                How to automate client onboarding
              </h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>
                  Automation in client onboarding has two components: <strong>workflow automation</strong> (structured steps clients move through) and <strong>reminder automation</strong> (follow-ups that fire when deadlines pass without manual intervention).
                </p>
                <p>Both are necessary. Workflow automation without reminders means clients stall and nothing happens. Reminders without structured workflow means you&apos;re automating chaos.</p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Build once, reuse always",
                    body: "Create one onboarding template per service line. Every new client in that category follows the same structured path — no rebuilding, no inconsistency.",
                  },
                  {
                    title: "Set reminder rules once",
                    body: "Define when follow-ups should fire — 48 hours after a missed deadline, weekly after that. The system handles it. Your team only gets involved for genuine escalations.",
                  },
                  {
                    title: "Gate kickoff on completion",
                    body: "Delivery cannot start until onboarding is provably complete. The automation creates the condition — your team just needs to enforce it.",
                  },
                ].map((item, i) => (
                  <FadeUp key={item.title} delay={i * 80}>
                    <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Tools */}
        <section id="tools" className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Client onboarding tools: what to look for
              </h2>
              <div className="mt-5 max-w-3xl space-y-3 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>Not every tool that touches onboarding is an onboarding tool. Here&apos;s what separates software built for this job from tools that can be adapted to it:</p>
              </div>
              <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Feature</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Why it matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {[
                      ["Required-step enforcement", "Clients cannot skip mandatory items. The only way to verify completion, not just record it."],
                      ["Automated reminders", "Follow-ups fire without manual intervention when steps are overdue."],
                      ["Document collection", "Structured file uploads tied to specific steps — not free-form email attachments."],
                      ["E-signatures", "Engagement letters and agreements signed in-portal without switching tools."],
                      ["Audit trail", "Timestamped record of every action — essential for compliance and dispute resolution."],
                      ["Multi-client dashboard", "See all active onboardings at once — not one client at a time."],
                      ["Client access without login", "Lower friction means higher completion rates. Clients click a link and start."],
                      ["Reusable templates", "Build once per service line. Not from scratch every time."],
                    ].map(([feature, reason], i) => (
                      <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className="px-5 py-3.5 font-semibold text-[var(--color-text-primary)]">{feature}</td>
                        <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Enforcement vs tracking */}
        <section id="enforcement" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why onboarding enforcement beats onboarding tracking
              </h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>
                  Most onboarding tools are tracking tools. They show you what&apos;s missing. They don&apos;t stop clients from moving forward without completing it.
                </p>
                <p>
                  Enforcement means required steps are gated. A client cannot mark a document upload complete without uploading the document. An e-signature step cannot be skipped. The intake form cannot be submitted half-finished.
                </p>
                <p>
                  That distinction — between a system that <em>records</em> what happened and a system that <em>prevents</em> the wrong thing from happening — is the difference between an onboarding tool and onboarding enforcement software.
                </p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  ClientEnforce is built around enforcement. The rest of the features support it.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto"
                >
                  Start free trial
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto"
                >
                  See how ClientEnforce works →
                </Link>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

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
                <FadeUp key={item.q}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{item.q}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{item.a}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Continue reading</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
                { href: "/blog/client-onboarding-checklist", label: "Checklist deep dive" },
                { href: "/agencies", label: "For agencies" },
                { href: "/accountants", label: "For accountants" },
                { href: "/blog/client-onboarding-mistakes", label: "Onboarding mistakes" },
                { href: "/blog/automate-client-onboarding", label: "How to automate onboarding" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Stop tracking onboarding. Start enforcing it."
          subtext="Build your first onboarding template in under 20 minutes. No credit card required. 30-day money-back guarantee."
          primaryLabel="Start free trial"
          secondaryLabel="See all features →"
          secondaryHref="/features"
        />

      </main>
      <PublicFooter />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
