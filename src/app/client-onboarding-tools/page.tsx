import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Client Onboarding Tools 2026 | Compared | ClientEnforce",
  description:
    "Comparing the best client onboarding tools in 2026. Honest breakdown of ClientEnforce vs Dubsado vs HoneyBook vs manual process - with a clear recommendation for each use case.",
  path: "/client-onboarding-tools",
  keywords: [
    "best client onboarding tools",
    "client onboarding software comparison",
    "client onboarding automation tools",
    "onboarding software for agencies",
  ],
  type: "website",
});

const faqItems = [
  {
    question: "What is the best client onboarding tool for agencies?",
    answer: "For agencies that run multiple client onboardings simultaneously, ClientEnforce is the most purpose-built option. It enforces required-step completion, automates follow-up reminders, and gives your team a dashboard across every active onboarding — rather than treating onboarding as a feature within a broader CRM. Dubsado and HoneyBook work well for solo operators who need invoicing and client management alongside onboarding.",
  },
  {
    question: "What should I look for in a client onboarding tool?",
    answer: "The most important features are required-step enforcement (clients cannot skip mandatory tasks), automated reminders (no manual chasing), and a dashboard that shows completion status across every active onboarding. Secondary features to evaluate: no-login client portal (reduces drop-off), e-signature support, document collection, and a timestamped audit trail for compliance-sensitive work.",
  },
  {
    question: "How is dedicated onboarding software different from a CRM?",
    answer: "A CRM tracks contact and deal information — it does not enforce what clients need to do before kickoff. Dedicated onboarding tools like ClientEnforce enforce completion: required documents and signatures are gated, clients receive automated reminders when steps are overdue, and kickoff cannot happen with an incomplete intake file. This difference matters significantly once you are running three or more concurrent onboardings.",
  },
  {
    question: "Can I use Dubsado or HoneyBook for team onboarding at scale?",
    answer: "Dubsado and HoneyBook work well for solo freelancers and independent creative professionals. When an agency or service team needs to run five or more concurrent onboardings with multiple account managers involved, the flexibility of these tools becomes a liability — there is no enforced consistency, no cross-portfolio dashboard, and the audit trail is not compliance-grade. That is the gap a purpose-built onboarding tool fills.",
  },
  {
    question: "Is there a free client onboarding tool?",
    answer: "ClientEnforce offers a free trial with no credit card required. The free Solo plan supports a limited number of active onboardings — enough to validate whether a structured, enforced onboarding process makes sense for your business. Most teams upgrade to a paid plan within the first month as volume grows.",
  },
  {
    question: "How quickly can I set up a client onboarding tool?",
    answer: "With ClientEnforce, most teams build their first onboarding template in under 20 minutes. You map your required steps, set which documents and signatures are mandatory, configure reminder timing, and send the portal link when a new client signs. No developer support, no integration setup, no onboarding call required — the tool is designed to be live the same day you sign up.",
  },
];

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
  url: "https://clientenforce.com/client-onboarding-tools",
  description: "Client onboarding software that enforces required-step completion, automates follow-ups, and maintains a full audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const toolRows = [
  [
    "ClientEnforce",
    "Agencies, consultants, accountants onboarding at volume",
    "Purpose-built - entire product",
    "Full timestamped trail + PDF export",
    "Free trial available",
  ],
  [
    "Dubsado",
    "Solo freelancers needing all-in-one CRM",
    "Module within broader CRM",
    "Basic activity log",
    "From ~£20/mo",
  ],
  [
    "HoneyBook",
    "Independent creative professionals",
    "Part of clientflow platform",
    "Activity log",
    "From ~£19/mo",
  ],
  [
    "Content Snare",
    "Teams needing document collection only",
    "Document collection focused",
    "Basic",
    "From ~£12/mo",
  ],
  [
    "Manual (email + spreadsheet)",
    "Very early stage, very low volume",
    "None",
    "None",
    "Free",
  ],
] as const;

export default function ClientOnboardingToolsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Client onboarding tools</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Best client onboarding tools for agencies and service teams
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                The best tool depends on your team size, onboarding volume, and how much completion enforcement you need before kickoff.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Start free trial
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                >
                  Explore client onboarding software
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>How the main client onboarding tools compare (2026)</h2>
                <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <table className="w-full min-w-[940px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                    <thead>
                      <tr className="bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Tool</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Best for</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Onboarding depth</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Audit trail</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Pricing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[1]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[3]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
                  Pricing and features change - verify current details on each provider&apos;s website. Last updated April 2026.
                </p>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Which tool fits your situation?</h2>
                <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">
                  Choose ClientEnforce if you run an agency, consultancy, or accounting firm, onboard three or more clients per month, and need a consistent enforceable process with an audit trail.
                </h3>
                <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">
                  Choose Dubsado or HoneyBook if you are a solo freelancer or independent creative who needs invoicing, contracts, and CRM in one place alongside basic onboarding.
                </h3>
                <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">
                  Choose Content Snare if your only problem is document collection and you do not need workflow enforcement, audit trails, or client portals.
                </h3>
                <h3 className="mt-5 text-base font-semibold text-[var(--color-text-primary)]">
                  Stick with manual if you are just getting started and client volume is low enough to manage personally. You will outgrow it - but there is no need to pay for software until the pain is real.
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding software
                  </Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding automation
                  </Link>
                  <Link href="/client-onboarding-checklist" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding checklist
                  </Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    view pricing
                  </Link>
                  <Link href="/dubsado-alternative" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    Dubsado alternative
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="See why teams choose ClientEnforce for client onboarding"
          subtext="Build your first onboarding template in under 20 minutes — required-step enforcement, automated reminders, and a full audit trail included."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="Compare all features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions about client onboarding tools
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {faqItems.map((item) => (
                  <article key={item.question} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={faqSchema} />
      <JsonLd data={aggregateRatingSchema} />
    </div>
  );
}
