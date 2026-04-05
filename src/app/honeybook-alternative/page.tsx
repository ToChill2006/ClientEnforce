import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best HoneyBook Alternative for Agencies & Service Teams in 2026 | ClientEnforce",
  description: "Outgrown HoneyBook for client onboarding? ClientEnforce enforces completion at every step — document collection, audit trail, zero inbox chasing. Built for teams, not solo freelancers. Start free.",
  path: "/honeybook-alternative",
  keywords: ["HoneyBook alternative", "client onboarding software", "client onboarding automation", "onboarding software for accountants", "client onboarding checklist", "best HoneyBook alternative 2026"],
  type: "website",
});

const hbFaqItems = [
  {
    question: "What is the best HoneyBook alternative for agencies?",
    answer: "For agencies that run multiple client onboardings simultaneously, ClientEnforce is the most focused HoneyBook alternative. Where HoneyBook manages the full client lifecycle for solo professionals, ClientEnforce is built specifically for onboarding execution — required-step enforcement, document collection, automated reminders, and a compliance-grade audit trail.",
  },
  {
    question: "Does ClientEnforce replace HoneyBook completely?",
    answer: "No. ClientEnforce handles client onboarding from signed agreement to kickoff-ready. It does not include invoicing, proposal management, scheduling, or lead capture — features HoneyBook covers well for solo operators. Many teams run ClientEnforce alongside a separate billing or CRM tool.",
  },
  {
    question: "Why do agencies switch from HoneyBook to a dedicated onboarding tool?",
    answer: "HoneyBook was designed for independent creatives, not agency teams. When a team has more than one person involved in onboarding, HoneyBook's flexibility becomes a liability: it does not enforce required steps, does not give a cross-client dashboard, and its audit trail is not compliance-grade. Teams with three or more active onboardings at any time consistently outperform with a dedicated onboarding platform.",
  },
  {
    question: "Is ClientEnforce suitable for accountants switching from HoneyBook?",
    answer: "Yes. ClientEnforce is purpose-built for compliance-sensitive onboarding. The full timestamped audit trail — every document received, signature collected, and required step completed — is exportable as a PDF evidence pack. For accounting firms with AML and KYC obligations, this replaces the inadequate activity logs most general CRMs provide.",
  },
  {
    question: "How long does it take to switch from HoneyBook to ClientEnforce?",
    answer: "Most teams have a first onboarding template live within one working day. You do not migrate your HoneyBook data — you build a fresh onboarding workflow for each service line. The simplicity of setup is a deliberate design choice: ClientEnforce should take minutes to configure, not days.",
  },
];

const hbFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: hbFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const hbProductSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/honeybook-alternative",
  description: "Client onboarding software for agencies and service teams. Enforces required-step completion, collects documents and signatures, automates follow-ups, and maintains a full audit trail.",
};

const comparisonRows = [
  ["Primary focus", "Full clientflow — leads, proposals, contracts, payments, projects", "Client onboarding execution only"],
  ["Best for", "Solo creative professionals and independent business owners", "Agencies, consultants, accountants — teams of 5–50"],
  ["Onboarding depth", "Part of broader client management flow", "Entire product built around onboarding completion"],
  ["Required step enforcement", "Flexible — clients can progress without completing everything", "Enforced — required steps must be completed"],
  ["Automated reminders", "Available", "Core feature — automated until tasks are done"],
  ["Audit trail", "Activity log", "Full timestamped evidence trail per client"],
  ["Compliance-ready export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Multi-client dashboard", "Project view per client", "Cross-portfolio completion view"],
  ["Client portal", "Yes — branded", "Yes — no client login required"],
  ["Invoicing and payments", "Yes — built in", "No — not a CRM"],
  ["AI features", "HoneyBook AI for lead capture and follow-up", "Automated completion enforcement"],
  ["Setup time", "Medium — requires configuration", "Under 20 minutes — first template live same day"],
] as const;

export default function HoneyBookAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span><span>Alternatives</span><span>/</span>
              <span className="text-[var(--color-text-primary)]">HoneyBook Alternative</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Honest comparison
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              The HoneyBook alternative for teams that have outgrown freelancer tools
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              HoneyBook works beautifully for independent creatives. But if you run a team, onboard multiple clients a month, and need structured intake with an audit trail — you need something built for that job specifically.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Start free trial
              </Link>
              <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                See how it works
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Context */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>HoneyBook is excellent — for independent business owners</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>HoneyBook earned its loyal following by solving a real problem for solo creative professionals. Photographers, event planners, coaches, designers — people who need to manage enquiries, send proposals, collect contracts, take payments, and keep client comms organised, all without a dedicated ops person.</p>
                <p>The challenge comes when a team tries to use it as a structured onboarding system. HoneyBook was not designed for an operations manager tracking eight active onboardings simultaneously. It does not enforce required completion. And there is no compliance-grade audit trail of what was submitted, when, and by whom.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">For agencies, consultancies, accounting firms, and ops-led service teams, those gaps matter.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison table */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Clientflow tool vs dedicated onboarding software</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">A practical comparison of where each tool is designed to operate.</p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">HoneyBook</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">ClientEnforce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {comparisonRows.map((row, i) => (
                      <tr key={row[0]} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className={`sticky left-0 z-10 px-5 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}`}>{row[0]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[1]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-center text-xs text-[var(--color-text-muted)] sm:hidden">← Scroll to see all columns →</p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Choose X if */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Which tool is right for your situation?</h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 border-l-4 border-l-[var(--color-border-strong)] shadow-[var(--shadow-sm)]">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Choose HoneyBook if:</h3>
                  <ul className="mt-4 space-y-3">
                    {["You are an independent business owner or solo creative professional", "You need to manage leads, proposals, contracts, payments, and client comms in one place", "You are in photography, event planning, coaching, or a similar creative service", "Your client volume is low enough to manage individually", "You want AI-assisted lead capture and follow-up"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
              <FadeUp delay={80}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 border-l-4 border-l-[var(--color-accent)] shadow-[var(--shadow-sm)]">
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Choose ClientEnforce if:</h3>
                  <ul className="mt-4 space-y-3">
                    {["You run a team — agency, consultancy, accounting firm, or ops-led service business", "You onboard three or more clients per month and the process needs to be consistent every time", "Clients regularly start projects before intake is complete and it causes problems", "You need a real audit trail — not an activity log — for compliance or accountability", "Your account managers are still doing manual follow-up despite having software", "You want to separate your onboarding process from your CRM and manage it properly"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>What structured onboarding looks like in ClientEnforce</h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { step: "01", icon: <FileText className="h-5 w-5" />, title: "One template per service line", body: "Build a reusable onboarding template that defines exactly what every new client needs to complete. Build it once, use it every time." },
                  { step: "02", icon: <Mail className="h-5 w-5" />, title: "One portal link per client", body: "When a client signs, send them a single portal link. They see their onboarding steps clearly. No login required. No confusion." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Automated follow-up until it is done", body: "Clients receive automated reminders when tasks are overdue. Your dashboard shows completion status across every active onboarding at a glance." },
                ].map((step, i) => (
                  <FadeUp key={step.step} delay={i * 100}>
                    <article className="card-lift rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 shadow-[var(--shadow-sm)]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">{step.icon}</div>
                        <span className="text-5xl font-bold text-[var(--color-bg-muted)]" style={{ fontFamily: "var(--font-display)" }}>{step.step}</span>
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Compliance note */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>A note for accountants, legal firms, and compliance-sensitive businesses</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>If you work in a regulated environment — accountancy, legal, financial services, HR consultancy — client onboarding is not just an operational task. It is a compliance requirement.</p>
                <p>ClientEnforce maintains a full timestamped audit trail of every step in the onboarding process. Every document received, every signature collected, every required step completed — with a date, time, and clear record of who submitted what. That record is exportable as a PDF evidence pack at any point.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">This is not a feature HoneyBook was built to provide. For teams with compliance obligations, it is not optional.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="Built for the teams HoneyBook was not designed for"
          subtext="If you have outgrown freelancer tools and need client onboarding that enforces completion, scales across a team, and leaves a proper audit trail — try ClientEnforce."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See full features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions from teams evaluating ClientEnforce as a HoneyBook alternative.</p>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {hbFaqItems.map((item) => (
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
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
                { href: "/onboarding-for-accountants", label: "For accountants" },
                { href: "/dubsado-alternative", label: "Dubsado alternative" },
                { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
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
      <JsonLd data={hbFaqSchema} />
      <JsonLd data={hbProductSchema} />
    </div>
  );
}
