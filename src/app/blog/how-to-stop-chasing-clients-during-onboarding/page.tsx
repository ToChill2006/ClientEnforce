import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildFaqPageSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How to Stop Chasing Clients During Onboarding (And What to Do Instead) | ClientEnforce",
  description:
    "Client chasing during onboarding is a system problem, not a people problem. Here's why tracking tools don't solve it — and what enforcement-first onboarding looks like instead.",
  path: "/blog/how-to-stop-chasing-clients-during-onboarding",
  keywords: [
    "client onboarding automation",
    "onboarding software for agencies",
    "stop chasing clients",
    "client onboarding follow-up",
    "client onboarding enforcement",
    "automated client onboarding",
  ],
  type: "article",
});

const publishedTime = "2026-04-13T09:00:00.000Z";
const modifiedTime = "2026-04-13T09:00:00.000Z";

const faqSchema = buildFaqPageSchema([
  {
    question: "Why do clients keep missing onboarding steps even when you remind them?",
    answer:
      "Because reminders are optional. Clients can read a reminder email and still not act. Enforcement means the onboarding portal does not advance until the step is complete — reminders become irrelevant because the system blocks progress, not just requests it.",
  },
  {
    question: "What is the difference between onboarding tracking and onboarding enforcement?",
    answer:
      "Tracking shows you what is missing. Enforcement prevents clients from bypassing required steps. A tracking tool tells you the intake form is incomplete at the end of the week. An enforcement tool stops the client from submitting partial intake in the first place.",
  },
  {
    question: "What is client onboarding automation?",
    answer:
      "Client onboarding automation is software that handles follow-up, reminders, and completion verification without manual intervention — so your team is not spending time chasing clients for documents, signatures, or form submissions.",
  },
  {
    question: "How much time do agencies actually spend chasing clients during onboarding?",
    answer:
      "Teams typically spend 3–6 hours per client on manual follow-up during onboarding: sending reminder emails, verifying received documents, confirming signature status, and nudging stakeholders. At ten onboardings per month, that is a full working week of pure administration.",
  },
  {
    question: "Can I automate onboarding without losing the personal touch?",
    answer:
      "Yes. Enforcement and automation handle the mechanical work — making sure steps get done. Your team's personal involvement is preserved for the moments where judgment and relationship actually matter: strategy sessions, kickoff calls, and proactive advice. Chasing is not personal touch.",
  },
]);

export default function HowToStopChasingClientsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <article className="py-12 sm:py-16">
              <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
                <span>/</span>
                <Link href="/blog" className="transition hover:text-[var(--color-text-primary)]">Blog</Link>
                <span>/</span>
                <span className="text-[var(--color-text-primary)]">Stop chasing clients during onboarding</span>
              </nav>

              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Client onboarding automation
              </div>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Stop Chasing Clients During Onboarding (And What to Do Instead)
              </h1>
              <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-xs font-bold text-[var(--color-accent)]">
                  T
                </div>
                <div>
                  <span className="font-medium text-[var(--color-text-primary)]">Thomas</span>
                  <span className="mx-1.5 text-[var(--color-text-muted)]">·</span>
                  <span>Founder, ClientEnforce</span>
                  <span className="mx-1.5 text-[var(--color-text-muted)]">·</span>
                  <time dateTime={publishedTime}>
                    {new Date(publishedTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Your account manager sends the intake form. The client opens it and doesn&apos;t finish. Three days later, a reminder goes out. Another three days: a follow-up. By day ten, someone is on the phone doing manually what the form was supposed to do automatically. The project is behind. Nobody is sure whose fault it is. And it will happen again next month with the next client.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                If you&apos;re an agency, consultancy, or service team that onboards clients repeatedly, this is not an occasional problem. It&apos;s the default state of onboarding built on email, spreadsheets, and tracking tools that show you what&apos;s missing without doing anything about it. This post explains why chasing keeps happening — and what a different approach looks like.
              </p>

              {/* TL;DR */}
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                <h2
                  className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  TL;DR
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-primary)]">
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />
                    Chasing happens because your onboarding process communicates requirements — it doesn&apos;t enforce them.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />
                    Tracking tools (checklists, CRMs, spreadsheets) show you what&apos;s missing. They do not prevent clients from skipping steps.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />
                    Enforcement means required steps cannot be bypassed — progress is gated until each step is genuinely complete.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-primary)]" />
                    <Link href="/client-onboarding-automation" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">
                      Client onboarding automation
                    </Link>{" "}
                    handles follow-up until completion — so your team&apos;s time goes to client work, not administrative chasing.
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]"
                >
                  Try ClientEnforce free
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                >
                  See how enforcement works
                </Link>
              </div>
            </article>
          </PageContainer>
        </section>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <section>
          <PageContainer>
            <article className="space-y-6 py-10 sm:py-12">

              {/* Section 1 */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Why client chasing keeps happening — and why it&apos;s a system problem, not a people problem
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  The standard narrative is that clients are disorganized, or that your account managers aren&apos;t following up hard enough, or that you need a better reminder template. None of that is the real issue.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Client chasing is what happens when your onboarding process runs on communication rather than enforcement. You send a request. The client receives it. Nothing compels them to complete it before the next step proceeds. So they delay — not out of malice, but because there are no consequences for delay. From their perspective, the project is moving forward regardless.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Consider how a bank account opening works. You cannot advance past the identity verification step without submitting your documents. The system does not send you reminders and wait. It stops until you comply. That is enforcement — and it works because it removes optionality from the process.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Your onboarding process likely does not work that way. It asks. It waits. It asks again. It waits again. That is the chasing loop, and it is structural.
                </p>
              </section>

              {/* Section 2 */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  The tracking trap: why seeing what&apos;s missing doesn&apos;t fix it
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Most teams respond to chronic onboarding delays by adding visibility tools. They build a spreadsheet tracker. They add a CRM pipeline stage. They use a project management board with a client intake column. They set up a checklist in Notion or Asana.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  These tools are tracking tools. They are very good at telling you what the situation is. They are completely incapable of changing it.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  A tracker tells you the intake form is 60% complete. It does not stop the client from submitting it as 100%. It does not prevent your team from proceeding to kickoff with a file that has gaps. It does not send increasingly firm reminders over a 72-hour window until every checkbox is ticked. It records. It does not act.
                </p>
                <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <table className="w-full min-w-[540px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
                    <thead>
                      <tr className="bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Tracking</th>
                        <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">Enforcement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Shows you what's missing", "Prevents the step from being skipped"],
                        ["Sends a reminder", "Blocks progress until completion"],
                        ["Relies on someone to act on the data", "Acts automatically"],
                        ["Depends on client compliance", "Removes the compliance decision"],
                        ["Surfaces risk after the fact", "Eliminates the risk in advance"],
                      ].map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 text-[var(--color-text-secondary)]">{row[0]}</td>
                          <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  The moment you adopt this frame, you stop asking "how do we track onboarding better?" and start asking "how do we make incomplete onboarding impossible?" Those are very different questions with very different solutions.
                </p>
              </section>

              {/* Section 3 */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What enforcement-first onboarding actually looks like
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Enforcement-first onboarding is built on required steps that gate progress. Instead of "please complete this form," the system presents step one, and step two does not appear until step one is genuinely done. The client cannot click &quot;Next&quot; with a blank field. They cannot mark a document as uploaded without uploading it. They cannot skip the signature and agree to come back to it.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  This sounds strict — and in the right sense, it is. But enforcement does not mean adversarial. The portal is still clean, calm, and branded to your business. The client experiences it as a structured process, not a wall. They know exactly where they are, what comes next, and what they need to do. Most clients find this clearer than a scattered intake email chain.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  For your team, the difference is immediate. When the portal enforces completion, nobody has to remember to check. Nobody has to send a follow-up. Nobody starts a kickoff call wondering if the missing file matters. The file is not missing — because it could not be missing.
                </p>
                <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-5">
                  <p className="text-sm font-semibold text-[var(--color-accent)]">The enforcement principle</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Required steps are not completed until the client has genuinely completed them. The system defines &quot;done&quot; — not the client&apos;s self-reporting, not a checkbox they can tick without action, not a follow-up email they can ignore.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  How automation handles follow-up without manual intervention
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Enforcement handles the &quot;cannot skip&quot; problem. Automation handles the &quot;has not started yet&quot; problem. Together they eliminate nearly all manual follow-up from onboarding.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  <Link href="/client-onboarding-automation" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">
                    Client onboarding automation
                  </Link>{" "}
                  triggers reminders based on inactivity — not on someone&apos;s calendar. When a client has not touched their onboarding portal in 48 hours, a reminder fires. When they are three days overdue on a required step, the next escalation fires. When they complete the intake, the system notifies your team and marks the client as kickoff-ready. Nobody has to monitor any of this.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  This is what makes <Link href="/client-onboarding-software" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">onboarding software for agencies</Link> and service teams qualitatively different from a project management tool with intake tasks. The PM tool shows you status. Purpose-built onboarding software acts on status automatically.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    { trigger: "Client sent portal link", action: "Automated welcome message fires" },
                    { trigger: "48 hours without activity", action: "First inactivity reminder fires" },
                    { trigger: "72 hours without activity", action: "Escalation reminder fires" },
                    { trigger: "Required step completed", action: "Next step unlocks; confirmation sent to client" },
                    { trigger: "All required steps done", action: "Team notified — client is kickoff-ready" },
                  ].map((row) => (
                    <div
                      key={row.trigger}
                      className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <span className="min-w-[200px] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{row.trigger}</span>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">→ {row.action}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5 */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Three practical steps to stop chasing clients starting this week
                </h2>
                <div className="mt-4 space-y-5">
                  {[
                    {
                      n: "1",
                      title: "Map every required step explicitly",
                      body: "Write down every piece of information, document, signature, or decision that must be in hand before your team can begin delivery. Not what you hope to have — what you need. This becomes your onboarding step list. Anything not on the list is optional. Everything on the list is required.",
                    },
                    {
                      n: "2",
                      title: "Move required steps into an enforced portal — not email",
                      body: "Email cannot enforce. A portal with required-step gates can. Move your intake to a system where each required step must be genuinely completed before the next one appears. Clients get one clear link, one clear sequence, and no way to partially complete something without the system knowing.",
                    },
                    {
                      n: "3",
                      title: "Automate follow-up from inactivity, not from a calendar",
                      body: "Set inactivity thresholds — 24 hours, 48 hours, 72 hours — and automate reminders against those. Stop sending reminders on a schedule you chose. Send them when a client hasn't moved, for as long as they haven't moved. When they complete the step, the reminders stop. When they finish the portal, your team gets notified automatically.",
                    },
                  ].map((item) => (
                    <div key={item.n} className="flex gap-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent)]">
                        {item.n}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{item.title}</p>
                        <p className="mt-1.5 text-sm leading-7 text-[var(--color-text-secondary)]">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 6 — agencies callout */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Why this matters most for agencies running multiple onboardings at once
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Individual contributors can absorb the cost of manual chasing. An agency running eight concurrent onboardings cannot. At that volume, one person spending two hours per client on follow-up means sixteen hours a week of pure administration — before any delivery work happens. That is two full working days, every week, on activity that adds no value to any client.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Enforcement-first <Link href="/agencies" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">onboarding software for agencies</Link> eliminates that entirely. The portal enforces. The automation follows up. The team gets a dashboard showing completion status across every active onboarding at once — not eight separate threads, not a spreadsheet someone needs to update manually.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  The same logic applies to{" "}
                  <Link href="/consultants" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">consultants</Link>,{" "}
                  <Link href="/accountants" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">accountants</Link>,{" "}
                  <Link href="/law-firm" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">law firms</Link>, and{" "}
                  <Link href="/financial-advisors" className="font-medium text-[var(--color-text-primary)] underline underline-offset-4">financial advisors</Link> — any team that runs a structured onboarding process repeatedly needs enforcement, not tracking, to stay out of the follow-up loop.
                </p>
              </section>

              {/* CTA */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent)] p-6 text-white shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Stop chasing. Start enforcing.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  ClientEnforce is client onboarding software built on enforcement, not tracking. Required steps are gated. Reminders run automatically. Your team sees completion status across every active onboarding — and nobody manually chases a single client.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                  >
                    Start free — live in 20 minutes
                  </Link>
                  <Link
                    href="/client-onboarding-software"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20"
                  >
                    See how enforcement works →
                  </Link>
                </div>
              </section>

              {/* FAQ */}
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Frequently asked questions
                </h2>
                <div className="mt-6 space-y-5">
                  {[
                    {
                      q: "Why do clients keep missing onboarding steps even when you remind them?",
                      a: "Because reminders are optional. Clients can read a reminder email and still not act. Enforcement means the onboarding portal does not advance until the step is complete — reminders become irrelevant because the system blocks progress, not just requests it.",
                    },
                    {
                      q: "What is the difference between onboarding tracking and onboarding enforcement?",
                      a: "Tracking shows you what is missing. Enforcement prevents clients from bypassing required steps. A tracking tool tells you the intake form is incomplete at the end of the week. An enforcement tool stops the client from submitting partial intake in the first place.",
                    },
                    {
                      q: "What is client onboarding automation?",
                      a: "Client onboarding automation is software that handles follow-up, reminders, and completion verification without manual intervention — so your team is not spending time chasing clients for documents, signatures, or form submissions.",
                    },
                    {
                      q: "How much time do agencies actually spend chasing clients during onboarding?",
                      a: "Teams typically spend 3–6 hours per client on manual follow-up during onboarding. At ten onboardings per month, that is a full working week of pure administration.",
                    },
                    {
                      q: "Can I automate onboarding without losing the personal touch?",
                      a: "Yes. Enforcement and automation handle the mechanical work. Your team's personal involvement is preserved for strategy sessions, kickoff calls, and proactive advice. Chasing is not personal touch.",
                    },
                  ].map((item) => (
                    <div key={item.q} className="border-t border-[var(--color-border)] pt-5 first:border-0 first:pt-0">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.q}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related */}
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related reading</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/client-onboarding-automation", label: "Client onboarding automation" },
                    { href: "/blog/why-client-onboarding-fails", label: "Why client onboarding fails" },
                    { href: "/blog/client-onboarding-guide", label: "Complete client onboarding guide" },
                    { href: "/agencies", label: "Onboarding software for agencies" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

            </article>
          </PageContainer>
        </section>

        <CtaBand
          heading="Your next onboarding shouldn&apos;t need a single follow-up email"
          subtext="Build your first enforcement-first onboarding template in under 20 minutes. No credit card required."
          primaryLabel="Start free trial"
          secondaryLabel="See features →"
          secondaryHref="/features"
        />

      </main>
      <PublicFooter />

      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: "How to stop chasing clients during onboarding", path: "/blog/how-to-stop-chasing-clients-during-onboarding" },
        ])}
      />
      <JsonLd
        data={buildBlogPostingSchema({
          title: "How to Stop Chasing Clients During Onboarding (And What to Do Instead)",
          description:
            "Client chasing during onboarding is a system problem, not a people problem. Here is why tracking tools don't solve it and what enforcement-first onboarding looks like instead.",
          path: "/blog/how-to-stop-chasing-clients-during-onboarding",
          publishedTime,
          modifiedTime,
          keywords: [
            "client onboarding automation",
            "onboarding software for agencies",
            "stop chasing clients",
            "client onboarding enforcement",
          ],
        })}
      />
      <JsonLd data={faqSchema} />
    </div>
  );
}
