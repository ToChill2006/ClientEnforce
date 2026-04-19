import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Client Portal Software (2026): Features, Pricing & Comparison | ClientEnforce",
  description:
    "The best client portal software for agencies and service teams in 2026. Secure intake, document collection, e-signatures, and automated follow-up in one portal. Compare ClientEnforce vs Copilot, HoneyBook, and Clinked. Free to start.",
  path: "/client-portal-software",
  keywords: [
    "client portal software",
    "best client portal software",
    "client portal software 2026",
    "client onboarding portal",
    "client portal for agencies",
    "secure client portal",
    "client portal software comparison",
    "white label client portal",
  ],
  type: "website",
  ogImage: "https://clientenforce.com/images/og/clientenforce-client-portal-software-og.png",
});

const softwareSchema = buildSoftwareApplicationSchema({
  description:
    "Client portal software built for completion — not just access. Structured intake, document collection, e-signatures, and automated reminders in one portal.",
  path: "/client-portal-software",
});

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-portal-software",
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
    description: "Free trial available. Paid plans from £29/month.",
    availability: "https://schema.org/InStock",
    url: "https://clientenforce.com/pricing",
  },
};

const faqSchema = buildFaqPageSchema([
  {
    question: "What is client portal software?",
    answer:
      "Client portal software is a secure, structured workspace where clients complete required onboarding steps — uploading documents, signing agreements, answering intake questions — through a single link. Unlike file storage or generic project tools, purpose-built client portal software enforces completion: required steps stay open until actually finished, and automated reminders follow up when clients go quiet.",
  },
  {
    question: "What is the best client portal software for agencies?",
    answer:
      "For agencies that onboard multiple clients per month, ClientEnforce is purpose-built for structured intake. It enforces required steps, sends automated reminders, maintains a compliance-grade audit trail, and supports white-label branding on Agency Pro. Copilot (now Assembly) is broader but lacks enforcement. HoneyBook is designed for solo operators, not agency teams.",
  },
  {
    question: "Do clients need to create an account to use the portal?",
    answer:
      "No. Clients access their onboarding portal through a secure, unique link — no account creation, no passwords, no app to download. They click the link, see every required step, and complete it on any device. If their session ends, they return to the same link and pick up exactly where they left off.",
  },
  {
    question: "Can I white-label the client portal?",
    answer:
      "Yes. On Agency Pro, you can add your logo, brand colours, and custom domain so the portal experience shows your company — not ClientEnforce. Clients see your brand from the moment they open the link.",
  },
  {
    question: "How much does client portal software cost?",
    answer:
      "ClientEnforce starts free. Paid plans from £29/month (Pro) for teams who need unlimited onboardings and automated reminders. Agency Pro at £149/month adds white-label branding, custom domains, and priority support.",
  },
  {
    question: "What is the difference between ClientEnforce and Copilot?",
    answer:
      "Copilot (now Assembly) is a broad client operations platform — messaging, billing, and ongoing client relationships. ClientEnforce focuses specifically on the onboarding phase: enforcing required steps, collecting documents and signatures, and following up automatically until intake is complete. If onboarding completion is your bottleneck, ClientEnforce is the more focused tool.",
  },
  {
    question: "Is the client portal secure?",
    answer:
      "Yes. Portals are accessed via secure, unique token-based links. Documents are stored with encryption. Every action is logged in a timestamped audit trail that is exportable for compliance review.",
  },
  {
    question: "What's the difference between ClientEnforce and SharePoint or Google Drive?",
    answer:
      "SharePoint and Google Drive are file storage platforms — they give clients a place to put things but do not enforce completion, track progress, send reminders, or provide an audit trail. ClientEnforce is a workflow tool: clients can't mark steps complete without actually completing them, and your team sees exactly where every onboarding stands.",
  },
]);

const comparisonRows = [
  ["Required step enforcement", "✓ Enforced", "Configurable", "Not enforced", "Not enforced"],
  ["Automated reminders", "✓ Built-in", "Configurable", "Limited", "Limited"],
  ["Document upload requests", "✓", "✓", "✓", "File sharing only"],
  ["E-signatures", "✓ Built-in", "Via integration", "✓", "Via integration"],
  ["Audit trail (compliance-grade)", "✓ Exportable", "Activity log", "Activity log", "None"],
  ["White-label / custom domain", "✓ Agency Pro", "✓", "Paid tier", "Paid tier"],
  ["No client login required", "✓", "✗", "✗", "✗"],
  ["Multi-client team dashboard", "✓", "✓", "Limited", "Clinked focus"],
  ["Starting price", "Free / £29/mo", "~£25/mo", "~£16/mo", "~£13/mo"],
];

const portalFeatures = [
  { title: "No client login required", desc: "Clients access everything through a single secure link. No account creation, no password reset friction. Lower barriers mean higher completion rates." },
  { title: "Required step enforcement", desc: "Steps can't be marked complete without the actual completion. Documents must be uploaded. Signatures must be captured. No workarounds." },
  { title: "Document upload requests", desc: "Clients upload files directly into the correct portal step — no email attachments, no file naming confusion." },
  { title: "Built-in e-signatures", desc: "Capture legally binding signatures inside the portal. No third-party DocuSign account required." },
  { title: "Form fields and intake questionnaires", desc: "Collect structured data — business name, contact info, preferences — as form answers, not PDFs buried in email." },
  { title: "Automated deadline reminders", desc: "Rule-based reminders fire automatically when steps are overdue. Your team stops chasing manually." },
  { title: "Compliance-grade audit trail", desc: "Timestamped record of every action — who submitted what and when — exportable as a PDF evidence pack." },
  { title: "Team visibility dashboard", desc: "See every active onboarding at a glance: completion percentage, outstanding steps, and bottlenecks." },
  { title: "Reusable templates per service line", desc: "Build once, deploy for every new client in that category. Agency and Business plans allow unlimited templates." },
  { title: "White-label branding", desc: "Add your logo, brand colours, and custom domain on Agency Pro so clients see your brand, not ClientEnforce." },
];

const useCases = [
  {
    title: "Marketing and digital agencies",
    desc: "Onboard new accounts with a consistent intake process — creative briefs, brand assets, contracts, and access credentials collected in one portal before any work begins. Every step required, every document tracked.",
  },
  {
    title: "Accounting and professional services firms",
    desc: "Collect tax documents, engagement letters, AML verification, and signed agreements through a secure, auditable portal. Timestamped records for every step — not an email thread.",
  },
  {
    title: "Consulting practices",
    desc: "Run discovery questionnaires, signed scope agreements, and stakeholder intake through a single portal link. Clients complete what is required before your first call — no prep time wasted on missing documents.",
  },
  {
    title: "Financial advisors",
    desc: "Regulated intake requires complete documentation before advice can be given. ClientEnforce enforces that completion — signed agreements, KYC documents, risk questionnaires — with a full audit trail.",
  },
  {
    title: "Law firms and legal practices",
    desc: "Onboard new matters with signed engagement letters, conflict-of-interest forms, and document requests in a single structured portal. Clients complete intake on their own time; your team starts with everything they need.",
  },
  {
    title: "Franchise and multi-location operators",
    desc: "Standardise onboarding across locations. Build one template per service type, deploy it for every new franchisee or client, and track completion across your entire network from one dashboard.",
  },
];

export default function ClientPortalSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client portal software · Updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client portal software built for completion — not just access
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most client portal software gives clients somewhere to log in. ClientEnforce gives clients something to
                finish. Every step in your onboarding workflow is required, tracked, and followed up automatically — with
                a full audit trail that proves what was submitted and when.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                If your current portal is a place clients can access but not necessarily complete, ClientEnforce is built
                for that gap.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]"
                >
                  Start free — no credit card needed
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                >
                  View pricing →
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                Rated 4.8/5 by 47 teams · Plans from £29/month · Free trial included
              </p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              {/* No Login Required */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
                    No client login required — one secure link, everything they need
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Clients access their onboarding portal through a single secure link. No account creation, no password, no app to download. They click the link, see every required step laid out clearly, and work through it on any device. When their session ends, they return to the same link and pick up exactly where they left off.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-text-secondary)]">
                    Fewer barriers = higher completion rates. This is the most common reason teams switch from generic portals to ClientEnforce.
                  </p>
                </section>
              </FadeUp>

              {/* Comparison vs competitors */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Client portal software comparison: ClientEnforce vs alternatives
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    There are several client portal tools on the market. Here is how ClientEnforce compares to the most common alternatives across the dimensions that matter for structured onboarding.
                  </p>
                  <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <table className="w-full min-w-[720px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                      <thead>
                        <tr className="bg-[var(--color-accent)] text-white">
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Feature</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">ClientEnforce</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Copilot (Assembly)</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">HoneyBook</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Clinked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr key={row[0]} className="even:bg-[var(--color-bg-subtle)]">
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-emerald-600">{row[1]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[3]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                    Pricing and features accurate as of April 2026. See{" "}
                    <Link href="/copilot-alternative" className="underline">Copilot alternative</Link>,{" "}
                    <Link href="/honeybook-alternative" className="underline">HoneyBook alternative</Link> for detailed comparisons.
                  </p>
                </section>
              </FadeUp>

              {/* What portal software must do */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What client portal software actually needs to do
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    <p>
                      A client portal that only provides access does not solve the onboarding problem. Clients log in, look around, and leave without completing anything. Your team still chases. Projects still kick off with missing documents.
                    </p>
                    <p>Effective client portal software must enforce completion — not just enable it. That means:</p>
                  </div>
                  <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                    {[
                      { label: "Required steps", desc: "clients cannot skip items that must be completed before kickoff" },
                      { label: "Automated follow-up", desc: "reminders that fire when a deadline passes, without manual intervention" },
                      { label: "Progress visibility", desc: "your team sees where each client stands without digging through email" },
                      { label: "Audit trail", desc: "a timestamped record of what was completed, when, and by whom" },
                      { label: "Simple client access", desc: "no complex login flow — one link, one place, everything they need" },
                      { label: "Compliance-grade records", desc: "exportable evidence pack per onboarding for regulated industries" },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span><strong>{item.label}</strong> — {item.desc}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    ClientEnforce is built around exactly these requirements. It is the only client portal focused exclusively on completion enforcement — not general client relationship management.
                  </p>
                </section>
              </FadeUp>

              {/* How it works */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How the ClientEnforce client portal works
                  </h2>
                  <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { title: "Build the workflow once", desc: "Define every required step — documents, forms, signatures, checklists. Organise in the order clients should complete them. Save as a reusable template per service line." },
                      { title: "Clients access with one link", desc: "Send one portal link. No account creation needed. Clients see every step clearly laid out, with instructions and file requirements for each one." },
                      { title: "Required steps are enforced", desc: "Clients cannot mark a step complete without actually completing it. A document upload stays open until the file is submitted. No workarounds, no skipped steps." },
                      { title: "Automated reminders handle follow-up", desc: "Set reminder rules once. When a deadline passes, ClientEnforce follows up automatically. Your team only intervenes for genuine blockers — not routine chasing." },
                      { title: "Track everything from one dashboard", desc: "See every active client onboarding — completion percentage, outstanding steps, bottlenecks — without opening a single email thread." },
                    ].map((item) => (
                      <li key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeUp>

              {/* What's included */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What&apos;s included in the ClientEnforce client portal
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {portalFeatures.map((f) => (
                      <div key={f.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{f.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Who uses it */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Who uses ClientEnforce as their client portal
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
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
                    Client portal software pricing
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    ClientEnforce starts free with no credit card required. Paid plans unlock unlimited onboardings, automated reminders, and white-label branding.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {[
                      { plan: "Free", price: "£0/month", features: ["Up to 3 active onboardings", "1 template", "Basic portal", "Document uploads"] },
                      { plan: "Pro", price: "£29/month", features: ["Unlimited onboardings", "Unlimited templates", "Automated reminders", "Full audit trail"] },
                      { plan: "Agency Pro", price: "£149/month", features: ["Everything in Pro", "White-label branding", "Custom domain", "Priority support"] },
                    ].map((tier) => (
                      <div key={tier.plan} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{tier.plan}</p>
                        <p className="mt-1 text-lg font-semibold text-[var(--color-accent)]">{tier.price}</p>
                        <ul className="mt-3 space-y-1.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                    <Link href="/pricing" className="font-medium text-[var(--color-accent)] underline">See full pricing →</Link>
                  </p>
                </section>
              </FadeUp>

              {/* FAQ */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Frequently asked questions about client portal software
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        q: "What is client portal software?",
                        a: "Client portal software is a secure workspace where clients complete required onboarding steps — uploading documents, signing agreements, answering intake questions — through a single link. Purpose-built portal software enforces completion: steps stay open until finished, and automated reminders follow up when clients go quiet.",
                      },
                      {
                        q: "What is the best client portal software for agencies?",
                        a: "For agencies onboarding multiple clients per month, ClientEnforce is purpose-built for structured intake. It enforces required steps, sends automated reminders, maintains a compliance-grade audit trail, and supports white-label branding. Copilot is broader but lacks enforcement. HoneyBook is designed for solo operators, not agency teams.",
                      },
                      {
                        q: "Do clients need to create an account to use the portal?",
                        a: "No. Clients access their onboarding portal through a secure link — no account creation, no passwords. They click the link, see exactly what they need to complete, and work through it on any device.",
                      },
                      {
                        q: "Can I white-label the client portal?",
                        a: "Yes. On Agency Pro, you can add your logo, brand colours, and custom domain so the portal shows your company — not ClientEnforce. Clients see your brand from the moment they open the link.",
                      },
                      {
                        q: "How much does client portal software cost?",
                        a: "ClientEnforce starts free. Paid plans from £29/month (Pro) for unlimited onboardings and automated reminders. Agency Pro at £149/month adds white-label branding, custom domains, and priority support.",
                      },
                      {
                        q: "Is the client portal secure?",
                        a: "Yes. Portals are accessed via secure, unique token-based links. Documents are stored with encryption. Every action is logged in a timestamped audit trail exportable for compliance review.",
                      },
                    ].map((item) => (
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
                    { href: "/copilot-alternative", label: "Copilot alternative", desc: "Compare ClientEnforce vs Copilot (Assembly)." },
                    { href: "/honeybook-alternative", label: "HoneyBook alternative", desc: "Why agencies switch from HoneyBook." },
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
          heading="Start your first client portal this week"
          subtext="Build one onboarding template, send a portal link, and see what it looks like when every step is completed — not just accessed."
          primaryLabel="Start free — no credit card needed"
          secondaryLabel="See pricing →"
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
