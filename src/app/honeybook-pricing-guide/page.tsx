import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "HoneyBook Pricing 2026: What the Price Hike Means for Your Team | ClientEnforce",
  description: "HoneyBook raised prices ~89% in 2025. See the current HoneyBook pricing tiers, what you're actually paying for, and why teams focused on onboarding are switching to ClientEnforce — which starts free.",
  path: "/honeybook-pricing-guide",
  keywords: ["honeybook pricing", "honeybook price increase", "honeybook cost 2026", "honeybook alternative", "client onboarding software"],
  type: "website",
});

const faqItems = [
  {
    question: "How much did HoneyBook raise its prices?",
    answer: "HoneyBook raised prices by approximately 89% in 2025. Their Essentials plan, which was widely used by small teams, moved from around $39/month to approximately $79/month (monthly billing). This significant increase prompted many teams to re-evaluate whether HoneyBook's full feature set was worth the cost for their use case.",
  },
  {
    question: "What are HoneyBook's current pricing tiers?",
    answer: "As of 2026, HoneyBook's plans are approximately: Starter (~$19/mo), Essentials (~$39/mo), and Premium (~$79/mo) on annual billing — with higher prices on monthly billing. These figures are approximate and subject to change; check honeybook.com for current pricing before making a decision.",
  },
  {
    question: "Is HoneyBook worth the price for agencies?",
    answer: "It depends on what you need. HoneyBook packages lead capture, proposals, contracts, invoicing, scheduling, and client communication in one platform. For solo creative professionals, that breadth has real value. For agencies whose primary problem is structured client onboarding — getting the right information and documents before a project starts — most of that feature set goes unused, making HoneyBook expensive for what you actually need.",
  },
  {
    question: "Can I switch from HoneyBook to ClientEnforce?",
    answer: "Yes. ClientEnforce is not a data migration — you build a fresh onboarding workflow for each service line. Most teams have a first onboarding template live within one working day. ClientEnforce handles intake, document collection, e-signatures, automated follow-ups, and audit trail. Invoicing, proposals, and lead capture remain in whatever tool you prefer for those jobs.",
  },
  {
    question: "Does ClientEnforce have a free plan?",
    answer: "Yes. ClientEnforce starts free — no credit card required. The free Solo plan lets you run up to 5 active onboardings with one template, useful for testing the workflow before committing. Paid plans add automated reminders, audit trails, team seats, and higher onboarding volume.",
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
  url: "https://clientenforce.com/honeybook-pricing-guide",
  description: "Client onboarding software for US agencies, consultants, and accountants. Starts free. Required-step enforcement, document collection, e-signatures, automated reminders, audit trail.",
};

const hbPricingRows = [
  ["Starter", "~$19/mo (annual)", "~$29/mo (monthly)", "1 user, basic features"],
  ["Essentials", "~$39/mo (annual)", "~$59/mo (monthly)", "Unlimited clients, full clientflow"],
  ["Premium", "~$79/mo (annual)", "~$109/mo (monthly)", "Unlimited members, priority support"],
] as const;

const comparisonRows = [
  ["Starting price", "~$39/mo (Essentials, annual)", "Free — no card required"],
  ["Onboarding enforcement", "Flexible — steps not required", "Required-step enforcement built in"],
  ["Automated reminders", "Available", "Core feature — runs until tasks done"],
  ["Audit trail", "Activity log", "Full timestamped evidence trail per client"],
  ["Compliance export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Client access", "Client portal with login", "Secure link — no client login required"],
  ["Team dashboard", "Per-client project view", "Cross-portfolio completion view"],
  ["E-signatures", "Yes", "Yes"],
  ["Document collection", "Yes", "Yes"],
  ["Proposals and invoicing", "Yes — full feature", "No — dedicated onboarding tool only"],
  ["Lead capture and CRM", "Yes", "No — pair with your existing CRM"],
  ["Setup time", "Hours to days", "Under 20 minutes, first template same day"],
] as const;

const onboardingComparisonRows = [
  ["Required-step enforcement", "No — clients can advance without completing all steps", "Yes — required steps block progression"],
  ["Automated follow-up reminders", "Email automations available", "Automatic until every task is marked done"],
  ["Full audit trail", "Activity log (not compliance-grade)", "Timestamped record of every action, exportable as PDF"],
  ["Client portal access", "Client login required", "Secure link — no account, no friction"],
  ["Cross-client dashboard", "Per-client project view", "See completion status across all active onboardings"],
  ["Onboarding templates", "Workflows / automations", "Dedicated reusable onboarding templates per service line"],
] as const;

export default function HoneyBookPricingGuidePage() {
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
              <Link href="/honeybook-alternative" className="transition hover:text-[var(--color-text-primary)]">HoneyBook Alternative</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">Pricing Guide</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Pricing breakdown · Updated 2026
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              HoneyBook pricing in 2026: what changed and what to do about it
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              HoneyBook raised its prices by approximately 89% in 2025. If you're a team that uses HoneyBook primarily for client onboarding, this guide breaks down what you're paying for — and whether there's a better option for your actual use case.
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

        {/* HoneyBook pricing breakdown */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>HoneyBook pricing tiers in 2026</h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                The figures below are approximate based on publicly available information. Prices are subject to change — always check{" "}
                <a href="https://www.honeybook.com/pricing" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition hover:text-[var(--color-text-primary)]">honeybook.com/pricing</a>{" "}
                before making a purchasing decision.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Plan</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Annual billing (approx.)</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Monthly billing (approx.)</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Key inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {hbPricingRows.map((row, i) => (
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
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">Prices are approximate and may not reflect current promotions or regional variations. Verify at honeybook.com before signing up.</p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* What the price increase means */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>What HoneyBook's price increase actually means</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>
                  HoneyBook is a full clientflow platform. That means a single subscription covers lead capture, proposals, contract management, invoicing, payment processing, scheduling, and client communication — in addition to some onboarding workflows.
                </p>
                <p>
                  For independent creative professionals who need all of those things, the pricing is defensible. But for an agency, consultancy, or accounting firm that already has a CRM, uses separate invoicing software, and doesn't rely on HoneyBook for lead capture — the price increase is a direct hit on a feature set you're not fully using.
                </p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  If the core reason you have HoneyBook is to get clients through an onboarding process — collecting documents, getting signatures, following up until everything is complete — you're paying full clientflow prices for a workflow problem.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Lead capture", note: "You likely don't need this from HoneyBook if you have a CRM or website form" },
                  { label: "Proposals & invoicing", note: "Most teams with 5+ clients have dedicated billing tools already" },
                  { label: "Scheduling", note: "Calendly, Google Calendar, or your CRM already handles this" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Side-by-side pricing comparison */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>HoneyBook Essentials vs ClientEnforce: side-by-side</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">
                A practical breakdown of what you get at each price point for onboarding-centric teams.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white">
                      <th className="sticky left-0 bg-white z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">HoneyBook Essentials</th>
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
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">ClientEnforce pricing: see <Link href="/pricing" className="underline underline-offset-2 hover:text-[var(--color-text-primary)]">/pricing</Link> for current plan details.</p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* If you're paying for HoneyBook just for onboarding */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>If you're paying for HoneyBook just for onboarding, there's a better option</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                HoneyBook includes onboarding as part of a broader clientflow system. ClientEnforce is built entirely around onboarding completion. Here's how the two compare on the tasks that matter when your primary problem is getting clients through intake.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Onboarding capability</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">HoneyBook</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">ClientEnforce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {onboardingComparisonRows.map((row, i) => (
                      <tr key={row[0]} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className={`sticky left-0 z-10 px-5 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}`}>{row[0]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[1]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
            <FadeUp delay={120}>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 border-l-4 border-l-[var(--color-border-strong)]">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Stay with HoneyBook if:</h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "You rely on HoneyBook for proposals, contracts, and invoicing in one place",
                      "You are a solo professional or independent creative business owner",
                      "Your onboarding volume is low and informal follow-up is manageable",
                      "You want AI-assisted lead capture and client communication in the same tool",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 border-l-4 border-l-[var(--color-accent)]">
                  <h3 className="text-lg font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Switch to ClientEnforce if:</h3>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      "You're paying for HoneyBook features you rarely use — proposals, invoicing, scheduling",
                      "Clients regularly start projects before intake is complete",
                      "Your team manually chases clients for documents and signatures",
                      "You need a proper audit trail for compliance, AML, or KYC obligations",
                      "You onboard three or more clients per month and the process needs to be consistent",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="Pay for what you actually use"
          subtext="ClientEnforce is built for one job: getting clients through onboarding. Starts free, live in 20 minutes, no credit card required."
          primaryLabel="Start free — no card needed"
          secondaryLabel="See all features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions about HoneyBook pricing, the 2025 price hike, and switching to a dedicated onboarding tool.</p>
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
                { href: "/honeybook-alternative", label: "HoneyBook alternative" },
                { href: "/dubsado-pricing-guide", label: "Dubsado pricing guide" },
                { href: "/pricing", label: "ClientEnforce pricing" },
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/onboarding-for-accountants", label: "For accountants" },
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
