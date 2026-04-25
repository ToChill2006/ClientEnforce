import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software: Features, Pricing & Reviews 2026",
  description: "Client onboarding software that enforces completion. Docs, e-signatures, automated reminders, full audit trail — for agencies and service teams. Free.",
  path: "/client-onboarding-software",
  keywords: [
    "client onboarding software",
    "best client onboarding software",
    "client onboarding software 2026",
    "client onboarding platform",
    "client onboarding automation",
    "onboarding software for agencies",
    "client onboarding software comparison",
  ],
  type: "website",
});

const softwareSchema = buildSoftwareApplicationSchema({
  description:
    "Client onboarding software that enforces completion at every step — document collection, e-signatures, automated reminders, and a full audit trail.",
  path: "/client-onboarding-software",
});

const ratingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-onboarding-software",
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
    description: "Free trial. Paid plans from £29/month.",
    availability: "https://schema.org/InStock",
    url: "https://clientenforce.com/pricing",
  },
};

const faqSchema = buildFaqPageSchema([
  {
    question: "What is client onboarding software?",
    answer:
      "Client onboarding software is a platform that manages the structured process of getting a new client from signed agreement to active project. It replaces email follow-up with automated workflows: document collection, e-signatures, required step enforcement, automated reminders, and a full timestamped audit trail. Unlike a CRM, it focuses specifically on completion — ensuring every required step is done before kickoff begins.",
  },
  {
    question: "What is the best client onboarding software for agencies?",
    answer:
      "For agencies onboarding clients at volume with a consistent, repeatable process, ClientEnforce is purpose-built: document collection, e-signatures, required-step enforcement, automated reminders, and a full audit trail — without CRM complexity. Dubsado and HoneyBook are broader tools designed for solo operators, not agency teams at scale.",
  },
  {
    question: "How is client onboarding software different from a CRM?",
    answer:
      "A CRM manages the full client relationship — leads, deals, contacts, and ongoing communications. Client onboarding software handles one specific phase: intake. It enforces completion of required steps before a project begins, triggers automated reminders when clients are overdue, and maintains a full audit trail. Most CRMs can track onboarding but not enforce it — that distinction matters at volume.",
  },
  {
    question: "How quickly can we go live with client onboarding software?",
    answer:
      "Most teams have their first onboarding template live in under 20 minutes with ClientEnforce. Map your required steps, define which items are mandatory, set reminder timing, and send the portal link when a new client signs. No developer support or custom integrations required.",
  },
  {
    question: "How much does client onboarding software cost?",
    answer:
      "ClientEnforce starts free with no credit card required. The Pro plan at £29/month unlocks unlimited onboardings and automated reminders. Business at £89/month adds advanced reporting and team management. Agency Pro at £149/month adds white-label branding and custom domains.",
  },
  {
    question: "Can agencies use this across multiple service lines?",
    answer:
      "Yes. Most agencies build one baseline onboarding template and create service-specific variants — one for SEO, one for paid media, one for web development. Each service line has its own required documents and tasks. Account managers send the right template when a client signs. Operations teams see all active onboardings in one cross-portfolio dashboard.",
  },
]);

const comparisonRows = [
  ["Required step enforcement", "✓ Platform-level", "Configurable only", "Not enforced", "Not enforced"],
  ["Automated reminders", "✓ Built-in rules", "Rule-based setup", "Limited", "Available"],
  ["Compliance-grade audit trail", "✓ Exportable PDF", "Activity log", "Activity log", "None"],
  ["Client portal (no login)", "✓", "✗ Login required", "✗ Login required", "Limited"],
  ["E-signatures", "✓ Built-in", "✓ Built-in", "✓ Built-in", "Via integration"],
  ["Multi-client team dashboard", "✓ Cross-portfolio", "Limited", "Per-client only", "✗"],
  ["White-label / custom domain", "✓ Agency Pro", "✓ Paid", "✗", "✓ Paid"],
  ["Template library (unlimited)", "✓ Pro+", "Paid tier", "Limited", "Paid tier"],
  ["Starting price", "Free / £29/mo", "~£8/mo", "~£16/mo", "~£25/mo"],
];

const features = [
  { title: "Required step enforcement", desc: "Clients cannot mark steps complete without actually completing them. Documents must be uploaded. Signatures must be captured. No skipping, no workarounds." },
  { title: "Document collection", desc: "Required files arrive in one place — not scattered across email threads. Each upload is logged, timestamped, and attached to the onboarding record." },
  { title: "Built-in e-signatures", desc: "Clients sign agreements directly inside the onboarding portal. No third-party DocuSign account required. Signatures are timestamped and stored with the onboarding record." },
  { title: "Intake forms and questionnaires", desc: "Collect structured data — business name, goals, preferences — as form answers, not unstructured email replies. Every answer searchable and exportable." },
  { title: "Automated deadline reminders", desc: "Set your reminder schedule once. When a step goes overdue, ClientEnforce follows up automatically. Your team only intervenes for genuine blockers — not routine chasing." },
  { title: "Full audit trail", desc: "Timestamped record of every action — who submitted what, when it was completed, when reminders fired — exportable as a PDF evidence pack for compliance." },
  { title: "Cross-portfolio dashboard", desc: "See every active client onboarding at a glance: completion percentage, outstanding steps, and where clients are stalling — across your entire team." },
  { title: "Reusable templates per service line", desc: "Build one template per service type, deploy it for every new client. Pro and above allow unlimited templates — one per service line, indefinitely." },
];

const industries = [
  { title: "Digital and marketing agencies", desc: "Onboard new accounts with consistent intake — creative briefs, brand assets, contracts, and access credentials — before any work begins. One template per service type, reused for every client." },
  { title: "Accounting and professional services", desc: "Collect tax documents, engagement letters, AML verification, and signed agreements through an auditable portal. Every item timestamped and attached to the client record." },
  { title: "Consulting practices", desc: "Run discovery questionnaires, signed scope agreements, and stakeholder intake through a single link before the first call. Clients complete what is required; your team shows up prepared." },
  { title: "Financial advisors", desc: "Regulated intake requires complete documentation before advice can be given. ClientEnforce enforces that completion with signed agreements, KYC documents, and a full audit trail." },
  { title: "Law firms", desc: "Onboard new matters with engagement letters, conflict-of-interest forms, and document requests in one structured portal. Clients complete intake on their own time; your team starts with everything." },
  { title: "Franchise and multi-location operators", desc: "Standardise onboarding across every location. Build one template, deploy it for every new franchisee, and track completion across your entire network from one dashboard." },
];

export default function ClientOnboardingSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client onboarding software · Updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client onboarding software for teams that want projects to start clean
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                If your team keeps chasing documents, signatures, and intake answers over email, you do not have an effort problem. You have a workflow problem. ClientEnforce replaces that with one structured process from signed agreement to kickoff-ready — where every required step is enforced, reminders fire automatically, and nothing starts until intake is genuinely complete.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Start free — no credit card needed
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
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

              {/* What it solves */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
                    What client onboarding software actually solves
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    The real cost of broken onboarding is not the admin time — it is delayed kickoffs, scope surprises, and a poor first impression that follows the client relationship for months. When a new client arrives without signed agreements, without required documents, without answered intake questions, your team improvises. Projects start on assumptions rather than facts.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Client onboarding software replaces that improvisation with a defined, enforced process. Every step is explicit. Required items cannot be skipped. Reminders fire automatically when clients are overdue. Your team sees exactly where each onboarding stands without opening a single email thread.
                  </p>
                </section>
              </FadeUp>

              {/* Competitor comparison */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Client onboarding software comparison (2026)
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Most client onboarding tools track progress but do not enforce it. Here is how the main options compare on the dimensions that matter most.
                  </p>
                  <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <table className="w-full min-w-[720px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                      <thead>
                        <tr className="bg-[var(--color-accent)] text-white">
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Feature</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">ClientEnforce</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Dubsado</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">HoneyBook</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Copilot</th>
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
                    Features and pricing accurate as of April 2026. See{" "}
                    <Link href="/dubsado-alternative" className="underline">Dubsado alternative</Link>,{" "}
                    <Link href="/honeybook-alternative" className="underline">HoneyBook alternative</Link>,{" "}
                    <Link href="/copilot-alternative" className="underline">Copilot alternative</Link> for detailed comparisons.
                  </p>
                </section>
              </FadeUp>

              {/* What to look for */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    What to look for in client onboarding software
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Not all onboarding tools enforce completion — most just track it. There are six capabilities that separate a dedicated onboarding platform from a generic checklist or a CRM module.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                    {[
                      { label: "Required step enforcement", desc: "clients cannot skip mandatory steps — the system prevents it at the platform level, not through honour-system checklists" },
                      { label: "Automated reminders", desc: "reminder rules run without manual triggers — overdue steps generate follow-ups automatically until the client responds" },
                      { label: "Compliance-grade audit trail", desc: "a timestamped, exportable record of who submitted what and when — not just an activity log" },
                      { label: "Client portal (no login needed)", desc: "a single secure link clients use without creating an account — lower friction means higher completion rates" },
                      { label: "Cross-team visibility", desc: "a dashboard where your whole team sees all active onboardings and who is blocking which steps" },
                      { label: "Template library", desc: "reusable templates per service line so account managers never manually rebuild the same process twice" },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span><strong className="text-[var(--color-text-primary)]">{item.label}</strong> — {item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeUp>

              {/* Features */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    ClientEnforce feature set
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {features.map((f) => (
                      <div key={f.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{f.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* Industries */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Who uses ClientEnforce for client onboarding
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {industries.map((item) => (
                      <article key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              {/* How to roll out */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How to roll out client onboarding software in four steps
                  </h2>
                  <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "1. Map your current intake steps", desc: "List every required item from contract to kickoff — forms, file uploads, signatures, and approvals. Include items that are currently collected informally over email." },
                      { title: "2. Build one baseline template", desc: "Start with one service line. Keep required steps explicit so completion is objective — not a judgement call. Mark everything that blocks kickoff as mandatory." },
                      { title: "3. Configure automatic follow-up", desc: "Set your reminder schedule. When a step goes overdue, ClientEnforce follows up without manual intervention. Your team stops being the reminder system." },
                      { title: "4. Review and tighten monthly", desc: "Track where clients stall. Simplify unclear steps. Remove anything that isn't genuinely required. Most teams halve their average onboarding time within the first quarter." },
                    ].map((item) => (
                      <li key={item.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
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
                    Client onboarding software pricing
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    ClientEnforce starts free with no credit card required. Upgrade when you need unlimited onboardings and automated follow-up.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { plan: "Free", price: "£0/month", features: ["Up to 3 active onboardings", "1 template", "Basic portal", "Document uploads"] },
                      { plan: "Pro", price: "£29/month", features: ["Unlimited onboardings", "Unlimited templates", "Automated reminders", "Full audit trail"] },
                      { plan: "Business", price: "£89/month", features: ["Everything in Pro", "Advanced reporting", "Team management", "API access"] },
                      { plan: "Agency Pro", price: "£149/month", features: ["Everything in Business", "White-label portal", "Custom domain", "Priority support"] },
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
                    <Link href="/pricing" className="font-medium text-[var(--color-accent)] underline">See full pricing and feature breakdown →</Link>
                  </p>
                </section>
              </FadeUp>

              {/* FAQ */}
              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Frequently asked questions about client onboarding software
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["What is client onboarding software?", "Client onboarding software manages the structured process of getting a new client from signed agreement to active project. It replaces email follow-up with automated workflows — document collection, e-signatures, required step enforcement, automated reminders, and a full audit trail. Unlike a CRM, it focuses on completion: every required step must be done before kickoff begins."],
                      ["How is client onboarding software different from a CRM?", "A CRM manages the full client relationship — leads, deals, contacts, and ongoing communications. Client onboarding software handles one specific phase: intake. It enforces completion of required steps before a project begins, triggers automated reminders when clients are overdue, and maintains a full audit trail. Most CRMs can track onboarding but not enforce it — that distinction matters at volume."],
                      ["Can agencies use this across multiple service lines?", "Yes. Most agencies build one baseline template and create service-specific variants — one for SEO, one for paid media, one for web development. Each service line has its own required documents and tasks. Account managers send the right template when a client signs; operations teams see all active onboardings in one dashboard."],
                      ["How quickly can we go live?", "Most teams have their first onboarding template live in under 20 minutes. Map your required steps, define which items are mandatory, set reminder timing, and send the portal link when a new client signs. No developer support or custom integrations required."],
                      ["What is the best client onboarding software for agencies?", "For agencies that onboard multiple clients per month and need a consistent, repeatable process, ClientEnforce is purpose-built. It enforces required steps at the platform level, automates reminders, and provides a full audit trail — without the overhead of a full CRM. Compare it against Dubsado and HoneyBook if you currently use those tools for onboarding."],
                      ["Does ClientEnforce integrate with my existing tools?", "ClientEnforce works standalone or alongside your CRM. Send portal links from any email client, CRM, or project tool. The API is available on Business and Agency Pro plans for deeper workflow integrations."],
                    ].map(([question, answer]) => (
                      <article key={question} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{question}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{answer}</p>
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
                    { href: "/client-portal-software", label: "Client portal software", desc: "The secure portal where clients complete intake." },
                    { href: "/client-onboarding-automation", label: "Onboarding automation", desc: "Automated reminders and completion enforcement." },
                    { href: "/dubsado-alternative", label: "Dubsado alternative", desc: "Compare ClientEnforce vs Dubsado." },
                    { href: "/honeybook-alternative", label: "HoneyBook alternative", desc: "Compare ClientEnforce vs HoneyBook." },
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
          heading="Start onboarding clients properly this week"
          subtext="Build one template, send your first portal link, and see what it looks like when every required step is actually complete before kickoff."
          primaryLabel="Start free — no credit card needed"
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
