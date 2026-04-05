import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Dubsado Alternative for Agencies & Teams | ClientEnforce",
  description: "Outgrown Dubsado for client onboarding? ClientEnforce enforces completion at every step — document collection, e-signatures, audit trail — built for agencies running multiple onboardings at once. Start free.",
  path: "/dubsado-alternative",
  keywords: ["Dubsado alternative", "client onboarding software", "client onboarding automation", "onboarding software for agencies", "client onboarding checklist"],
  type: "website",
  ogImage: "https://clientenforce.com/images/og/clientenforce-dubsado-alternative-og.png",
});

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Best Dubsado Alternative for Agencies & Teams | ClientEnforce",
  url: "https://clientenforce.com/dubsado-alternative",
  description: "ClientEnforce vs Dubsado: a comparison of client onboarding software for agencies and service teams.",
  dateModified: "2026-04-05",
};

const faqItems = [
  {
    question: "What is the best Dubsado alternative for agencies?",
    answer: "For agencies that need structured, repeatable client onboarding at volume, ClientEnforce is the most purpose-built Dubsado alternative. Unlike Dubsado — which covers the full client lifecycle for solo freelancers — ClientEnforce focuses entirely on the onboarding phase: required-step enforcement, document collection, e-signatures, automated reminders, and a full audit trail.",
  },
  {
    question: "Can I migrate my Dubsado workflows to ClientEnforce?",
    answer: "You do not need to migrate — you rebuild. ClientEnforce templates are fast to set up (under 20 minutes for a first template). Map your current onboarding steps, define required tasks, and send the portal link when a new client signs. Most teams go live within one working day.",
  },
  {
    question: "Does ClientEnforce replace Dubsado completely?",
    answer: "No. ClientEnforce handles client onboarding execution — from signed agreement to kickoff-ready. It does not include invoicing, proposals, lead management, or scheduling. If you need those features, you would run ClientEnforce alongside your billing or CRM tool. Many teams switch from using Dubsado for onboarding to ClientEnforce, while keeping a separate invoicing tool.",
  },
  {
    question: "Why do agencies outgrow Dubsado for onboarding?",
    answer: "Dubsado was designed for solo freelancers who manage every client themselves. When a team of account managers runs multiple concurrent onboardings, Dubsado's flexibility becomes a liability — it does not enforce required steps, does not provide a clean cross-portfolio view, and its audit trail is not compliance-grade. Teams with three or more active onboardings at any time consistently find that a dedicated onboarding tool outperforms a CRM workaround.",
  },
  {
    question: "Is ClientEnforce cheaper than Dubsado?",
    answer: "Pricing depends on your team size and plan. ClientEnforce is focused on onboarding execution, so you are not paying for features you do not use (invoicing, proposals, scheduling). Check the pricing page for current plan details.",
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
  url: "https://clientenforce.com/dubsado-alternative",
  description: "Client onboarding software for agencies and service teams. Enforces required-step completion, collects documents and signatures, automates follow-ups, and maintains a full audit trail.",
};

const comparisonRows = [
  ["Primary focus", "Full CRM — invoicing, proposals, contracts, scheduling", "Client onboarding execution only"],
  ["Best for", "Solo freelancers and creative professionals", "Agencies, consultants, accountants — teams of 5–50"],
  ["Onboarding depth", "Module within a broader CRM", "Entire product built around onboarding completion"],
  ["Automated reminders", "Available", "Core feature — clients get nudged until tasks are done"],
  ["Audit trail", "Basic activity log", "Full timestamped evidence trail per client"],
  ["Compliance-ready export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Client portal", "Yes — branded", "Yes — no client login required"],
  ["Multiple onboardings at once", "Manageable for solo use", "Built for volume — dashboard view across all clients"],
  ["Required step enforcement", "Flexible", "Enforced — kickoff cannot happen with incomplete intake"],
  ["Setup time", "Hours to days — complex workflow configuration", "Under 20 minutes — first template live same day"],
  ["Invoicing and payments", "Yes — built in", "No — not a CRM"],
  ["Proposals and contracts", "Yes", "E-signatures on onboarding documents only"],
] as const;

export default function DubsadoAlternativePage() {
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
              <span className="text-[var(--color-text-primary)]">Dubsado Alternative</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Honest comparison
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              The Dubsado alternative built for agencies — not just freelancers
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Dubsado is a solid tool. But if you run an agency or service team and your main pain is chaotic client onboarding, you need something more focused.
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Dubsado is great — for the right person</h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>Dubsado built its reputation with solo freelancers and creative professionals. Photographers, designers, consultants running one-person businesses. For them, it works well: proposals, contracts, invoicing, scheduling, and basic client management all in one place.</p>
                <p>The problem starts when teams try to use it for structured, repeatable onboarding at volume. Dubsado was not designed for an agency account manager running eight client onboardings simultaneously. The setup complexity becomes a bottleneck when ops needs a consistent process across every new client.</p>
                <p className="font-semibold text-[var(--color-text-primary)]">That is the gap ClientEnforce fills.</p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison table */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>CRM vs dedicated onboarding software</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Here is what the difference looks like in practice.</p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
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
            </FadeUp>
          </PageContainer>
        </section>

        {/* Choose X if */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Honestly — which one is right for you?</h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 border-l-4 border-l-[var(--color-border-strong)] shadow-[var(--shadow-sm)]">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Choose Dubsado if:</h3>
                  <ul className="mt-4 space-y-3">
                    {["You are a solo freelancer or creative professional", "You need invoicing, payment processing, and proposals all in one place", "Your client volume is low and you manage most things yourself", "You want an all-in-one business management system", "You are in photography, event management, or a similar creative field"].map((item) => (
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
                    {["You run an agency or service team with multiple people involved in onboarding", "You onboard three or more clients per month and need a consistent, repeatable process", "Your main pain is chasing clients for documents and signatures — not managing invoices", "You need visibility across multiple onboardings simultaneously", "You work in a compliance-sensitive environment and need an auditable intake trail", "You have tried using Dubsado for onboarding and found the setup too complex"].map((item) => (
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>How ClientEnforce handles onboarding — in three steps</h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { step: "01", icon: <FileText className="h-5 w-5" />, title: "Build a template for each service line", body: "Map your onboarding steps once. Define required documents, signatures, and information. Takes under 20 minutes." },
                  { step: "02", icon: <Mail className="h-5 w-5" />, title: "Send the portal link when a client signs", body: "One link. The client sees exactly what they need to do, in order. No login required." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Watch completion — your team stops chasing", body: "Clients get automated reminders when tasks are overdue. Kickoff happens when intake is actually done." },
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

        {/* Pain points */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>If you have outgrown Dubsado for onboarding, this probably sounds familiar</h2>
              <ul className="mt-6 max-w-3xl space-y-3">
                {["You have customised Dubsado workflows extensively and they still do not enforce what clients actually need to do", "Your account managers are still sending follow-up emails manually because the automations are not quite right", "You cannot get a clear view of which clients are onboarding-complete and which are still missing information", "A client started a project before intake was finished and it caused problems", "You need a proper audit trail for compliance reasons and Dubsado's activity log is not sufficient"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="Ready to run onboarding properly?"
          subtext="Build your first onboarding template in under 20 minutes — no Dubsado migration needed."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See full features →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">Common questions from teams evaluating ClientEnforce as a Dubsado alternative.</p>
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
                { href: "/onboarding-for-agencies", label: "For agencies" },
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
      <JsonLd data={webPageSchema} />
    </div>
  );
}
