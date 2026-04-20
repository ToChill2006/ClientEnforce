import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Rocketlane Alternative for Agencies (2026) | ClientEnforce",
  description: "Comparing Rocketlane alternatives for your agency or consultancy? ClientEnforce delivers enforced onboarding completion — required steps, document collection, automated reminders — at SMB price. Live in 20 minutes. No credit card required.",
  path: "/rocketlane-alternative",
  keywords: ["Rocketlane alternative", "Rocketlane alternatives", "best Rocketlane alternative", "client onboarding software", "onboarding software for agencies", "client intake software"],
  type: "website",
});

const faqItems = [
  {
    question: "What is the best Rocketlane alternative for small agencies and consultancies?",
    answer: "For small to mid-size teams that need structured client onboarding without enterprise project management overhead, ClientEnforce is the most focused Rocketlane alternative. Where Rocketlane is built around customer success and project delivery for enterprise teams, ClientEnforce is purpose-built for the intake and onboarding phase — required-step enforcement, document collection, e-signatures, automated reminders, and a compliance-grade audit trail.",
  },
  {
    question: "How does ClientEnforce compare to Rocketlane on pricing?",
    answer: "Rocketlane is priced for enterprise customer success teams and typically requires a significant annual commitment with per-seat costs that scale quickly. ClientEnforce is designed for small and mid-size agencies, consultants, and accountants — transparent pricing, no enterprise negotiation required, and a free trial with no credit card needed. Most teams are live within 20 minutes of signing up.",
  },
  {
    question: "Does ClientEnforce replace Rocketlane completely?",
    answer: "Not entirely. Rocketlane covers a broader scope — ongoing project management, customer success workflows, and collaborative project rooms that extend well beyond initial onboarding. ClientEnforce focuses exclusively on the intake and onboarding phase: getting a new client from signed agreement to fully onboarded with every required document collected and step completed. Teams that need post-onboarding project delivery typically keep a separate project management tool for that phase.",
  },
  {
    question: "Can ClientEnforce handle the required-step enforcement that Rocketlane lacks for SMBs?",
    answer: "Yes — and this is one of the core differences. ClientEnforce enforces required steps at the platform level. Clients cannot proceed past a step, skip a document upload, or skip a signature. They also cannot access subsequent steps until prior ones are complete. This enforcement is automatic, not dependent on manual chasing. Automated reminders run until each task is done, and every action is recorded in a full timestamped audit trail.",
  },
  {
    question: "How long does it take to switch to ClientEnforce from Rocketlane?",
    answer: "Because ClientEnforce focuses only on onboarding (not ongoing project management), the setup is significantly simpler. Most teams build their first onboarding template and have a live client portal link within 20 minutes. There is no complex data migration — you build a fresh onboarding template for each service line, send the portal link to each new client, and the system handles reminders and tracking automatically.",
  },
  {
    question: "What are the best Rocketlane alternatives in 2026?",
    answer: "The best Rocketlane alternatives in 2026 depend on what you need to replace. If you need full post-onboarding customer success management, tools like Gainsight or Totango cover that scope. If your core need is enforced client intake and onboarding — required steps, document collection, automated follow-up, audit trail — ClientEnforce is the most purpose-built SMB alternative. It does not replace your project management tool, but it handles the onboarding phase that Rocketlane over-engineers for most agencies and consultancies.",
  },
  {
    question: "Is ClientEnforce a good Rocketlane alternative for accountants and compliance-sensitive firms?",
    answer: "Yes. ClientEnforce maintains a full timestamped audit trail of every step: every document received, every e-signature collected, every required task completed — exportable as a PDF evidence pack. For accounting firms, legal practices, and financial services businesses with AML, KYC, or regulatory intake requirements, this is exactly the compliance-grade record that Rocketlane's project-management-focused activity log does not provide.",
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
  url: "https://clientenforce.com/rocketlane-alternative",
  description: "Client onboarding software for agencies, consultants, and accountants. Enforces required-step completion, collects documents and e-signatures, automates follow-ups, and maintains a full timestamped audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const comparisonRows = [
  ["Primary focus", "Enterprise customer success and project delivery", "Client onboarding execution only — intake to kickoff-ready"],
  ["Best for", "Enterprise customer success teams at SaaS and services companies", "Agencies, consultants, accountants — teams of 5–50"],
  ["Complexity / setup time", "High — complex project rooms, resource planning, integrations", "Low — first template live in under 20 minutes"],
  ["Required step enforcement", "Flexible project tasks — clients and team can reorder or skip", "Enforced — required steps must be completed before proceeding"],
  ["Automated reminders", "Available within project workflows", "Core feature — automated until every task is done"],
  ["Audit trail", "Project activity log", "Full timestamped evidence trail per client — exportable as PDF"],
  ["Client portal", "Yes — collaborative project rooms", "Yes — no client login required, single link per client"],
  ["Multi-client dashboard", "Portfolio / account view", "Cross-portfolio completion view — see every onboarding at a glance"],
  ["Project management", "Full — Gantt, milestones, resource planning", "Not included — onboarding phase only"],
  ["Onboarding-only focus", "No — broader customer success platform", "Yes — purpose-built for intake and onboarding completion"],
  ["Pricing tier", "Enterprise — annual contracts, per-seat pricing", "SMB-friendly — transparent pricing, free trial, no card required"],
  ["Setup time", "Days to weeks — enterprise onboarding and configuration", "Under 20 minutes — first onboarding live same day"],
] as const;

export default function RocketlaneAlternativePage() {
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
              <span className="text-[var(--color-text-primary)]">Rocketlane Alternative</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Honest comparison
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Best Rocketlane alternative for agencies — ClientEnforce vs Rocketlane compared
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Rocketlane is built for enterprise customer success teams. If you run an agency, consultancy, or accounting firm and need enforced client onboarding without enterprise complexity or cost — ClientEnforce is the purpose-built alternative. Live in 20 minutes.
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Why teams look for Rocketlane alternatives</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>Rocketlane is a well-regarded platform for enterprise customer success teams. It handles complex project delivery, collaborative workspaces, Gantt-style timelines, resource planning, and multi-stakeholder coordination. For large SaaS companies with dedicated CS teams running complex implementations, it delivers real value.</p>
                <p>The problem comes when a 10-person agency or boutique consultancy tries to adopt it. The configuration is complex, the pricing is built around enterprise contracts, and the platform does far more than most growing teams need. You end up paying for Gantt charts and resource planning while the specific thing you need — enforced client onboarding steps — is buried inside a system built for a different buyer entirely.</p>
                <p>Most teams looking for Rocketlane alternatives are not searching for another enterprise platform. They need something that handles the intake and onboarding phase properly: required steps clients cannot skip, automated follow-up, and a clear audit trail — at SMB pricing, with a setup time measured in minutes.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">That is exactly what ClientEnforce is built for.</p>
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
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Rocketlane</th>
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
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Choose Rocketlane if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You are an enterprise SaaS or services company with a dedicated customer success team",
                      "You run complex, multi-phase implementations that extend months past initial onboarding",
                      "You need collaborative project rooms shared between your team and client stakeholders",
                      "You have resource planning and Gantt-style timeline needs across multiple accounts",
                      "Your budget allows for enterprise tooling and you have time for a structured implementation",
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
                      "You onboard multiple clients per month and need the process enforced, not just suggested",
                      "Clients regularly skip steps or delay document submission and it holds up your work",
                      "You need a real audit trail per client — not just an activity log — for compliance or accountability",
                      "You want something live in 20 minutes, not weeks of implementation and onboarding",
                      "Enterprise pricing and complexity are more obstacle than benefit for your team size",
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
                  { step: "01", icon: <FileText className="h-5 w-5" />, title: "One template per service line", body: "Build a reusable onboarding template that defines exactly what every new client needs to complete — documents, signatures, forms, required tasks. Build it once, use it every time. No Gantt charts required." },
                  { step: "02", icon: <Mail className="h-5 w-5" />, title: "One portal link per client", body: "When a new engagement begins, send your client a single portal link. They see their required onboarding steps clearly laid out. No client login needed. No training required. Steps unlock in order — they cannot skip ahead." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Automated follow-up until it is done", body: "Clients receive automated reminders when tasks are overdue. Your dashboard shows completion status across every active onboarding at a glance. Every action is logged in a full timestamped audit trail." },
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Built for teams where onboarding completion actually matters</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>Rocketlane is a strong tool for enterprise teams running long, complex implementation projects. But most agencies and consultancies do not have multi-month implementation cycles with dedicated CS managers. They have a handful of active client onboardings at any time, and the problem is straightforward: clients are slow to submit documents, skip required steps, and delay the start of work.</p>
                <p>ClientEnforce is designed for exactly that problem. It does not replace your CRM, your project management tool, or your billing system. It handles one phase — the intake and onboarding phase — and handles it with the enforcement and audit capability that general tools cannot provide.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">For accountants and regulated service firms, the full timestamped audit trail — every document received, every signature collected, every required step completed — is exportable as a PDF evidence pack. Compliance-ready from day one.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="The onboarding enforcement Rocketlane wasn&apos;t built to give you"
          subtext="If you run a growing agency, consultancy, or accounting firm and need client onboarding that enforces completion, automates follow-up, and leaves a proper audit trail — try ClientEnforce. Live in 20 minutes."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See full features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions from teams evaluating ClientEnforce as a Rocketlane alternative.</p>
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
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
                { href: "/dubsado-alternative", label: "Dubsado alternative" },
                { href: "/honeybook-alternative", label: "HoneyBook alternative" },
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
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />
    </div>
  );
}
