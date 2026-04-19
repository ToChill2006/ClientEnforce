import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Intake Software for Agencies & Service Teams (2026) | ClientEnforce",
  description:
    "Client intake software that enforces completion — not just collects. Structured intake forms, document requests, e-signatures, and automated follow-ups for 2026. Free to start.",
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

const faqSchema = buildFaqPageSchema([
  {
    question: "How is ClientEnforce different from a form tool like Typeform or Google Forms?",
    answer:
      "Form tools collect information, but they don't enforce completion, send structured reminders, or provide a full audit trail. ClientEnforce treats each intake as a workflow — with required steps, deadlines, reminders, and progress tracking built in.",
  },
  {
    question: "Can I collect different information for different types of clients?",
    answer:
      "Yes. Build a separate template for each client type or service line. Retainer clients, project clients, and compliance-heavy clients can each have a tailored intake workflow.",
  },
  {
    question: "Does the client need to complete everything at once?",
    answer:
      "No. Clients can return to their portal link and complete steps over multiple sessions. The portal tracks their progress and picks up where they left off. Reminders fire for any steps that remain outstanding.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — start free, no credit card required. Build your first intake template and send your first portal link in the same session.",
  },
]);

const collectItems = [
  "Documents — contracts, IDs, certifications, credentials, briefs, brand assets, financial records",
  "Signed agreements — engagement letters, NDAs, service agreements, scope of work documents",
  "Intake forms — questionnaires, discovery forms, onboarding surveys, preference forms",
  "Access credentials — structured collection of login details, platform access, API keys",
  "Media and brand assets — logos, fonts, images, brand guidelines",
  "Compliance items — AML verification documents, regulatory declarations, audit-ready records",
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
                Client intake software
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
                      When documents arrive in email threads, nothing is organized or auditable.
                    </p>
                    <p>
                      Client intake software fixes this by structuring the process, enforcing each step, and automating
                      follow-up.
                    </p>
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
                    {[
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
                    { href: "/client-portal-software", label: "Client portal software", desc: "Purpose-built portal for completion, not just access." },
                    { href: "/client-onboarding-automation", label: "Client onboarding automation", desc: "Automated follow-ups and completion enforcement." },
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
      <JsonLd data={faqSchema} />
    </div>
  );
}
