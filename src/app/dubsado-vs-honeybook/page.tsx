import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata, buildFaqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubsado vs HoneyBook (2026): Full Comparison for Client Onboarding | ClientEnforce",
  description:
    "Dubsado vs HoneyBook 2026 — honest side-by-side comparison of pricing, onboarding features, required-step enforcement, and audit trails. Find out which wins for your team, and when an onboarding-first alternative is the better fit.",
  path: "/dubsado-vs-honeybook",
  keywords: [
    "dubsado vs honeybook",
    "dubsado vs honeybook 2026",
    "honeybook vs dubsado",
    "dubsado or honeybook",
    "dubsado vs honeybook comparison",
    "dubsado vs honeybook pricing",
    "honeybook competitors",
    "best honeybook alternative",
    "best dubsado alternative",
  ],
  type: "website",
});

const faqSchema = buildFaqPageSchema([
  {
    question: "Which is better for client onboarding: Dubsado or HoneyBook?",
    answer:
      "For solo freelancers, HoneyBook is easier to set up and has a cleaner out-of-the-box experience. Dubsado offers more workflow flexibility but requires significant configuration time. Neither tool enforces required onboarding steps at the platform level — clients can skip steps in both. For agencies or growing teams who need enforced intake and automated follow-up, a dedicated onboarding tool like ClientEnforce is more effective.",
  },
  {
    question: "What are the main differences between Dubsado and HoneyBook?",
    answer:
      "Dubsado is more flexible and customisable — better for complex workflow builders. HoneyBook is more opinionated with a better client-experience design and built-in AI features for leads. Both include proposals, contracts, invoicing, and scheduling. Dubsado starts around £15/month; HoneyBook starts around £13/month. Neither enforces onboarding completion at the platform level.",
  },
  {
    question: "What are the best alternatives to Dubsado and HoneyBook for agencies?",
    answer:
      "For agencies that onboard multiple clients per month and need enforcement, audit trails, and automated follow-up, ClientEnforce is the most focused alternative. It handles document collection, e-signatures, required-step enforcement, and automated reminders without the overhead of a full CRM.",
  },
  {
    question: "Is Dubsado or HoneyBook better for agencies?",
    answer:
      "Neither Dubsado nor HoneyBook was built for agency team use. Both are designed for solo operators. As team size grows, both tools lack cross-team visibility, enforced completion, and compliance-grade audit trails. Agencies with more than one account manager typically outgrow both and switch to more structured onboarding software.",
  },
  {
    question: "How does ClientEnforce compare to Dubsado and HoneyBook?",
    answer:
      "ClientEnforce focuses exclusively on the onboarding phase. Unlike Dubsado and HoneyBook, it enforces required steps at the platform level, sends automated reminders without manual setup, and maintains a compliance-grade audit trail per client. It starts free with paid plans from £29/month.",
  },
  {
    question: "What does Dubsado cost in 2026?",
    answer:
      "Dubsado pricing in 2026 starts at around $20/month (monthly) or $200/year (annual). There is a free trial limited to 3 clients. No per-seat pricing.",
  },
  {
    question: "What does HoneyBook cost in 2026?",
    answer:
      "HoneyBook pricing: Starter ~$16/mo · Essentials ~$32/mo · Premium ~$66/mo (all annual). Monthly billing adds approximately 25%. A free trial is available before billing begins.",
  },
]);

const comparisonRows = [
  ["Primary use case", "All-in-one freelancer ops", "All-in-one clientflow", "Onboarding execution"],
  ["Best-fit buyer", "Solo freelancers who build complex workflows", "Independent creatives, coaches, photographers", "Agencies and service teams, 2+ account managers"],
  ["Required step enforcement", "Not enforced — clients can skip steps", "Not enforced — flexible pipelines allow skips", "✓ Platform-level enforcement"],
  ["Automated reminders", "Configurable — requires manual setup", "Configurable — depends on workflow design", "✓ Built-in rules, no manual setup"],
  ["Client portal", "Login required", "Login required", "✓ No login — one secure link"],
  ["E-signatures", "✓ Built-in", "✓ Built-in", "✓ Built-in"],
  ["Audit trail", "Activity log — not exportable", "Activity log — not exportable", "✓ Timestamped, exportable PDF"],
  ["Cross-team dashboard", "Solo-oriented", "Solo-oriented", "✓ Full team visibility"],
  ["White-label portal", "✗", "✗", "✓ Agency Pro"],
  ["Starting price", "~£15/mo", "~£13/mo", "Free / £29/mo"],
];

const whenToChoose = [
  {
    tool: "Dubsado",
    choose: "You are a solo freelancer who wants maximum workflow flexibility and are willing to invest time in setup. You use proposals, contracts, invoicing, and scheduling in one place.",
    avoid: "You manage a team, need enforced onboarding completion, or want automated reminders without manual configuration.",
  },
  {
    tool: "HoneyBook",
    choose: "You are an independent creative or coach who wants a clean, polished client experience out of the box. You value ease of use and AI-assisted lead management.",
    avoid: "You are onboarding more than 5 clients per month with a team, or need compliance-grade audit trails.",
  },
  {
    tool: "ClientEnforce",
    choose: "Your team is losing time chasing clients for documents and signatures. You need required steps enforced, automated reminders, and a full audit trail — without managing a full CRM.",
    avoid: "You need a full CRM, invoicing, or scheduling tool. ClientEnforce handles intake; your CRM handles the rest.",
  },
];

export default function DubsadoVsHoneyBookPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Dubsado vs HoneyBook · Updated April 2026
              </p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dubsado vs HoneyBook (2026): which actually wins for client onboarding?
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Dubsado and HoneyBook are the two most popular all-in-one tools for freelancers and independent service providers. This page compares them honestly across pricing, features, onboarding enforcement, and where each one breaks down — so you can choose the right tool in 2026.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1">Dubsado ~£15/mo</span>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1">HoneyBook ~£13/mo</span>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1">ClientEnforce free / £29/mo</span>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
                    The short answer
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {[
                      { label: "Solo freelancers:", text: "HoneyBook is easier to set up; Dubsado gives more control. Both work for low volume." },
                      { label: "Agencies and growing teams:", text: "Neither enforces required steps or provides a compliance-grade audit trail. Most growing teams outgrow both." },
                      { label: "If onboarding completion is your bottleneck:", text: "ClientEnforce enforces steps at the platform level and automates reminders — without the CRM overhead." },
                    ].map(item => (
                      <li key={item.label} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span><strong className="text-[var(--color-text-primary)]">{item.label}</strong> {item.text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Dubsado vs HoneyBook vs ClientEnforce: full feature comparison
                  </h2>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">Side-by-side across the features that matter most for structured client intake.</p>
                  <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                    <table className="w-full min-w-[640px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                      <thead>
                        <tr className="bg-[var(--color-accent)] text-white">
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Feature</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Dubsado</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">HoneyBook</th>
                          <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">ClientEnforce</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr key={row[0]} className="even:bg-[var(--color-bg-subtle)]">
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[0]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[1]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3">{row[2]}</td>
                            <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-emerald-600">{row[3]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-[var(--color-text-muted)]">Pricing and features accurate as of April 2026. GBP approximate based on USD pricing.</p>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Dubsado: strengths, weaknesses, pricing
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-emerald-600">Strengths</h3>
                      <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
                        {["Highly flexible workflow builder", "Strong proposal and contract tools built-in", "No per-user or per-client pricing limits", "Active community with template libraries", "Works well for complex, non-linear client journeys"].map(s => (
                          <li key={s} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-red-500">Weaknesses</h3>
                      <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
                        {["Steep setup curve — takes weeks to configure", "Clients can bypass required steps — no enforcement", "No cross-team dashboard for multiple managers", "Automation requires manual rule-building", "Audit trail is a basic log, not compliance-grade"].map(s => (
                          <li key={s} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Pricing:</strong> ~£15/month (monthly) or ~£130/year (annual). Free trial limited to 3 clients.
                  </div>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    HoneyBook: strengths, weaknesses, pricing
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-emerald-600">Strengths</h3>
                      <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
                        {["Cleaner client experience than Dubsado", "AI-assisted lead capture and follow-up", "Faster to set up — opinionated defaults", "Good mobile app for on-the-go management", "Strong community and template marketplace"].map(s => (
                          <li key={s} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                      <h3 className="text-sm font-semibold text-red-500">Weaknesses</h3>
                      <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
                        {["Less flexible than Dubsado for custom workflows", "No required-step enforcement — clients can skip items", "Designed for solo use — limited team collaboration", "No compliance-grade audit trail", "Higher price at full tier (~£66/month)"].map(s => (
                          <li key={s} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Pricing:</strong> Starter ~£13/mo · Essentials ~£32/mo · Premium ~£66/mo (annual billing).
                  </div>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    When to choose each tool
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {whenToChoose.map((item) => (
                      <div key={item.tool} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.tool}</h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">Choose if</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{item.choose}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-red-500">Avoid if</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{item.avoid}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Where both fall short for growing teams
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                    Both tools were built for solo operators. When your team grows beyond one person, these gaps become expensive:
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                    {[
                      "Neither enforces required onboarding steps — clients can skip documents and signatures",
                      "No cross-team dashboard showing all active onboardings across account managers",
                      "Audit trails are basic activity logs — not exportable evidence packs for compliance",
                      "Automation requires manual rule-building — nothing runs automatically out of the box",
                      "Client portals require clients to create a login — increasing friction and reducing completion",
                    ].map(b => (
                      <li key={b} className="flex gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-muted)]" />{b}
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeUp>

              <FadeUp>
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { q: "Which is better: Dubsado or HoneyBook?", a: "HoneyBook is easier to set up quickly; Dubsado gives more flexibility but takes longer to configure. Neither enforces required steps. For solo operators at low volume, either works. For agencies with multiple account managers, both tools have structural limitations." },
                      { q: "What are the main differences?", a: "Dubsado is more customisable — ideal for complex workflow builders. HoneyBook is more polished with better AI features for lead management. Both include proposals, contracts, invoicing, and scheduling at similar price points." },
                      { q: "Is Dubsado or HoneyBook better for agencies?", a: "Neither was built for agency use. Both are designed for solo operators. As your team grows you will hit the same walls: no cross-team visibility, no enforced completion, no compliance audit trail. Most agencies outgrow both tools." },
                      { q: "What does Dubsado cost in 2026?", a: "Around $20/month billed monthly or $200/year annually. Free trial limited to 3 clients. No per-seat fees." },
                      { q: "What does HoneyBook cost in 2026?", a: "Starter ~$16/mo · Essentials ~$32/mo · Premium ~$66/mo (annual billing). Monthly billing adds ~25%. Free trial available." },
                      { q: "How does ClientEnforce compare?", a: "ClientEnforce enforces required steps at the platform level, sends automated reminders without manual setup, and provides a compliance-grade exportable audit trail. It focuses exclusively on intake execution and starts free with paid plans from £29/month." },
                    ].map(item => (
                      <article key={item.q} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.q}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.a}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </FadeUp>

              <section>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Related comparisons</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/dubsado-alternative", label: "Dubsado alternative", desc: "Why teams switch from Dubsado to ClientEnforce." },
                    { href: "/honeybook-alternative", label: "HoneyBook alternative", desc: "Why agencies switch from HoneyBook." },
                    { href: "/client-onboarding-software", label: "Client onboarding software", desc: "Full comparison of onboarding platforms." },
                    { href: "/client-portal-software", label: "Client portal software", desc: "Secure portals with no client login required." },
                  ].map(link => (
                    <Link key={link.href} href={link.href} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5">
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
          heading="Stop choosing between two tools that don't enforce completion"
          subtext="ClientEnforce enforces required onboarding steps, sends automated reminders, and gives your team full visibility — starting free."
          primaryLabel="Start free — no credit card needed"
          secondaryLabel="See pricing →"
          secondaryHref="/pricing"
        />
      </main>

      <PublicFooter />
      <JsonLd data={faqSchema} />
    </div>
  );
}
