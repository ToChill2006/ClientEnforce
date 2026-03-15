import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client onboarding software | ClientEnforce",
  description:
    "Client onboarding software for agencies and service teams. Enforce completion, automate reminders, and start delivery with complete intake.",
  path: "/client-onboarding-software",
  keywords: [
    "client onboarding software",
    "best client onboarding tools",
    "client onboarding platform",
    "client onboarding automation",
    "onboarding software for agencies",
  ],
  type: "website",
});

const comparisonRows = [
  ["Document collection", "You cannot kick off confidently when files are scattered or missing.", "Yes"],
  ["E-signatures", "Signed agreements and approvals must be captured before delivery starts.", "Yes"],
  ["Automated reminders", "Manual follow-up drains account manager time and still misses deadlines.", "Yes"],
  ["Progress visibility", "Ops needs one view of what is complete, blocked, or overdue.", "Yes"],
  ["Audit trail", "Teams need evidence of what was submitted, when, and by whom.", "Yes"],
  ["Client portal", "Clients should complete onboarding in one clear destination.", "Yes"],
  ["Template library", "Repeatable templates keep onboarding quality consistent as volume grows.", "Yes"],
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is client onboarding software used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Client onboarding software is used to move clients from signed agreement to kickoff-ready using a structured workflow. It manages forms, files, signatures, reminders, and progress in one place.",
      },
    },
    {
      "@type": "Question",
      name: "How do I choose the best client onboarding tools for my team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose tools that enforce required steps, collect documents and signatures, automate follow-ups, and give your team visibility across every onboarding. Prioritize completion outcomes over long feature lists.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to implement client onboarding software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most teams can launch their first onboarding template in one day and refine it over the next few onboarding cycles. The fastest approach is to start with one service-line workflow and iterate from real usage.",
      },
    },
    {
      "@type": "Question",
      name: "Can client onboarding software work alongside project management tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Client onboarding software handles the pre-kickoff phase, while project management tools handle delivery. Together they reduce rework by making sure kickoff starts with complete intake.",
      },
    },
    {
      "@type": "Question",
      name: "Is ClientEnforce better for teams than all-in-one CRM tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For teams focused on onboarding execution, ClientEnforce is often a better fit because it is purpose-built for completion enforcement, intake quality, and audit trails rather than broad CRM functionality.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/client-onboarding-software",
  description:
    "Client onboarding software for agencies and service businesses that helps automate onboarding workflows, collect client information, and standardize new client setup.",
};

export default function ClientOnboardingSoftwarePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Client onboarding software</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding software for teams that want projects to start clean
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                If your team keeps chasing documents, signatures, and intake answers over email, you do not have an effort problem. You have a workflow problem. Client onboarding software gives you one structured process from signed agreement to kickoff-ready so your team can stop guessing and start delivery with complete information.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start onboarding clients properly
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
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  What client onboarding software actually solves
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Client onboarding software gives your team a single place to enforce intake requirements. Instead of asking account managers to remember who is missing what, the system handles required steps, reminders, and completion visibility automatically.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  That means fewer delayed kickoffs, fewer scope surprises, and a stronger client experience from day one.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">
                    client onboarding automation
                  </Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">
                    client onboarding checklist
                  </Link>
                  <Link href="/onboarding-for-agencies" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">
                    onboarding software for agencies
                  </Link>
                  <Link href="/dubsado-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">
                    Dubsado alternative
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  What makes a good client onboarding platform?
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Most buyers compare features, but the real question is simpler: does this system enforce completion well enough to protect kickoff quality? Use this table when comparing the best client onboarding tools.
                </p>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[720px] bg-white text-left text-sm text-zinc-700">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-900">
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Feature</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Why it matters</th>
                        <th className="border-b border-zinc-200 px-4 py-3 font-semibold">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row[0]}>
                          <td className="border-b border-zinc-100 px-4 py-3 font-medium text-zinc-900">{row[0]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[1]}</td>
                          <td className="border-b border-zinc-100 px-4 py-3">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  How to roll out client onboarding software in your team
                </h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">1. Map your current intake steps</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      List every required item from contract to kickoff. Include forms, files, signatures, and approvals.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">2. Build one baseline template</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Start with one service line first. Keep required steps explicit so completion is objective, not subjective.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">3. Automate follow-up rules</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Trigger reminders for overdue tasks so your team stops manually chasing every missing item.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">4. Review and tighten every month</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Track where clients stall, then simplify unclear steps and tighten ownership where handoffs break.
                    </p>
                  </li>
                </ol>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    ["What is client onboarding software?", "It is software that enforces onboarding completion before project kickoff by managing forms, documents, signatures, reminders, and progress in one workflow."],
                    ["Is this just another CRM?", "No. ClientEnforce is focused specifically on onboarding execution, not broad CRM management."],
                    ["Can agencies use this across multiple service lines?", "Yes. Most teams build one template per service line and run all clients through the right onboarding workflow."],
                    ["How quickly can we launch?", "Most teams can launch their first template in under a day and improve it during the first month."],
                    ["What should we read next?", "Review client onboarding automation, the client onboarding checklist guide, and the Dubsado alternative page before rollout."],
                  ].map(([question, answer]) => (
                    <article key={question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-semibold text-zinc-900">{question}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{answer}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Ready to enforce onboarding completion?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Build your first onboarding template and start projects with complete intake.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                    Try ClientEnforce free
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">
                    View pricing for onboarding teams
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
    </div>
  );
}
