import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Dubsado Alternative for Agencies & Consultants | ClientEnforce",
  description:
    "Looking for a Dubsado alternative built for teams, not just freelancers? ClientEnforce focuses entirely on client onboarding — structured workflows, enforced completion, full audit trail.",
  path: "/dubsado-alternative",
  keywords: [
    "Dubsado alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for agencies",
    "client onboarding checklist",
  ],
  type: "website",
});

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
                <span className="font-medium text-zinc-800">Dubsado Alternative</span>
              </div>

              <div className="mt-4 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Honest comparison
              </div>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                The Dubsado alternative built for agencies — not just freelancers
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Dubsado is a solid tool. But if you run an agency or a service team and your main pain is chaotic client onboarding, you need something more focused. ClientEnforce does one thing: gets clients through intake cleanly, every time.
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Dubsado is great — for the right person</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Dubsado built its reputation with solo freelancers and creative professionals. Photographers, designers, consultants running one-person businesses. For them, it works well: proposals, contracts, invoicing, scheduling, and basic client management all in one place.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  The problem starts when teams try to use it for structured, repeatable onboarding at volume. Dubsado was not designed for an agency account manager running eight client onboardings simultaneously. It was not built with compliance audit trails in mind. And the setup complexity — which is manageable for one person who configures it once — becomes a bottleneck when your ops team needs to run a consistent process across every new client.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  That is the gap ClientEnforce fills.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">CRM vs dedicated onboarding software — what actually changes</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Dubsado calls itself a business management platform. That is accurate. It does a lot of things reasonably well across the full client lifecycle.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce does not try to manage your full client lifecycle. It handles the onboarding phase only — from the moment a client signs to the moment your team is ready to start. That narrow focus means every feature is designed around one outcome: getting clients through intake without your team manually chasing them.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">Here is what that difference looks like in practice.</p>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[860px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold"></th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Dubsado</th>
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Honestly — which one is right for you?</h2>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">Choose Dubsado if:</h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• You are a solo freelancer or creative professional</li>
                  <li>• You need invoicing, payment processing, and proposals all in one place</li>
                  <li>• Your client volume is low and you manage most things yourself</li>
                  <li>• You want an all-in-one business management system</li>
                  <li>• You are in photography, event management, or a similar creative field</li>
                </ul>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">Choose ClientEnforce if:</h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• You run an agency or service team with multiple people involved in onboarding</li>
                  <li>• You onboard three or more clients per month and need a consistent, repeatable process</li>
                  <li>• Your main pain is chasing clients for documents, signatures, and approvals — not managing invoices</li>
                  <li>• You need visibility across multiple onboardings simultaneously</li>
                  <li>• You work in a compliance-sensitive environment and need an auditable intake trail</li>
                  <li>• You have tried using Dubsado for onboarding and found the setup too complex for what you actually need</li>
                </ul>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How ClientEnforce handles onboarding — in three steps</h2>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">1. Build a template for each service line</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Map your onboarding steps once. Define which documents are required, what needs signing, what information you need from the client, and in what order. Takes under 20 minutes.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">2. Send the client portal link when a new client signs</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  One link. The client sees exactly what they need to do, in order. No login required. No confusion about where to send things.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-zinc-900">3. Watch completion — your team stops chasing</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Clients get automated reminders when tasks are overdue. Your dashboard shows completion status across every active onboarding. Kickoff happens when intake is actually done.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">If you have outgrown Dubsado for onboarding, this probably sounds familiar</h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  <li>• You have customised Dubsado workflows extensively and they still do not enforce what clients actually need to do</li>
                  <li>• Your account managers are still sending follow-up emails manually because the automations are not quite right</li>
                  <li>• You cannot get a clear view of which clients are onboarding-complete and which are still missing information</li>
                  <li>• A client started a project before intake was finished and it caused problems</li>
                  <li>• You need a proper audit trail for compliance or contract reasons and Dubsado's activity log is not sufficient</li>
                </ul>
                <p className="mt-4 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce was built specifically for these situations. Not as a Dubsado replacement — as a purpose-built solution for the onboarding phase that Dubsado was never designed to own.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Ready to run onboarding properly?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Your next client deserves a cleaner start. Build your first onboarding template in under 20 minutes — no Dubsado migration needed.
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
                  <Link href="/onboarding-for-agencies" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    onboarding software for agencies
                  </Link>
                  <Link href="/honeybook-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    HoneyBook alternative
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
