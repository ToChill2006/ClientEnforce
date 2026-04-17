import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Portal Software for Agencies & Service Teams | ClientEnforce",
  description:
    "ClientEnforce is client portal software built for completion — not just access. Structured intake, document collection, e-signatures, and automated reminders in one portal. Start free.",
  path: "/client-portal-software",
  keywords: [
    "client portal software",
    "client onboarding portal",
    "client portal for agencies",
    "secure client portal",
  ],
  type: "website",
  ogImage: "https://clientenforce.com/images/og/clientenforce-client-portal-software-og.png",
});

const softwareSchema = {
  ...buildSoftwareApplicationSchema({
    description:
      "Client portal software built for completion — not just access. Structured intake, document collection, e-signatures, and automated reminders in one portal.",
    path: "/client-portal-software",
  }),
};

const faqSchema = buildFaqPageSchema([
  {
    question: "Do clients need to create an account to use the portal?",
    answer:
      "No. Clients access their onboarding portal through a secure link. No account creation, no passwords. They click the link and see exactly what they need to complete.",
  },
  {
    question: "Can I use different portal templates for different service lines?",
    answer:
      "Yes. Build one template per service type — retainer onboarding, project kickoff, compliance intake — and use the right template for each new client.",
  },
  {
    question: "Is the client portal secure?",
    answer:
      "Yes. Portals are accessed via secure, unique links. Documents are stored securely. The audit trail provides a full record of activity for compliance and review purposes.",
  },
  {
    question: "What's the difference between ClientEnforce and a tool like SharePoint or Google Drive?",
    answer:
      "SharePoint and Google Drive are file storage platforms. They give clients a place to put things — but they don't enforce completion, send automated reminders, or provide an audit trail. ClientEnforce is a workflow tool, not a file system.",
  },
]);

const portalFeatures = [
  { title: "Structured step-by-step workflow", desc: "Customizable per service line — clients see exactly what's required and in what order." },
  { title: "Document upload requests", desc: "Clients upload files directly to the correct portal field — no email attachments." },
  { title: "Built-in e-signatures", desc: "Sign directly inside the portal. No third-party tool required." },
  { title: "Form fields and questionnaires", desc: "Collect information as structured data, not PDFs buried in email." },
  { title: "Automated deadline reminders", desc: "Rule-based follow-up fires automatically when steps are overdue." },
  { title: "Full audit trail", desc: "Timestamped record of every action, exportable for compliance and review." },
  { title: "Team visibility dashboard", desc: "See all active onboardings at a glance — completion percentage and bottlenecks." },
  { title: "Reusable templates", desc: "Build once, deploy for every client in that category." },
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
                Client portal software
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client portal software built for completion — not just access
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most client portal software gives clients somewhere to log in. ClientEnforce gives clients something to
                finish. Every step in your onboarding workflow is laid out, required, and tracked — with automated
                reminders that follow up when clients go quiet and an audit trail that shows exactly what was completed
                and when.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                If your current client portal is a place clients can access, but not necessarily a place they complete
                their intake, ClientEnforce is built for the gap.
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
                  See all features
                </Link>
              </div>
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
                    No login required for clients
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Clients access their onboarding portal through a single secure link — no account creation, no password, no app to download. They click the link, see exactly what they need to complete, and work through it on any device. When their session ends, they return to the same link and pick up exactly where they left off.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-text-secondary)]">
                    Fewer barriers = higher completion rates. It&apos;s the most common reason teams switch from generic portals to ClientEnforce.
                  </p>
                </section>
              </FadeUp>

              {/* What client portal software needs to do */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What client portal software actually needs to do
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    <p>
                      A client portal that only provides access doesn&apos;t solve the onboarding problem. Clients log
                      in, look around, and leave without completing anything. Your team still chases. Projects still kick
                      off with missing documents.
                    </p>
                    <p>Effective client portal software needs to enforce completion — not just enable it. That means:</p>
                  </div>
                  <ul className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                    {[
                      { label: "Required steps", desc: "clients can't skip items that must be completed before kickoff" },
                      { label: "Automated follow-up", desc: "reminders that fire when a deadline passes, without manual intervention" },
                      { label: "Progress visibility", desc: "your team sees where each client stands without digging through email" },
                      { label: "Audit trail", desc: "a timestamped record of what was completed, when, and by whom" },
                      { label: "Simple client access", desc: "no complex login flow; one link, one place, everything they need" },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span><strong>{item.label}</strong> — {item.desc}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    ClientEnforce is built around exactly these requirements.
                  </p>
                </section>
              </FadeUp>

              {/* Who uses ClientEnforce */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Who uses ClientEnforce as their client portal
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        title: "Marketing and digital agencies",
                        desc: "Onboard new accounts with a consistent intake process — creative briefs, brand assets, contracts, and access credentials — collected in one structured portal before any work begins.",
                      },
                      {
                        title: "Accounting and professional services firms",
                        desc: "Collect tax documents, engagement letters, AML verification, and signed agreements through a secure, auditable client portal. Every item timestamped, every step trackable.",
                      },
                      {
                        title: "Consulting practices",
                        desc: "Run discovery, stakeholder questionnaires, and signed scope agreements through a single portal link. Clients see what's required and complete it — without email threads.",
                      },
                      {
                        title: "Operations and service delivery teams",
                        desc: "Any team that collects documents and approvals from new clients before a project can start. One template, one portal link, zero chasing.",
                      },
                    ].map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </article>
                    ))}
                  </div>
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
                      { title: "You build the workflow once", desc: "Define your required steps — documents to collect, forms to complete, signatures to capture. Organize them in the order clients should complete them. Save as a reusable template." },
                      { title: "Clients access it with one link", desc: "When a new client comes on board, send one portal link. No account creation required on their end. They see every step clearly laid out, with instructions and requirements for each." },
                      { title: "Required steps are enforced", desc: "Clients can't mark a step complete without actually completing it. If a document upload is required, the step stays open until the file is submitted. No workarounds." },
                      { title: "Automated reminders handle follow-up", desc: "Set your reminder rules once. When a deadline passes or a step is overdue, ClientEnforce follows up automatically. Your team only intervenes for genuine blockers." },
                      { title: "You track everything from one dashboard", desc: "See every active client onboarding in one view — completion percentage, outstanding steps, and bottlenecks — without opening a single email thread." },
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

              {/* FAQ */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        q: "Do clients need to create an account to use the portal?",
                        a: "No. Clients access their onboarding portal through a secure link. No account creation, no passwords. They click the link and see exactly what they need to complete.",
                      },
                      {
                        q: "Can I use different portal templates for different service lines?",
                        a: "Yes. Build one template per service type — retainer onboarding, project kickoff, compliance intake — and use the right template for each new client.",
                      },
                      {
                        q: "Is the client portal secure?",
                        a: "Yes. Portals are accessed via secure, unique links. Documents are stored securely. The audit trail provides a full record of activity for compliance and review purposes.",
                      },
                      {
                        q: "Can I brand the client portal?",
                        a: "Yes — add your logo, brand colors, and custom welcome messages so the portal experience feels like your company, not a third-party tool.",
                      },
                      {
                        q: "What's the difference between ClientEnforce and a tool like SharePoint or Google Drive?",
                        a: "SharePoint and Google Drive are file storage platforms. They give clients a place to put things — but they don't enforce completion, send automated reminders, or provide an audit trail. ClientEnforce is a workflow tool, not a file system.",
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
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Related</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "The full platform for structured client onboarding." },
                    { href: "/client-onboarding-automation", label: "Client onboarding automation", desc: "Automated follow-ups and completion enforcement." },
                    { href: "/features", label: "All features", desc: "Every tool included in ClientEnforce." },
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
          heading="Start with one workflow this week"
          subtext="Build one template, send your first portal link, and see what it looks like when every step is collected, complete, and documented."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="See pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
