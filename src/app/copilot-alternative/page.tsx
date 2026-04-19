import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "The Best Copilot Alternative for Client Onboarding (2026) | ClientEnforce",
  description:
    "Outgrown Copilot (now Assembly) for client onboarding? Compare ClientEnforce in 2026 — required-step enforcement, document collection, e-signatures, automated reminders, and a full audit trail. Start free.",
  path: "/copilot-alternative",
  keywords: [
    "Copilot alternative",
    "Copilot alternative 2026",
    "best Copilot alternative",
    "Assembly alternative",
    "Copilot.com alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for agencies",
  ],
  type: "website",
  ogImage: "https://clientenforce.com/images/og/clientenforce-copilot-alternative-og.png",
});

const faqSchema = buildFaqPageSchema([
  {
    question: "Is ClientEnforce a full replacement for Copilot?",
    answer:
      "No — and it's not trying to be. Copilot covers messaging, billing, and ongoing client relationships. ClientEnforce focuses exclusively on the onboarding phase: getting a new client through a structured intake process completely.",
  },
  {
    question: "Does ClientEnforce have a client portal?",
    answer:
      "Yes. Clients access their onboarding steps through a secure portal link — no login required on their end. They see what's required, complete each step, and get automated reminders if anything is overdue.",
  },
  {
    question: "How long does ClientEnforce setup take?",
    answer:
      "Most teams have their first template live in under 20 minutes. You build one template per service line, then reuse it for every new client in that category.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — start free, no credit card required. You can build your first template and send your first onboarding in the same session.",
  },
]);

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Best Copilot Alternative for Agencies & Service Teams | ClientEnforce",
  url: "https://clientenforce.com/copilot-alternative",
  description:
    "ClientEnforce vs Copilot (Assembly): a comparison of client onboarding software for agencies and service teams.",
  dateModified: "2026-04-05",
};

const comparisonRows: [string, string, string][] = [
  ["Primary focus", "General client portal & service delivery", "Dedicated client onboarding enforcement"],
  ["Required step enforcement", "Partial — clients can skip steps", "Yes — steps are enforced before the workflow advances"],
  ["Automated reminders", "Basic notifications", "Rule-based automated follow-ups when steps are overdue"],
  ["Audit trail", "Limited", "Full timestamped audit trail for compliance and review"],
  ["Document collection", "File sharing", "Structured document requests with required fields"],
  ["E-signatures", "Via integrations", "Built-in"],
  ["Onboarding templates", "General project templates", "Purpose-built onboarding templates per service line"],
  ["Volume visibility", "Per-client workspace", "Dashboard view across all active onboardings"],
  ["Setup time", "Varies", "Under 20 minutes"],
  ["Pricing model", "Per seat / per client", "Flat plan"],
  ["Invoicing / CRM", "Yes", "No — focused on onboarding only"],
];

export default function CopilotAlternativePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Copilot alternative
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Copilot alternative built for client onboarding — not a general service portal
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Copilot was a solid client portal. Since rebranding to Assembly, it&apos;s grown into a broader service
                delivery platform. That&apos;s great for some teams — but if what you actually need is structured,
                enforced client onboarding where nothing gets skipped, you may find yourself working around it rather
                than with it.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce is built for one job: getting clients through onboarding completely. Every step enforced.
                Every document collected. Every signature captured. Full audit trail.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]"
                >
                  Start free trial
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                >
                  See how it works
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* Copilot is great */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Copilot is great — for the right team
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <p>
                    Copilot (now Assembly) is a capable client-facing platform. It handles messaging, file sharing,
                    billing, and service delivery in one workspace. If you&apos;re running a broadly collaborative
                    client relationship, it&apos;s worth a look.
                  </p>
                  <p>
                    But if your primary bottleneck is <strong>onboarding</strong> — specifically getting new clients to
                    submit documents, complete intake steps, and sign off before a project kicks off — Copilot&apos;s
                    general-purpose portal can feel like you&apos;re building a workaround rather than running a
                    process.
                  </p>
                </div>
              </section>

              {/* Comparison table */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Client portal vs. dedicated onboarding software
                </h2>
                <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <table className="w-full min-w-[560px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                    <thead>
                      <tr className="bg-[var(--color-bg-subtle)]">
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]"></th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Copilot / Assembly</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-accent)]">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[1]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Honestly which one */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Honestly — which one is right for you?
                </h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose Copilot / Assembly if:</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {[
                        "You want one platform for messaging, billing, file sharing, and delivery",
                        "Your onboarding is light — a few documents and a welcome message",
                        "You're a solo operator or very small team",
                        "You want an all-in-one client hub for ongoing relationships",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] p-5">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Choose ClientEnforce if:</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {[
                        "Chasing clients for documents and signatures is costing you hours every week",
                        "You onboard multiple clients at once and need a dashboard view of where each one stands",
                        "Your process has required steps that must be completed before kickoff",
                        "You need a timestamped audit trail — for compliance, accountability, or internal review",
                        "You want a structured workflow clients actually complete, not just a portal they have access to",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* How ClientEnforce handles onboarding */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  How ClientEnforce handles onboarding — in three steps
                </h2>
                <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      step: "Step 1",
                      title: "Build one template per service line",
                      desc: "Map out your onboarding steps once — documents to collect, forms to complete, signatures to capture. Save it as a reusable template. Run every new client through the same structure.",
                    },
                    {
                      step: "Step 2",
                      title: "Send one portal link when a client signs",
                      desc: "The moment a new client comes on board, send them their onboarding portal link. Everything they need to complete is in one place. No email threads. No chasing.",
                    },
                    {
                      step: "Step 3",
                      title: "Track completion and stop chasing",
                      desc: "Your dashboard shows where every client stands in real time. Automated reminders go out when steps are overdue. You follow up on exceptions — not everything.",
                    },
                  ].map((item) => (
                    <li key={item.step} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{item.step}</p>
                      <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Sound familiar */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  If Copilot hasn&apos;t solved your onboarding problem, this probably sounds familiar
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {[
                    "You've sent the same document request three times",
                    "Projects kick off before intake is actually complete",
                    "Your team has no visibility into what's been submitted and what's outstanding",
                    "Clients blame delays on you, even when the hold-up was on their end",
                    "Your \"process\" lives in someone's inbox",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                  ClientEnforce is built specifically for this problem. Not as a feature inside a broader platform — as
                  the entire point.
                </p>
              </section>

              {/* FAQ */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Frequently asked questions
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      q: "Is ClientEnforce a full replacement for Copilot?",
                      a: "No — and it's not trying to be. Copilot covers messaging, billing, and ongoing client relationships. ClientEnforce focuses exclusively on the onboarding phase: getting a new client through a structured intake process completely. Many teams use both — ClientEnforce to onboard, and another tool for ongoing delivery.",
                    },
                    {
                      q: "Does ClientEnforce have a client portal?",
                      a: "Yes. Clients access their onboarding steps through a secure portal link — no login required on their end. They see what's required, complete each step, and get automated reminders if anything is overdue.",
                    },
                    {
                      q: "How long does setup take?",
                      a: "Most teams have their first template live in under 20 minutes. You build one template per service line, then reuse it for every new client in that category.",
                    },
                    {
                      q: "Is there a free trial?",
                      a: "Yes — start free, no credit card required. You can build your first template and send your first onboarding in the same session.",
                    },
                    {
                      q: "Does ClientEnforce integrate with other tools?",
                      a: "ClientEnforce connects with the tools your team already uses. See the integrations page for the current list.",
                    },
                  ].map((item) => (
                    <article key={item.q} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.q}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.a}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* Also compare */}
              <section className="mt-4">
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Also compare</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[
                    { href: "/dubsado-alternative", label: "vs Dubsado" },
                    { href: "/honeybook-alternative", label: "vs HoneyBook" },
                    { href: "/bonsai-alternative", label: "vs Bonsai" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Ready to run onboarding properly?"
          subtext="Stop building workarounds. ClientEnforce enforces every step, so your team doesn't have to."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See how it works →"
          secondaryHref="/features"
        />
      </main>

      <PublicFooter />
      <JsonLd data={faqSchema} />
      <JsonLd data={webPageSchema} />
    </div>
  );
}
