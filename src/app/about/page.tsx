import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About client onboarding software | ClientEnforce",
  description:
    "See the founder story behind ClientEnforce, the client onboarding software built to replace inbox chaos with structured onboarding workflows.",
  path: "/about",
  keywords: [
    "client onboarding software",
    "client onboarding workflow",
    "client onboarding best practices",
    "onboarding software for agencies",
  ],
  type: "website",
});

function StoryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-700 sm:text-base">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">About ClientEnforce</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                We built client onboarding software because we were tired of chaotic project starts
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Before ClientEnforce, we ran service projects the same way most teams do: onboarding tasks lived across email threads, shared docs, and half-finished checklists. We were doing the work, but projects still started late because onboarding never felt fully complete.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Try ClientEnforce free
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Explore client onboarding software
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <StoryCard title="The problem we lived through firsthand">
                <p>
                  We kept seeing the same pattern. A new client signed, everyone felt momentum, then onboarding slowed everything down. Someone forgot one document. A signature sat pending. A key answer lived in a buried thread. The kickoff date moved even though the team looked busy.
                </p>
                <p>
                  The issue was not effort. The issue was process design. We were expecting people to complete a structured process in unstructured tools.
                </p>
              </StoryCard>

              <StoryCard title="What we tried before building ClientEnforce">
                <p>
                  We tried better spreadsheets, cleaner email templates, and reminders in project management tools. We even wrote SOPs with perfect checklists. Nothing solved the core problem because none of those systems actually enforced completion.
                </p>
                <p>
                  If one onboarding item was missing, work still moved forward and the team paid for it later in rework, misalignment, or client frustration.
                </p>
              </StoryCard>

              <StoryCard title="Why we built ClientEnforce">
                <p>
                  We built ClientEnforce to do one job extremely well: enforce onboarding completion before delivery starts. It gives your team one portal for intake, documents, signatures, and approvals, plus automated reminders and a clear audit trail.
                </p>
                <p>
                  This is not a broad CRM trying to do everything. It is focused <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">client onboarding software</Link> for teams that onboard clients repeatedly and need reliability.
                </p>
              </StoryCard>

              <StoryCard title="What we believe">
                <ol className="space-y-3 text-sm leading-7 text-zinc-800 sm:text-base">
                  <li>
                    <span className="font-semibold text-zinc-900">1. Onboarding is not admin.</span> It is the first real experience your client has of how your team works.
                  </li>
                  <li>
                    <span className="font-semibold text-zinc-900">2. Chasing people over email is a process failure.</span> Good systems remove the need for manual chasing.
                  </li>
                  <li>
                    <span className="font-semibold text-zinc-900">3. A clean start leads to a cleaner project.</span> Better intake quality means fewer delivery surprises.
                  </li>
                </ol>
              </StoryCard>

              <StoryCard title="Who this is built for">
                <p>
                  ClientEnforce is used by agencies, consultants, accountants, and ops-led service teams that need a repeatable onboarding workflow. If your team is evaluating <Link href="/client-onboarding-automation" className="font-medium text-zinc-900 underline underline-offset-4">client onboarding automation</Link> or a better <Link href="/client-onboarding-checklist" className="font-medium text-zinc-900 underline underline-offset-4">client onboarding checklist</Link>, start with the product and workflow pages below.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/features" className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-white">
                    client onboarding features
                  </Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-white">
                    client onboarding pricing
                  </Link>
                  <Link href="/dubsado-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-white">
                    Dubsado alternative
                  </Link>
                  <Link href="/honeybook-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-white">
                    HoneyBook alternative
                  </Link>
                </div>
              </StoryCard>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Want to see how ClientEnforce works?
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Try it free - no credit card needed.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Try ClientEnforce free
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    See how it works
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
