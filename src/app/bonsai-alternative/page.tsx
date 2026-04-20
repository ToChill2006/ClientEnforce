import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Bonsai Alternative for Agencies & Teams (2026) | ClientEnforce",
  description:
    "Looking for a Bonsai alternative built for structured client onboarding? ClientEnforce enforces required steps, collects documents and e-signatures, and automates reminders. Free to start.",
  path: "/bonsai-alternative",
  keywords: [
    "Bonsai alternative",
    "Bonsai alternatives",
    "best Bonsai alternative",
    "Bonsai app alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for agencies",
  ],
  type: "website",
});

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce — Bonsai Alternative",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/bonsai-alternative",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Best Bonsai Alternative for Agencies & Teams | ClientEnforce",
  url: "https://clientenforce.com/bonsai-alternative",
  description: "ClientEnforce vs Bonsai: a comparison of client onboarding software for agencies and service teams.",
  dateModified: "2026-04-20",
};

const faqItems = [
  {
    question: "What is the best Bonsai alternative for agencies?",
    answer: "For agencies that need structured, enforced client onboarding at volume, ClientEnforce is the most purpose-built Bonsai alternative. Where Bonsai covers the full freelancer lifecycle — proposals, contracts, invoicing, time tracking — ClientEnforce focuses entirely on onboarding execution: required-step enforcement, document collection, e-signatures, automated reminders, and a full audit trail.",
  },
  {
    question: "Does ClientEnforce replace Bonsai completely?",
    answer: "No. Bonsai handles the full client lifecycle for independent freelancers — proposals, contracts, invoicing, time tracking, and project management. ClientEnforce handles one phase: getting a new client through onboarding completely. Many teams use ClientEnforce for intake alongside a separate billing or CRM tool.",
  },
  {
    question: "Why do agencies switch from Bonsai to a dedicated onboarding tool?",
    answer: "Bonsai was designed for solo freelancers, not for agencies managing multiple concurrent onboardings. It lacks required-step enforcement (clients can skip steps), has no cross-client dashboard for tracking completion at volume, and its audit trail is not compliance-grade. Teams with three or more concurrent onboardings consistently outperform with a dedicated tool.",
  },
  {
    question: "How does pricing compare to Bonsai?",
    answer: "Bonsai's paid plans start from around £21/month and scale per user. ClientEnforce offers a free plan and paid plans from £29/month as a flat rate — no per-seat charges. For teams managing multiple onboardings simultaneously, ClientEnforce's flat pricing is typically more cost-effective.",
  },
  {
    question: "How long does ClientEnforce setup take?",
    answer: "Most teams have their first template live in under 20 minutes. You build one template per service line, then reuse it for every new client in that category.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes — start free, no credit card required. You can build your first template and send your first onboarding in the same session.",
  },
];

const faqSchema = buildFaqPageSchema(faqItems.map((i) => ({ question: i.question, answer: i.answer })));

const comparisonRows: [string, string, string][] = [
  ["Primary focus", "Full freelancer CRM — proposals, invoicing, time tracking", "Dedicated client onboarding enforcement"],
  ["Best for", "Solo freelancers and independent contractors", "Agencies, consultants, accountants — teams of 5–50"],
  ["Required step enforcement", "No — clients can skip steps", "Yes — steps enforced before intake closes"],
  ["Automated reminders", "Basic", "Rule-based, automatic until tasks complete"],
  ["Audit trail", "Basic activity log", "Full timestamped trail — exportable as PDF"],
  ["Document collection", "File sharing", "Structured per-step document requests"],
  ["E-signatures", "Built-in", "Built-in"],
  ["Multi-client dashboard", "Per-client workspace", "Dashboard across all active onboardings"],
  ["Client login required", "Yes", "No — single secure link"],
  ["Invoicing / time tracking", "Yes", "No — onboarding phase only"],
  ["Pricing", "From ~£21/mo per user", "Free–£149/mo flat rate"],
];

export default function BonsaiAlternativePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Bonsai alternative — updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Bonsai alternative built for structured client onboarding — not an all-in-one freelancer tool
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Bonsai is a solid tool for independent freelancers who need proposals, contracts, invoicing, and time tracking in one place. If that&apos;s your primary need, it&apos;s worth considering.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                But if your main problem is getting new clients to complete onboarding — submitting documents, signing agreements, completing intake steps — before work begins, Bonsai&apos;s general-purpose approach leaves the enforcement gap open. ClientEnforce closes it.
              </p>
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
                  Start free trial
                </Link>
                <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]">
                  See how it works
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* Comparison table */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Bonsai vs ClientEnforce — 2026 comparison
                </h2>
                <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <table className="w-full min-w-[540px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                    <thead>
                      <tr className="bg-[var(--color-bg-subtle)]">
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]"></th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Bonsai</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-accent)]">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[1]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Which one */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Which one is right for you?
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose Bonsai if:</h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {[
                          "You are a solo freelancer or independent contractor",
                          "You need proposals, contracts, invoicing, and time tracking in one place",
                          "Your onboarding is light — a contract and a welcome form",
                          "You prefer an all-in-one tool that covers your whole workflow",
                        ].map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] p-5">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose ClientEnforce if:</h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {[
                          "You run an agency or service team managing multiple concurrent onboardings",
                          "Clients regularly skip steps or delay submitting documents",
                          "You need a dashboard showing completion status across all active clients",
                          "You need a timestamped audit trail for compliance or accountability",
                          "Bonsai's per-seat pricing is becoming expensive as your team grows",
                          "You want clients to complete intake without creating an account",
                        ].map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </FadeUp>

              {/* How it works */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How ClientEnforce handles onboarding
                  </h2>
                  <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      { step: "Step 1", title: "Build one template per service line", desc: "Define required documents, forms, e-signatures, and intake questions. Save as a reusable template. Run every new client through the same structure." },
                      { step: "Step 2", title: "Send one portal link per client", desc: "Clients access their required steps through a secure link — no login, no friction. Automated reminders fire when steps are overdue." },
                      { step: "Step 3", title: "Track completion across all clients", desc: "Dashboard shows every active onboarding in one view. Required steps block intake from closing. Every submission is timestamped and auditable." },
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

              {/* Also compare */}
              <section>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Also compare</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/dubsado-vs-honeybook", label: "Dubsado vs HoneyBook", desc: "Full side-by-side breakdown of the two leading CRM tools." },
                    { href: "/dubsado-alternative", label: "vs Dubsado", desc: "How ClientEnforce compares to Dubsado." },
                    { href: "/honeybook-alternative", label: "vs HoneyBook", desc: "How ClientEnforce compares to HoneyBook." },
                    { href: "/copilot-alternative", label: "vs Copilot", desc: "ClientEnforce vs Copilot for onboarding enforcement." },
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
          heading="Ready to enforce your onboarding — not just track it?"
          subtext="Build your first template in under 20 minutes. Required steps enforced. Automated reminders included. Free to start."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See how it works →"
          secondaryHref="/features"
        />
      </main>

      <PublicFooter />
      <JsonLd data={ratingSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={webPageSchema} />
    </div>
  );
}
