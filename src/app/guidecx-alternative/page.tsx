import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "GUIDEcx Alternative for Small & Mid-Size Teams | ClientEnforce",
  description: "Looking for a GUIDEcx alternative at SMB price? ClientEnforce enforces required-step onboarding, automates follow-ups, and delivers an audit trail — without enterprise-grade complexity or cost.",
  path: "/guidecx-alternative",
  keywords: ["GUIDEcx alternative", "client onboarding software", "onboarding software for small business", "client intake software"],
  type: "website",
});

const faqItems = [
  {
    question: "What is the best GUIDEcx alternative for small and mid-size businesses?",
    answer: "For small and mid-size agencies, consultancies, and accounting firms, ClientEnforce is the most purpose-focused GUIDEcx alternative. GUIDEcx is built for enterprise onboarding at scale — large customer success teams managing hundreds of concurrent implementations. ClientEnforce delivers the core of what most SMB teams actually need: required-step enforcement, document and e-signature collection, automated reminders, and a full timestamped audit trail — without the enterprise complexity or price.",
  },
  {
    question: "How does ClientEnforce compare to GUIDEcx on pricing and setup?",
    answer: "GUIDEcx is priced for enterprise organizations and typically involves a sales-led process, custom contracts, and an onboarding period before you are live. ClientEnforce is designed for teams that need to move fast — SMB-friendly pricing, a free trial with no credit card required, and a first onboarding template live in under 20 minutes. For most small to mid-size teams, the difference in time-to-value alone justifies the switch.",
  },
  {
    question: "Does ClientEnforce have the same onboarding enforcement features as GUIDEcx?",
    answer: "ClientEnforce enforces onboarding completion at the platform level — required steps cannot be skipped, clients cannot access later steps until earlier ones are done, and automated reminders run until every task is complete. The key difference is that ClientEnforce focuses exclusively on the client intake and onboarding phase, while GUIDEcx extends into full customer success and post-onboarding relationship management. For teams that need the intake phase handled properly without a broader enterprise platform, ClientEnforce covers that ground completely.",
  },
  {
    question: "Is ClientEnforce suitable for accountants and compliance-sensitive firms looking at GUIDEcx?",
    answer: "Yes. The compliance audit trail is a first-class feature in ClientEnforce, not an afterthought. Every document received, every e-signature collected, and every required step completed is recorded with a timestamp and exportable as a PDF evidence pack. For accounting firms with AML, KYC, or other regulatory onboarding requirements, this is exactly the kind of record you need — and it is available out of the box without enterprise configuration.",
  },
  {
    question: "Can ClientEnforce handle multiple active onboardings the way GUIDEcx does?",
    answer: "Yes. The multi-client dashboard shows completion status across every active onboarding simultaneously — which clients are on track, which are overdue, and which steps are blocked. For teams running ten, twenty, or more concurrent onboardings, the cross-portfolio view is the single pane of glass that replaces manual status chasing. Automated reminders handle the follow-up so your team does not have to.",
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

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/guidecx-alternative",
  description: "Affordable client onboarding software for small teams GUIDEcx doesn't price for — enforced steps, document collection, and audit trail at SMB pricing.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const comparisonRows = [
  ["Primary focus", "Enterprise customer onboarding at scale — large CS teams", "Client onboarding execution only — intake to kickoff-ready"],
  ["Best for", "Enterprise SaaS and services companies with large customer success teams", "Agencies, consultants, accountants — teams of 5–50"],
  ["Complexity / setup time", "High — enterprise configuration, sales-led onboarding", "Low — first template live in under 20 minutes"],
  ["Required step enforcement", "Yes — task-based onboarding plans with dependencies", "Yes — required steps enforced at the platform level"],
  ["Automated reminders", "Yes — within customer success workflows", "Core feature — automated until every task is done"],
  ["Audit trail", "Activity tracking within customer success platform", "Full timestamped evidence trail per client — exportable as PDF"],
  ["Client portal", "Yes — collaborative onboarding hub", "Yes — no client login required, single link per client"],
  ["Multi-client dashboard", "Portfolio view across accounts", "Cross-portfolio completion view — see every onboarding at a glance"],
  ["Post-onboarding management", "Yes — full customer success lifecycle", "Not included — onboarding phase only"],
  ["Onboarding-only focus", "No — broader customer success platform", "Yes — purpose-built for intake and onboarding completion"],
  ["Pricing tier", "Enterprise — custom contracts, sales process required", "SMB-friendly — transparent pricing, free trial, no card required"],
  ["Setup time", "Weeks — enterprise onboarding and configuration", "Under 20 minutes — first onboarding live same day"],
] as const;

export default function GuidecxAlternativePage() {
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
              <span className="text-[var(--color-text-primary)]">GUIDEcx Alternative</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Honest comparison
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              GUIDEcx alternative built for small and mid-size teams
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              GUIDEcx is built for enterprise customer onboarding at scale. If you run a growing agency, consultancy, or accounting firm and need structured, enforced client intake without the enterprise price tag — ClientEnforce is purpose-built for that job.
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>GUIDEcx is built for enterprise — not for your 10-person agency</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>GUIDEcx is a genuine enterprise onboarding platform. It is designed for large SaaS and services companies running hundreds of concurrent customer implementations, with dedicated customer success teams, complex multi-stakeholder workflows, and the budget to match. For those organizations, it delivers real value.</p>
                <p>The problem is that most growing agencies, consultancies, and accounting firms are not that organization. You have a handful of account managers, you are onboarding five to twenty clients a month, and the challenge is not enterprise orchestration — it is making sure every client completes every required step before work begins, without your team manually chasing them.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">For that problem, enterprise tooling is the wrong solution. You need something purpose-built for the intake and onboarding phase — with SMB pricing and a setup time measured in minutes, not weeks.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison table */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Enterprise customer success platform vs dedicated onboarding software</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">A practical comparison of where each tool is designed to operate.</p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">GUIDEcx</th>
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
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Choose GUIDEcx if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You are an enterprise SaaS or services company with a large, dedicated customer success team",
                      "You run hundreds of concurrent customer implementations with complex multi-stakeholder workflows",
                      "You need deep integration with Salesforce, HubSpot, or other enterprise CRM platforms",
                      "Post-onboarding customer success management is as important as the onboarding phase itself",
                      "Your budget allows for enterprise tooling and a sales-led procurement process",
                    ].map((item) => (
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
                    {[
                      "You run an agency, consultancy, or accounting firm — 5 to 50 people",
                      "You onboard multiple clients per month and need the process enforced consistently every time",
                      "Clients are regularly slow to submit documents or skip steps, and it delays the start of work",
                      "You need a real audit trail per client — timestamped, exportable — not just an activity log",
                      "SMB pricing and a 20-minute setup are more important than enterprise feature depth",
                      "You want to separate onboarding from your CRM and manage it as its own process",
                    ].map((item) => (
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
                  { step: "01", icon: <FileText className="h-5 w-5" />, title: "One template per service line", body: "Build a reusable onboarding template that defines exactly what every new client needs to complete — documents, e-signatures, forms, required tasks. Build it once, deploy it every time. No enterprise configuration required." },
                  { step: "02", icon: <Mail className="h-5 w-5" />, title: "One portal link per client", body: "Send each new client a single portal link. They see their required steps clearly. No client login required. Steps are enforced in order — they cannot skip ahead or bypass required tasks." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Automated follow-up until it is done", body: "Clients receive automated reminders when tasks are overdue. Your dashboard shows completion status across every active onboarding. Every step is logged in a full timestamped audit trail — exportable as a PDF evidence pack." },
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>For accountants, legal firms, and compliance-sensitive businesses</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>If you work in a regulated environment — accountancy, legal, financial services, HR consultancy — client onboarding is not just an operational task. It is a compliance requirement. The documents you collect, the steps you complete, and the timing of each action need to be on record.</p>
                <p>ClientEnforce maintains a full timestamped audit trail of every step in the onboarding process. Every document received, every e-signature collected, every required step completed — with a date, time, and clear record of who submitted what. That record is exportable as a PDF evidence pack at any point.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">GUIDEcx is an enterprise platform built for scale. ClientEnforce is a compliance-ready onboarding tool built for the teams that need auditability without enterprise overhead.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="SMB-priced onboarding enforcement — live in 20 minutes"
          subtext="If you run a growing agency, consultancy, or accounting firm and need client onboarding that enforces completion, automates follow-up, and leaves a proper audit trail — try ClientEnforce. No enterprise contract required."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See full features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions from teams evaluating ClientEnforce as a GUIDEcx alternative.</p>
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
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/rocketlane-alternative", label: "Rocketlane alternative" },
                { href: "/copilot-alternative", label: "Copilot alternative" },
                { href: "/honeybook-alternative", label: "HoneyBook alternative" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
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
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />
    </div>
  );
}
