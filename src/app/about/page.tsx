import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About | ClientEnforce – Why we built it",
  description:
    "Learn why ClientEnforce exists: to replace chaotic onboarding with structured workflows, document uploads, and signatures—so teams onboard clients faster and with fewer mistakes.",
  path: "/about",
  keywords: ["client onboarding software", "client onboarding workflow", "client onboarding process"],
  type: "website",
});

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-zinc-600">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-zinc-50">
        <section className="border-b border-zinc-200 bg-white">
          <Container>
            <div className="py-14">
              <p className="text-sm font-medium text-zinc-600">About</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Built to stop onboarding slipping through the cracks
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                ClientEnforce exists because client onboarding shouldn’t rely on memory, chasing emails,
                or hoping people upload the right files. We’re building a system that makes onboarding consistent,
                trackable, and easy for clients to finish.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Explore features
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
                >
                  Start free
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="py-12 space-y-4">
              <SectionCard title="The problem">
                <p>
                  Most onboarding breaks down in the same places: missing documents, unclear steps,
                  signatures delayed, and no visibility on what’s outstanding.
                  Teams lose hours to follow-ups, and clients get frustrated.
                </p>
              </SectionCard>

              <SectionCard title="Our approach">
                <p>
                  We keep the flow simple: a client portal, a structured checklist, document uploads,
                  and signatures—backed by an audit-friendly timeline.
                  It’s onboarding designed around completion.
                </p>
              </SectionCard>

              <SectionCard title="Who it’s for">
                <ul className="mt-3 list-disc pl-5">
                  <li>Agencies onboarding new retainers</li>
                  <li>Consultants and coaches collecting intake and agreements</li>
                  <li>Accountants requesting financial documents</li>
                  <li>Operations teams standardising client handovers</li>
                </ul>
              </SectionCard>

              <SectionCard title="How client onboarding automation works at ClientEnforce">
                <p>
                  We focus on one practical workflow: launch onboarding from a template, collect
                  required information in one portal, and automatically follow up when tasks are overdue.
                </p>
                <p className="mt-3">
                  This gives teams cleaner starts to delivery, fewer onboarding bottlenecks, and an
                  audit trail that can be reviewed when questions come up.
                </p>
              </SectionCard>

              <SectionCard title="Why onboarding software for businesses needs structure">
                <p>
                  Most teams do not fail onboarding because they lack effort. They fail because required
                  steps are not visible in one place. ClientEnforce is built to enforce a clear sequence
                  so client intake, approvals, and handoffs happen in the right order.
                </p>
                <p className="mt-3">
                  If you are comparing customer onboarding software, the key signal is how fast your team
                  can reach kickoff-ready status with complete information.
                </p>
                <p className="mt-3">
                  Explore the
                  {" "}
                  <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding software overview
                  </Link>
                  {" "}
                  or read the
                  {" "}
                  <Link href="/blog/client-onboarding-workflow" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding workflow guide
                  </Link>
                  {" "}
                  for implementation detail.
                </p>
              </SectionCard>

              <SectionCard title="How to evaluate fit for your team">
                <p>
                  Most teams evaluating onboarding software should compare workflow enforcement first, then
                  feature depth. The key question is whether your team can move clients from signed agreement
                  to kickoff-ready status with fewer delays and less manual coordination.
                </p>
                <p className="mt-3">
                  Start with the
                  {" "}
                  <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding software
                  </Link>
                  {" "}
                  page, then review
                  {" "}
                  <Link href="/features" className="font-medium text-zinc-900 underline underline-offset-4">
                    onboarding platform features
                  </Link>
                  {" "}
                  and
                  {" "}
                  <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                    pricing plans
                  </Link>
                  {" "}
                  to choose a practical rollout path.
                </p>
              </SectionCard>

              <SectionCard title="Why structured onboarding matters to growth and retention">
                <p>
                  Onboarding quality directly affects project outcomes. When teams start delivery without complete
                  context, timelines slip, scope confusion increases, and client confidence drops early in the relationship.
                </p>
                <p className="mt-3">
                  Structured onboarding creates predictable starts: required information is collected once, approvals are
                  visible, and handoffs happen with fewer blockers. This is one reason agencies and service businesses
                  prioritize
                  {" "}
                  <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding software
                  </Link>
                  {" "}
                  over fragmented tool stacks.
                </p>
                <p className="mt-3">
                  For deeper implementation context, review
                  {" "}
                  <Link href="/client-onboarding-automation" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding automation
                  </Link>
                  {" "}
                  and
                  {" "}
                  <Link href="/client-onboarding-tools" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding tools
                  </Link>
                  {" "}
                  to plan the right rollout model for your team.
                </p>
              </SectionCard>

              <SectionCard title="What adoption looks like in the first 30 days">
                <p>
                  Most teams succeed by starting small: one onboarding template, one service line, and one shared
                  completion standard. This keeps implementation practical while building confidence across account and operations teams.
                </p>
                <ul className="mt-3 list-disc pl-5">
                  <li>Week 1: Define required onboarding steps and ownership.</li>
                  <li>Week 2: Launch a template with client intake, files, and approvals in one flow.</li>
                  <li>Week 3: Enable reminder automation and monitor overdue tasks.</li>
                  <li>Week 4: Review cycle-time blockers and refine kickoff-readiness rules.</li>
                </ul>
                <p className="mt-3">
                  If you are comparing options before rollout, start with our
                  {" "}
                  <Link href="/dubsado-alternative" className="font-medium text-zinc-900 underline underline-offset-4">
                    Dubsado alternative
                  </Link>
                  {" "}
                  and
                  {" "}
                  <Link href="/honeybook-alternative" className="font-medium text-zinc-900 underline underline-offset-4">
                    HoneyBook alternative
                  </Link>
                  {" "}
                  pages, then map plan fit on
                  {" "}
                  <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                    pricing
                  </Link>
                  .
                </p>
              </SectionCard>

              <SectionCard title="What’s next">
                <p>
                  We’re focused on making ClientEnforce faster, clearer, and more automated—so onboarding
                  becomes a predictable system, not an ongoing task.
                </p>
                <p className="mt-3">
                  Want to see how it works?{" "}
                  <Link href="/features" className="font-medium text-zinc-900 underline underline-offset-4">
                    View the features
                  </Link>{" "}
                  or{" "}
                  <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                    check pricing
                  </Link>
                  .
                </p>
              </SectionCard>
            </div>
          </Container>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
