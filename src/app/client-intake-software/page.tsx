import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Intake Software — Enforce Completion, Not Just Collection (2026) | ClientEnforce",
  description:
    "Client intake software that enforces required steps, documents, and signatures before a client goes active. Automated reminders, full audit trail, and a dashboard across all active intakes. Free to start.",
  path: "/client-intake-software",
  keywords: [
    "client intake software",
    "client intake software 2026",
    "best client intake software",
    "client intake process software",
    "new client intake software",
    "client intake automation",
    "client intake form software",
  ],
  type: "website",
  ogImage: "https://clientenforce.com/images/og/clientenforce-client-intake-software-og.png",
});

const softwareSchema = {
  ...buildSoftwareApplicationSchema({
    description:
      "Client intake software that enforces completion — not just collects. Structured intake forms, document requests, e-signatures, and automated follow-ups.",
    path: "/client-intake-software",
  }),
};

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce — Client Intake Software",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-intake-software",
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
    q: "How is this different from a form tool like Typeform or Google Forms?",
    a: "Form tools collect information, but they don't enforce completion, send structured reminders, or provide a full audit trail. If a client submits a Typeform partially, you have no way to follow up from within the tool. ClientEnforce treats each intake as a workflow — with required steps, deadlines, reminders, and progress tracking built in.",
  },
  {
    q: "Can I use ClientEnforce for just the intake phase, then hand off to another tool?",
    a: "Yes. ClientEnforce is designed to sit alongside your existing stack. Use it for the intake and onboarding phase, then transition the client to your delivery or project management tool once intake is complete.",
  },
  {
    q: "Can I collect different information for different types of clients?",
    a: "Yes. Build a separate template for each client type or service line. Retainer clients, project clients, and compliance-heavy clients can each have a tailored intake workflow.",
  },
  {
    q: "Does the client need to complete everything at once?",
    a: "No. Clients can return to their portal link and complete steps over multiple sessions. The portal tracks their progress and picks up where they left off. Reminders fire for any steps that remain outstanding.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — start free, no credit card required. Build your first intake template and send your first portal link in the same session.",
  },
  {
    q: "What happens when a required step is not completed?",
    a: "ClientEnforce sends automated reminders on a schedule you define. Required steps block intake from closing — the client's onboarding cannot be marked complete until every required item is submitted. Your team can also see at a glance which items are outstanding across all active intakes.",
  },
  {
    q: "Is the client's data secure?",
    a: "Yes. All documents and submissions are stored securely. The client portal uses a unique, secure link — no password required for the client, but submissions are encrypted in transit and at rest.",
  },
  {
    q: "Can multiple people on the client side complete different steps?",
    a: "Yes. The portal link can be shared with multiple contacts at the client organisation. Each person can complete the steps relevant to them — useful for intakes that require input from a finance contact, a technical contact, and a decision-maker.",
  },
];

const faqSchema = buildFaqPageSchema(faqItems.map((item) => ({ question: item.q, answer: item.a })));

const collectItems = [
  "Documents — contracts, IDs, certifications, credentials, briefs, brand assets, financial records",
  "Signed agreements — engagement letters, NDAs, service agreements, scope of work documents",
  "Intake forms — questionnaires, discovery forms, onboarding surveys, preference forms",
  "Access credentials — structured collection of login details, platform access, API keys",
  "Media and brand assets — logos, fonts, images, brand guidelines",
  "Compliance items — AML verification documents, regulatory declarations, audit-ready records",
];

const comparisonRows: [string, string, string, string, string][] = [
  ["Primary purpose", "Form responses", "Form responses", "CRM + proposals", "Enforced intake workflow"],
  ["Required step enforcement", "No", "No", "Partial", "Yes — steps gated until complete"],
  ["Automated reminders", "No", "No", "Basic", "Rule-based, automatic"],
  ["Audit trail", "No", "No", "Limited", "Full timestamped trail"],
  ["Document uploads", "Basic", "Basic", "File sharing", "Structured, per-step"],
  ["E-signatures", "No (add-on)", "No", "Yes", "Built-in"],
  ["Dashboard across all intakes", "No", "No", "No", "Yes"],
  ["Client login required", "No", "No", "Yes", "No"],
  ["Setup time", "Minutes", "Minutes", "Hours", "Under 20 minutes"],
  ["Pricing", "Free–£83/mo", "Free–£29/mo", "£16–£66/mo", "Free–£149/mo"],
];

export default function ClientIntakeSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client intake software — updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client intake software that enforces completion — not just collects responses
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Client intake fails quietly. A form goes out, a client submits half of it, and the rest arrives in
                pieces over the next two weeks — in emails, chat messages, and attachments that don&apos;t match what
                was asked for. Meanwhile, your team is chasing.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                ClientEnforce replaces the scattered intake process with a structured workflow. Every required document,
                form, and signature in one place. Steps enforced so clients can&apos;t skip them. Automated reminders
                that follow up when something&apos;s overdue. A dashboard that shows you exactly where each intake
                stands — without asking.
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
                  See all features
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* What breaks */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What breaks in a typical client intake process
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    <p>
                      Most intake processes are built on email and hope. A document request goes out. The client replies
                      to part of it. More requests follow. By the time the project kicks off, you&apos;re still missing
                      three things and nobody is sure who asked for what or when.
                    </p>
                    <p>
                      The root problem isn&apos;t the client — it&apos;s the process. When intake steps aren&apos;t
                      enforced, clients don&apos;t complete them. When follow-up is manual, it&apos;s inconsistent.
                      When documents arrive in email threads, nothing is organised or auditable.
                    </p>
                    <p>
                      Client intake software fixes this by structuring the process, enforcing each step, and automating
                      follow-up.
                    </p>
                  </div>
                </section>
              </FadeUp>

              {/* Comparison table */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Client intake software compared — 2026
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    Form tools collect data. ClientEnforce enforces it.
                  </p>
                  <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <table className="w-full min-w-[640px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                      <thead>
                        <tr className="bg-[var(--color-bg-subtle)]">
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]"></th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Typeform</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">Jotform</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">HoneyBook</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-accent)]">ClientEnforce</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr key={row[0]}>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[1]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[3]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </FadeUp>

              {/* What good intake software does */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What good client intake software does
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Structures the process", desc: "Every intake step is defined, sequenced, and presented to the client in one place. They know exactly what's required and in what order. Nothing is implied or assumed." },
                      { title: "Enforces required completion", desc: "Steps that must be completed before kickoff are required — clients can't skip them or submit partial responses. The portal stays open and the reminders keep firing until every item is done." },
                      { title: "Automates follow-up", desc: "Set your follow-up rules once. When a deadline passes or a step is overdue, ClientEnforce sends the reminder automatically. Your team doesn't have to track who asked for what and when." },
                      { title: "Collects the right format", desc: "Document uploads are structured requests, not \"please send me X.\" Clients upload to the correct field. Signatures are captured in-portal. Form responses are stored as data — not buried in a PDF." },
                      { title: "Creates an audit trail", desc: "Every action — upload, signature, form submission — is timestamped. You can see exactly what was submitted, when, and by whom. Useful for compliance, useful for disputes." },
                      { title: "Gives you one dashboard", desc: "See every active client intake in one view — what's complete, what's outstanding, and what's overdue. No spreadsheets, no inbox triage." },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Industry use cases */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Who uses client intake software
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { title: "Agencies", desc: "Collect signed briefs, brand assets, access credentials, and NDAs before a project kicks off. Onboard multiple clients at once without losing track of any." },
                      { title: "Accounting & bookkeeping", desc: "Enforce submission of AML documents, signed engagement letters, and prior-year records before work begins. Every submission timestamped and exportable." },
                      { title: "Law firms & solicitors", desc: "Structured intake for new matters — conflict checks, ID verification, signed terms, and case information. Fully auditable for compliance.", link: { href: "/law-firm", label: "Law firm intake →" } },
                      { title: "Financial advisers", desc: "Collect risk questionnaires, identification documents, and signed suitability agreements before an onboarding meeting. Required steps cannot be bypassed." },
                      { title: "Consulting practices", desc: "Discovery forms, signed proposals, access requirements, and NDA capture — all before the first paid hour begins." },
                      { title: "Fleet & multi-location operators", desc: "Vehicle registers, driver authorisations, insurance certificates, and signed service agreements — structured intake for B2B accounts.", link: { href: "/fleet-account-onboarding", label: "Fleet intake →" } },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                        {"link" in item && item.link ? (
                          <Link href={item.link.href} className="mt-2 inline-block text-xs font-semibold text-[var(--color-accent)] hover:underline">{item.link.label}</Link>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* How it works */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    ClientEnforce client intake — how it works
                  </h2>
                  <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { step: "Step 1", title: "Build your intake template", desc: "Define every step in your intake process: documents to collect, forms to complete, signatures to capture. Sequence them logically. Add instructions for each step so clients know exactly what to submit." },
                      { step: "Step 2", title: "Launch for each new client", desc: "When a new client signs, trigger their intake from your template. Send one portal link. Everything they need is in that link — no separate emails, no attached forms, no ambiguity." },
                      { step: "Step 3", title: "Let automation handle follow-up", desc: "ClientEnforce sends reminders when steps are overdue. You and your team focus on exceptions, not routine follow-up." },
                      { step: "Step 4", title: "Complete intake, start the project", desc: "When all required steps are marked complete, your team gets a notification. Intake is done. Everything is in the portal, timestamped, and ready to review." },
                    ].map((item) => (
                      <li key={item.step} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{item.step}</p>
                        <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeUp>

              {/* Pricing */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Pricing
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Start free. Scale when you need to.</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { plan: "Free", price: "£0", desc: "1 active onboarding template. Up to 3 client intakes/month. Core intake features." },
                      { plan: "Pro", price: "£29/mo", desc: "Unlimited templates and active intakes. Automated reminders. Audit trail." },
                      { plan: "Business", price: "£89/mo", desc: "Everything in Pro. Team roles and permissions. Priority support. White-label portal." },
                      { plan: "Agency Pro", price: "£149/mo", desc: "Everything in Business. Multi-organisation support. Advanced analytics." },
                    ].map((tier) => (
                      <div key={tier.plan} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{tier.plan}</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{tier.price}</p>
                        <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">{tier.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5">
                    <Link href="/pricing" className="text-sm font-semibold text-[var(--color-accent)] hover:underline">
                      Full pricing details →
                    </Link>
                  </div>
                </section>
              </FadeUp>

              {/* What you can collect */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What you can collect with ClientEnforce
                  </h2>
                  <ul className="mt-5 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                    {collectItems.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
                      <article key={item.q} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.q}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.a}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Related */}
              <section>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Related pages</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "The full platform for structured client onboarding." },
                    { href: "/client-portal-software", label: "Client portal software", desc: "Purpose-built portal for completion, not just access." },
                    { href: "/dubsado-vs-honeybook", label: "Dubsado vs HoneyBook", desc: "Comparing two leading intake tools — and where both fall short." },
                    { href: "/client-onboarding-checklist", label: "Client onboarding checklist", desc: "A free checklist covering every intake step." },
                    { href: "/law-firm", label: "Law firm intake", desc: "Structured matter intake for solicitors and law firms." },
                    { href: "/client-onboarding-automation", label: "Onboarding automation", desc: "Automated follow-ups and completion enforcement." },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5"
                    >
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
          heading="Get your intake under control this week"
          subtext="Build one intake template for your most common client type. Send your first portal link. See what it looks like when every step is collected, complete, and documented."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="View pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={softwareSchema} />
      <JsonLd data={ratingSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
