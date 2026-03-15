import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best HoneyBook Alternative for Agencies & Service Teams | ClientEnforce",
  description:
    "Need a HoneyBook alternative with deeper onboarding? ClientEnforce is purpose-built for teams who onboard clients at volume — enforced completion, audit trail, zero inbox chasing.",
  path: "/honeybook-alternative",
  keywords: [
    "HoneyBook alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for accountants",
    "client onboarding checklist",
  ],
  type: "website",
});

const comparisonRows = [
  ["Primary focus", "Full clientflow — leads, proposals, contracts, payments, projects", "Client onboarding execution only"],
  ["Best for", "Solo creative professionals and independent business owners", "Agencies, consultants, accountants — teams of 5–50"],
  ["Onboarding depth", "Part of broader client management flow", "Entire product built around onboarding completion"],
  ["Required step enforcement", "Flexible — clients can progress without completing everything", "Enforced — required steps must be completed"],
  ["Automated reminders", "Available", "Core feature — automated until tasks are done"],
  ["Audit trail", "Activity log", "Full timestamped evidence trail per client"],
  ["Compliance-ready export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Multi-client dashboard", "Project view per client", "Cross-portfolio completion view"],
  ["Client portal", "Yes — branded", "Yes — no client login required"],
  ["Invoicing and payments", "Yes — built in", "No — not a CRM"],
  ["AI features", "HoneyBook AI for lead capture and follow-up", "Automated completion enforcement"],
  ["Setup time", "Medium — requires configuration", "Under 20 minutes — first template live same day"],
] as const;

export default function HoneyBookAlternativePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <div className="text-xs text-zinc-600">
                <Link href="/" className="hover:underline hover:underline-offset-4">Home</Link>
                <span className="mx-1.5">&gt;</span>
                <span>Alternatives</span>
                <span className="mx-1.5">&gt;</span>
                <span className="font-medium text-zinc-800">HoneyBook Alternative</span>
              </div>

              <div className="mt-4 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Honest comparison
              </div>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                The HoneyBook alternative for teams that have outgrown freelancer tools
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                HoneyBook works beautifully for independent creatives managing their whole business in one place. But if you run a team, onboard multiple clients a month, and need structured intake with an audit trail — you need something built for that job specifically.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  See how it works
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">HoneyBook is excellent — for independent business owners</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  HoneyBook earned its loyal following by solving a real problem for solo creative professionals. Photographers, event planners, coaches, designers — people who need to manage enquiries, send proposals, collect contracts, take payments, and keep client comms organised, all without a dedicated ops person.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  For that user, HoneyBook is genuinely good. It has a clean interface, solid automation, and a growing AI feature set. It is one of the best tools in its category.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  The challenge comes when a team tries to use it as a structured onboarding system. HoneyBook's "clientflow" model is built around the solo operator managing one client relationship at a time. It was not designed for an operations manager tracking eight active onboardings simultaneously. It does not enforce required completion — a client can technically move forward without submitting everything. And there is no compliance-grade audit trail of what was submitted, when, and by whom.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  For agencies, consultancies, accounting firms, and ops-led service teams, those gaps matter.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Clientflow tool vs dedicated onboarding software — a practical comparison</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  HoneyBook positions itself as a clientflow platform — managing the full arc of a client relationship from first enquiry to final invoice. It does this well for its target user.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce makes no attempt to manage your full client lifecycle. It handles the onboarding phase — the structured, trackable, enforceable process that runs from a signed agreement to a kickoff-ready client. Every feature exists to serve that one outcome.
                </p>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[860px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold"></th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">HoneyBook</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-zinc-100 px-4 py-3 font-semibold text-zinc-900">{row[0]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[1]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Which tool is actually right for your situation?</h2>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">Choose HoneyBook if:</h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• You are an independent business owner or solo creative professional</li>
                  <li>• You need to manage leads, proposals, contracts, payments, and client comms in one place</li>
                  <li>• You are in photography, event planning, coaching, or a similar creative service</li>
                  <li>• Your client volume is low enough to manage individually</li>
                  <li>• You want AI-assisted lead capture and follow-up</li>
                </ul>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">Choose ClientEnforce if:</h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• You run a team — agency, consultancy, accounting firm, or ops-led service business</li>
                  <li>• You onboard three or more clients per month and the process needs to be consistent every time</li>
                  <li>• Clients regularly start projects before intake is complete and it causes problems</li>
                  <li>• You need a real audit trail — not an activity log — for compliance or accountability purposes</li>
                  <li>• Your account managers or ops team are still doing manual follow-up despite having software</li>
                  <li>• You want to separate your onboarding process from your CRM and manage it properly</li>
                </ul>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What structured onboarding actually looks like in ClientEnforce</h2>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">One template per service line</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Build a reusable onboarding template that defines exactly what every new client needs to complete — documents, signatures, information, approvals — before your team starts work. Build it once, use it every time.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">One portal link per client</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  When a client signs, send them a single portal link. They see their onboarding steps clearly. No login required. No confusion. No "where do I send this?"
                </p>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">Automated follow-up until it is done</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Clients receive automated reminders when tasks are overdue. Your team's dashboard shows completion status across every active onboarding at a glance. Work starts when intake is actually finished — not assumed to be.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">A full audit trail at the end</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Every document submitted, every step completed, every signature collected — timestamped and exportable. When a question comes up six months later about what was agreed at the start of a project, you have the evidence.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">If HoneyBook is not solving your onboarding problem, this will sound familiar</h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• Clients complete some of their onboarding steps but not all, and projects start with gaps</li>
                  <li>• Your team is still sending manual follow-up emails because the automations are not quite enforcing completion</li>
                  <li>• You cannot easily see which of your ten active clients are intake-complete and which are still missing something</li>
                  <li>• You work in a compliance-sensitive environment — accountancy, legal, financial services — and you need a proper record of what was collected and when</li>
                  <li>• Your onboarding relies on one person's knowledge of the process rather than a documented, enforced system</li>
                  <li>• New team members struggle to run onboarding consistently because the process is not codified anywhere</li>
                </ul>
                <p className="mt-4 text-sm leading-7 text-zinc-700 sm:text-base">
                  These are not problems HoneyBook was designed to solve. They are exactly the problems ClientEnforce was built for.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">A note for accountants, legal firms, and compliance-sensitive businesses</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you work in a regulated environment — accountancy, legal, financial services, HR consultancy — client onboarding is not just an operational task. It is a compliance requirement.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  AML checks, KYC documentation, engagement letters, proof of identity — these need to be collected correctly, stored securely, and traceable if a regulator or internal audit asks for them. An email thread and an activity log are not sufficient for that purpose.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce maintains a full timestamped audit trail of every step in the onboarding process. Every document received, every signature collected, every required step completed — with a date, time, and clear record of who submitted what. That record is exportable as a PDF evidence pack at any point.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  This is not a feature HoneyBook was built to provide. For teams with compliance obligations, it is not optional.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Built for the teams HoneyBook was not designed for</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  If you have outgrown freelancer tools and need client onboarding that enforces completion, scales across a team, and leaves a proper audit trail — try ClientEnforce.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Start free trial — no credit card needed
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    See full features →
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Related links</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding software
                  </Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding automation
                  </Link>
                  <Link href="/onboarding-for-accountants" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    onboarding software for accountants
                  </Link>
                  <Link href="/dubsado-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    Dubsado alternative
                  </Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding checklist
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
