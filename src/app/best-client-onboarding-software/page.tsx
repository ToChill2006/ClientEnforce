import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Client Onboarding Software 2026 — Compared | ClientEnforce",
  description:
    "The best client onboarding software for agencies, consultants, and accountants in 2026. Honest comparison of ClientEnforce vs Dubsado vs HoneyBook vs Copilot — with a clear recommendation for each use case.",
  path: "/best-client-onboarding-software",
  keywords: [
    "best client onboarding software",
    "best client onboarding software 2026",
    "client onboarding software comparison",
    "top client onboarding tools",
    "client onboarding software for agencies",
  ],
  type: "website",
});

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/best-client-onboarding-software",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Free plan available. Paid plans from £29/month.",
  },
};

const faqItems = [
  {
    question: "What is the best client onboarding software for agencies in 2026?",
    answer: "For agencies onboarding multiple clients simultaneously, ClientEnforce is the most purpose-built option in 2026. It enforces required steps, collects documents and e-signatures, automates follow-ups, and gives a dashboard view across all active onboardings. Dubsado and HoneyBook are strong for solo freelancers who also need invoicing and CRM, but they were not built for onboarding at volume.",
  },
  {
    question: "Is Dubsado or HoneyBook better for client onboarding?",
    answer: "Both are all-in-one CRM tools primarily designed for solo creative professionals. Dubsado has more flexibility and workflow customisation; HoneyBook is cleaner and faster to set up. Neither was built specifically for structured, enforced onboarding at agency or team scale — they lack required-step gates, compliance-grade audit trails, and cross-client dashboard visibility.",
  },
  {
    question: "What features should I look for in client onboarding software?",
    answer: "The most important features are: required-step enforcement (clients cannot skip steps), automated follow-up reminders, structured document collection, built-in e-signatures, a dashboard to track completion across multiple clients simultaneously, and a timestamped audit trail. Secondary features include white-label portals, team roles, and template libraries.",
  },
  {
    question: "How much does client onboarding software cost?",
    answer: "Pricing varies significantly by tool and use case. ClientEnforce starts free and scales from £29/month. Dubsado starts from around £15/month (monthly billing) or £130/year. HoneyBook starts from around £13/month. Copilot (Assembly) starts from around $29/user/month. Rocketlane and GUIDEcx are enterprise-priced with custom contracts.",
  },
  {
    question: "Do I need client onboarding software or is a checklist enough?",
    answer: "A checklist tells you what should happen. Client onboarding software enforces that it does happen — with required-step gates, automated reminders, structured uploads, and a timestamped record. If you onboard fewer than two clients per month and follow up manually, a checklist may be sufficient. Above that volume, manual follow-up becomes a consistent bottleneck.",
  },
  {
    question: "Can I use client onboarding software alongside my CRM?",
    answer: "Yes. Most teams use ClientEnforce for the intake and onboarding phase, then hand the client off to their CRM, project management tool, or delivery platform once onboarding is complete. ClientEnforce is designed to complement your existing stack, not replace it.",
  },
];

const faqSchema = buildFaqPageSchema(faqItems.map((item) => ({ question: item.question, answer: item.answer })));

const comparisonRows: [string, string, string, string, string, string][] = [
  ["Primary purpose", "Onboarding enforcement", "CRM + invoicing", "CRM + invoicing", "Client portal + delivery", "Enterprise CS platform"],
  ["Best for", "Agencies, accountants, consultants", "Solo freelancers", "Independent creatives", "SMB agencies", "Enterprise SaaS CS teams"],
  ["Required step enforcement", "Yes — enforced gates", "Partial", "Partial", "Partial", "Yes"],
  ["Automated reminders", "Rule-based, automatic", "Available", "Available", "Basic", "Yes"],
  ["Audit trail", "Full timestamped trail + PDF export", "Basic activity log", "Activity log", "Limited", "Yes"],
  ["E-signatures", "Built-in", "Built-in", "Built-in", "Via integrations", "Via integrations"],
  ["Multi-client dashboard", "Yes — across all onboardings", "Per-client", "Per-client", "Per-client workspace", "Portfolio view"],
  ["Client login required", "No", "Yes", "Yes", "No", "No"],
  ["Invoicing / CRM", "No", "Yes", "Yes", "Yes", "Yes"],
  ["Setup time", "Under 20 minutes", "Hours to days", "30–60 minutes", "Varies", "Weeks"],
  ["Pricing", "Free–£149/mo", "£15–£130/yr", "£13–£66/mo", "~$29+/user/mo", "Custom/enterprise"],
];

const tools = [
  {
    name: "ClientEnforce",
    verdict: "Best for: agencies, consultants, accountants, and service teams onboarding multiple clients at once",
    pros: ["Purpose-built for onboarding enforcement — not a feature inside a broader tool", "Required steps cannot be skipped — intake is actually completed before kickoff", "No client login required — one secure link per client", "Full timestamped audit trail — exportable as PDF evidence pack", "Flat monthly pricing — not per-seat"],
    cons: ["Does not include invoicing, proposals, or CRM", "Not designed for solo freelancers with low volume"],
  },
  {
    name: "Dubsado",
    verdict: "Best for: solo freelancers and independent creative professionals who need all-in-one CRM",
    pros: ["Strong all-in-one: invoicing, contracts, scheduling, client portal", "Highly customisable workflow automation", "Good value for solopreneurs"],
    cons: ["Complex setup — takes days to configure properly", "Not built for teams managing multiple concurrent onboardings", "No cross-client dashboard visibility", "Audit trail is basic"],
  },
  {
    name: "HoneyBook",
    verdict: "Best for: independent creative professionals wanting a clean, fast-to-set-up all-in-one",
    pros: ["Clean, modern interface — quickest setup in the CRM category", "Good proposal, contract, and invoicing flow", "Suitable for solo photographers, designers, event planners"],
    cons: ["Very limited for team use — designed around a single user", "No required-step enforcement on onboarding", "Onboarding is a feature, not the product"],
  },
  {
    name: "Copilot / Assembly",
    verdict: "Best for: service businesses wanting a client-facing portal for ongoing collaboration",
    pros: ["Good general client portal — messaging, files, billing in one place", "Clean client experience", "Growing feature set post-rebrand"],
    cons: ["Per-seat pricing scales quickly", "Onboarding enforcement is limited", "Better for ongoing delivery than initial intake"],
  },
];

export default function BestClientOnboardingSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Best client onboarding software — updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Best client onboarding software 2026 — honest comparison
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                The best client onboarding software depends on your team size, onboarding volume, and how much you need to enforce completion before work begins. This guide compares the leading options — with a clear verdict for each use case.
              </p>
              {/* Short answer box */}
              <div className="mt-6 max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Short answer</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[var(--color-text-primary)]">
                  <li>• <strong>For agencies and teams onboarding multiple clients:</strong> ClientEnforce — purpose-built enforcement, flat pricing, no client login required</li>
                  <li>• <strong>For solo freelancers needing all-in-one CRM:</strong> Dubsado or HoneyBook</li>
                  <li>• <strong>For ongoing client collaboration portals:</strong> Copilot / Assembly</li>
                  <li>• <strong>For enterprise customer success:</strong> Rocketlane or GUIDEcx</li>
                </ul>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">4.8</span>
                <span className="text-sm text-[var(--color-text-secondary)]">· 47 reviews · ClientEnforce</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]">
                  Try ClientEnforce free
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  View pricing
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* Comparison table */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Client onboarding software compared — 2026
                  </h2>
                  <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <table className="w-full min-w-[780px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                      <thead>
                        <tr className="bg-[var(--color-bg-subtle)]">
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]"></th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-accent)]">ClientEnforce</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Dubsado</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">HoneyBook</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Copilot</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Rocketlane</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr key={row[0]}>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[1]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[3]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[4]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[5]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-[var(--color-text-secondary)]">Pricing and features verified April 2026. Always check provider websites for current details.</p>
                </section>
              </FadeUp>

              {/* Tool breakdowns */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Each tool reviewed
                  </h2>
                  <div className="mt-5 space-y-4">
                    {tools.map((tool) => (
                      <article key={tool.name} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{tool.name}</h3>
                        <p className="mt-1 text-xs font-semibold text-[var(--color-accent)]">{tool.verdict}</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Strengths</p>
                            <ul className="mt-1.5 space-y-1">
                              {tool.pros.map((p) => (
                                <li key={p} className="flex gap-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-success)]" />{p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Limitations</p>
                            <ul className="mt-1.5 space-y-1">
                              {tool.cons.map((c) => (
                                <li key={c} className="flex gap-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-border-strong)]" />{c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* What to look for */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What to look for in client onboarding software
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Required step enforcement", desc: "The difference between a tool that tracks onboarding and one that enforces it. Required steps block completion until they're done — clients cannot skip or bypass them." },
                      { title: "Automated follow-up reminders", desc: "Manual chasing is the biggest time drain in any onboarding process. Look for rule-based automated reminders that fire when steps are overdue — without your team doing anything." },
                      { title: "Structured document collection", desc: "Not 'please email me X' — actual structured upload steps where the client uploads to the correct field, in the correct format, at the correct stage of intake." },
                      { title: "Cross-client visibility", desc: "If you're onboarding multiple clients at once, you need a dashboard showing all of them — not just per-client views. Without this, something will always fall through." },
                      { title: "Audit trail", desc: "Every document submitted, every signature captured, every step completed — timestamped and logged. Useful for disputes, compliance requirements, and internal accountability." },
                      { title: "No client login required", desc: "Every login step reduces completion rates. The best onboarding software sends clients a link — they complete intake without creating an account or downloading anything." },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Pricing */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    ClientEnforce pricing
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { plan: "Free", price: "£0", desc: "1 template. Up to 3 client intakes/month. Core intake features." },
                      { plan: "Pro", price: "£29/mo", desc: "Unlimited templates and active intakes. Automated reminders. Audit trail." },
                      { plan: "Business", price: "£89/mo", desc: "Team roles. White-label portal. Priority support." },
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
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Compare individual tools</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/dubsado-vs-honeybook", label: "Dubsado vs HoneyBook", desc: "Full breakdown of both CRM tools and where each falls short." },
                    { href: "/dubsado-alternative", label: "Dubsado alternative", desc: "Why agencies outgrow Dubsado for onboarding." },
                    { href: "/honeybook-alternative", label: "HoneyBook alternative", desc: "Where HoneyBook falls short for team onboarding." },
                    { href: "/copilot-alternative", label: "Copilot alternative", desc: "Copilot vs ClientEnforce for structured onboarding." },
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "Full overview of the ClientEnforce platform." },
                    { href: "/client-intake-software", label: "Client intake software", desc: "Intake enforcement vs form collection." },
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
          heading="The best client onboarding software is one clients actually complete"
          subtext="Build your first template in under 20 minutes. Required steps enforced. Automated reminders included. Free to start."
          primaryLabel="Try ClientEnforce free"
          secondaryLabel="View pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={ratingSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
