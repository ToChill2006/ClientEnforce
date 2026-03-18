import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About ClientEnforce | Why We Built It | Thomas Chillman",
  description:
    "ClientEnforce was built after watching service businesses lose clients in the first week - not because of bad work, but because of chaotic onboarding. Here is the story.",
  path: "/about",
  keywords: [
    "client onboarding software",
    "founder story",
    "client onboarding workflow",
    "onboarding software for agencies",
  ],
  type: "website",
});

function StorySection({
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
                Why we built ClientEnforce
              </h1>

              <div className="mt-4 max-w-3xl space-y-3 text-base leading-7 text-zinc-700">
                <p>
                  We ran a service business. Every deal felt clean at the start - proposal sent, contract signed, client excited. Then onboarding began, and that is where things fell apart.
                </p>
                <p>
                  Information came in pieces. Access in one email. Assets in another. Approvals somewhere else. Files missing. There was no single intake, no clear owner, no place to see what was complete. So we chased. Just following up. Still waiting on access. Friendly reminder. While we chased, kickoffs moved. Deadlines shifted. From the client&apos;s side, it looked like we were slow. In reality, we were blocked.
                </p>
                <p>
                  Trust started dropping before the real work even began. In some cases, relationships never fully recovered. In some cases, clients did not continue. That is when it became obvious: onboarding is not admin. It is the first proof of how your business runs. If the start feels messy, everything else will too.
                </p>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <StorySection title="What we tried first">
                <p>
                  We tried Dubsado. We tried HoneyBook. We tried ClickUp. We tried a shared Notion page. We tried a very elaborate spreadsheet. None of them solved the actual problem: nothing enforced completion. A client could receive a checklist and do nothing, and the only way to know was to manually check. The follow-up still landed on a person.
                </p>
                <p>
                  We needed something that would take the chase off our team completely - where the system nudged clients when tasks were overdue, where we could see completion status across every active onboarding at a glance, and where the end result was a documented, auditable record of what was collected and when. That tool did not exist. So we built it.
                </p>
              </StorySection>

              <StorySection title="What ClientEnforce does">
                <p>
                  ClientEnforce is client onboarding software built for agencies, consultants, accountants, and operations-led service teams. It replaces the email back-and-forth of new client intake with a single structured workflow: required documents, e-signatures, information collection, and automated follow-ups - in one client portal your clients actually complete.
                </p>
                <p>
                  It is not a CRM. It does not handle invoicing, proposals, or project management. It does one thing: gets clients through intake properly, every time, with a full audit trail from first step to kickoff-ready.
                </p>
              </StorySection>

              <StorySection title="What we believe">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">Onboarding is not admin - it is your first impression.</h3>
                    <p className="mt-1">
                      The way you run intake is the first signal to a client of how you run everything. A messy start sets the expectation that the rest of the project will feel the same.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">Chasing people over email is a process failure, not a client problem.</h3>
                    <p className="mt-1">
                      When clients stall on intake, the instinct is to blame them. The real problem is that there is no system enforcing completion. Fix the system, remove the chase.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">A clean start leads to a cleaner project.</h3>
                    <p className="mt-1">
                      Every project that begins with complete information, signed agreements, and clear expectations runs better. Not by accident - by design.
                    </p>
                  </div>
                </div>
              </StorySection>

              <StorySection title="Who is behind ClientEnforce">
                <p>
                  ClientEnforce was founded by Thomas Chillman. Before building ClientEnforce, Thomas ran a service business and experienced first-hand how broken client onboarding quietly damages client relationships - not through bad work, but through bad starts. ClientEnforce is the tool he wished had existed.
                </p>
              </StorySection>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Your next client deserves a better start</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Build your first onboarding template in under 20 minutes. No credit card needed.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Start free trial
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    See all features →
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
