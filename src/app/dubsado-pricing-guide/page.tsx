import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubsado Pricing 2026: Is It Worth It for Client Onboarding? | ClientEnforce",
  description: "A clear breakdown of Dubsado's 2026 pricing tiers, what's included, and an honest look at whether Dubsado makes sense if onboarding is your primary need — or whether a focused alternative saves you money.",
  path: "/dubsado-pricing-guide",
  keywords: ["dubsado pricing", "dubsado cost 2026", "dubsado pricing plans", "dubsado alternative", "client onboarding software"],
  type: "website",
});

const faqItems = [
  {
    question: "How much does Dubsado cost in 2026?",
    answer: "Dubsado's pricing is approximately $20/month on monthly billing or around $17/month (billed annually at ~$200/year) for their Starter plan, with their Business tier at higher pricing. These figures are approximate — check dubsado.com for current pricing and any active promotions before purchasing.",
  },
  {
    question: "Does Dubsado have a free plan?",
    answer: "Dubsado offers a free trial that allows you to add up to three clients before requiring a paid subscription. There is no ongoing free tier. Once you exceed the trial limit you need to upgrade to a paid plan to continue using the platform.",
  },
  {
    question: "What is included in Dubsado's pricing?",
    answer: "All Dubsado plans include access to their full feature set: client management (CRM), lead capture forms, proposals, contracts, invoicing, payment processing, scheduling, workflows/automations, and client portals. The key differentiator between tiers is typically team member access and support level rather than feature gating.",
  },
  {
    question: "Is Dubsado good for agencies?",
    answer: "Dubsado is designed primarily for independent service professionals — photographers, designers, coaches, and similar solo operators. Agencies with multiple team members managing simultaneous onboardings often find Dubsado's structure limiting: it does not enforce required onboarding steps, does not offer a cross-client completion dashboard, and its audit trail is not compliance-grade. Teams running five or more active onboardings simultaneously tend to benefit from a dedicated onboarding platform.",
  },
  {
    question: "Can I use ClientEnforce instead of Dubsado for onboarding?",
    answer: "Yes, if your primary use of Dubsado is getting clients through an intake and onboarding process. ClientEnforce handles required-step enforcement, document collection, e-signatures, automated reminders, and a full timestamped audit trail — all purpose-built for onboarding. It does not replace Dubsado's invoicing, proposals, or scheduling features. Many teams run ClientEnforce alongside their existing billing tool.",
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
  url: "https://clientenforce.com/dubsado-pricing-guide",
  description: "Onboarding-focused alternative to Dubsado for teams that need enforcement and an audit trail more than full-stack workflow orchestration. Pricing starts free.",
};

const dubsadoPricingRows = [
  ["Starter", "~$17/mo (annual)", "~$20/mo (monthly)", "Unlimited clients, full feature access, 1 user"],
  ["Business", "Higher annual rate", "Higher monthly rate", "Multiple team members, advanced support"],
] as const;

const dubsadoFeatures = [
  { label: "Client CRM", included: true, note: "Lead tracking, contact management" },
  { label: "Lead capture forms", included: true, note: "Embedded web forms for new enquiries" },
  { label: "Proposals", included: true, note: "Branded proposals sent to prospects" },
  { label: "Contracts and signatures", included: true, note: "E-signatures on agreements" },
  { label: "Invoicing and payments", included: true, note: "Stripe / Square integration" },
  { label: "Scheduling", included: true, note: "Appointment and meeting booking" },
  { label: "Workflows and automations", included: true, note: "Triggered sequences of actions" },
  { label: "Client portal", included: true, note: "Branded hub for client documents" },
  { label: "Required-step enforcement", included: false, note: "Clients can proceed without completing all steps" },
  { label: "Cross-client completion dashboard", included: false, note: "No aggregate view across all active onboardings" },
  { label: "Compliance-grade audit trail", included: false, note: "Activity logs, not timestamped evidence records" },
] as const;

const comparisonRows = [
  ["Starting price", "~$17/mo (annual)", "Free — no card required"],
  ["Free plan", "No (3-client trial only)", "Yes — up to 5 active onboardings"],
  ["Primary focus", "Full business management CRM", "Client onboarding execution only"],
  ["Required-step enforcement", "No — flexible progression", "Yes — required steps block progression"],
  ["Automated reminders", "Workflow automations available", "Automatic until every task is complete"],
  ["Audit trail", "Activity log", "Full timestamped evidence trail per client"],
  ["Compliance export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Client portal access", "Requires client login", "Secure link — no account, no login"],
  ["Cross-client dashboard", "Per-client project view", "Portfolio-level completion view"],
  ["E-signatures", "Yes", "Yes"],
  ["Document collection", "Yes", "Yes"],
  ["Invoicing and payments", "Yes — built in", "No — pair with your billing tool"],
  ["Lead capture and CRM", "Yes — core feature", "No — pair with your existing CRM"],
  ["Setup time", "Hours to days", "Under 20 minutes, first template same day"],
] as const;

export default function DubsadoPricingGuidePage() {
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
              <Link href="/dubsado-alternative" className="transition hover:text-[var(--color-text-primary)]">Dubsado Alternative</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">Pricing Guide</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Pricing breakdown · Updated 2026
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Dubsado pricing in 2026: is it worth it for client onboarding?
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Dubsado is a capable all-in-one platform for independent service professionals. But if structured client onboarding is your primary challenge, you may be paying for a lot of features you don't need. This guide breaks down their pricing and helps you decide.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Try ClientEnforce free
              </Link>
              <Link href="/pricing" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                See ClientEnforce pricing
              </Link>
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">No credit card required · Live in 20 minutes</p>
          </PageContainer>
        </section>

        {/* Dubsado pricing breakdown */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Dubsado pricing tiers in 2026</h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                The figures below are approximate. Dubsado periodically adjusts pricing — always verify at{" "}
                <a href="https://www.dubsado.com/pricing" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition hover:text-[var(--color-text-primary)]">dubsado.com/pricing</a>{" "}
                before committing.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Plan</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Annual billing (approx.)</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Monthly billing (approx.)</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Key inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {dubsadoPricingRows.map((row, i) => (
                      <tr key={row[0]} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-text-primary)]">{row[0]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[1]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[2]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">Prices are approximate and may not reflect active promotions or regional variations. Verify at dubsado.com.</p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* What you're paying for */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>What you're actually paying for with Dubsado</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Dubsado bundles a wide feature set into its plans. Every subscriber pays for the full platform — there's no way to purchase just the onboarding or contract management capability on its own. Here's what that subscription covers and where the gaps are for onboarding-focused teams.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Feature</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Included in Dubsado?</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Notes for onboarding-focused teams</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {dubsadoFeatures.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className="px-5 py-3.5 text-sm font-semibold text-[var(--color-text-primary)]">{row.label}</td>
                        <td className="px-5 py-3.5 text-sm">
                          {row.included ? (
                            <span className="inline-flex items-center gap-1.5 text-[var(--color-success)]">
                              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)]">
                              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="mt-6 max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-text-primary)]">The core tension:</span>{" "}
                  Dubsado's pricing assumes you'll use the whole platform. If onboarding is your primary pain point — getting clients to complete intake, upload documents, sign agreements, and confirm required information before work begins — you're still paying for CRM, lead forms, invoicing, scheduling, and proposals. For teams with those needs already covered elsewhere, that's redundant spend.
                </p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Side-by-side comparison */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Dubsado vs ClientEnforce: side-by-side</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">A direct comparison for teams whose core need is onboarding execution.</p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white">
                      <th className="sticky left-0 bg-white z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Dubsado</th>
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
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">ClientEnforce plan details: <Link href="/pricing" className="underline underline-offset-2 hover:text-[var(--color-text-primary)]">/pricing</Link></p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* When Dubsado makes sense vs when it doesn't */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>When Dubsado pricing makes sense vs when it doesn't</h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 border-l-4 border-l-[var(--color-border-strong)] shadow-[var(--shadow-sm)]">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Dubsado makes sense if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You are a solo service professional who needs proposals, contracts, invoicing, and scheduling in one place",
                      "You run a small creative business and Dubsado's all-in-one scope replaces multiple subscriptions",
                      "Your workflow is simple enough that Dubsado's built-in automations handle follow-up adequately",
                      "You want a single branded client portal covering your whole relationship — from proposal to final invoice",
                      "Your client volume is low and the flexible, informal approach to onboarding steps is fine",
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
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Dubsado pricing doesn't add up if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You already have CRM, invoicing, and scheduling tools — you'd be paying twice",
                      "You onboard five or more clients per month and need consistent, enforced intake every time",
                      "Clients regularly start projects before completing required steps and it causes downstream problems",
                      "You need a compliance-grade audit trail for AML, KYC, or internal governance",
                      "Your team manually chases clients for documents despite having software for it",
                      "You want to get onboarding running in an afternoon, not configure a full CRM system",
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

        <CtaBand
          heading="Onboarding software that does one thing well"
          subtext="ClientEnforce is built entirely around getting clients through onboarding. Starts free. Live in 20 minutes. No credit card required."
          primaryLabel="Start free — no card needed"
          secondaryLabel="See all features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions about Dubsado pricing and whether it's the right fit for your team.</p>
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
                { href: "/dubsado-alternative", label: "Dubsado alternative" },
                { href: "/honeybook-pricing-guide", label: "HoneyBook pricing guide" },
                { href: "/dubsado-vs-honeybook", label: "Dubsado vs HoneyBook" },
                { href: "/pricing", label: "ClientEnforce pricing" },
                { href: "/client-onboarding-software", label: "Client onboarding software" },
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
