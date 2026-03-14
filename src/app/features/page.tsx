import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildFaqPageSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Features | ClientEnforce – Client Onboarding Automation",
  description:
    "Explore ClientEnforce features: client portal, document uploads, e-signatures, onboarding workflows, reminders, and audit-ready tracking for a smoother onboarding process.",
  path: "/features",
  keywords: [
    "client onboarding features",
    "client onboarding software",
    "client onboarding workflow",
  ],
  type: "website",
});

const features = [
  {
    title: "Client portal that keeps onboarding moving",
    desc: "Give clients one place to upload files, complete required steps, and sign approvals. A single portal reduces confusion and keeps onboarding progress visible for both clients and internal teams.",
  },
  {
    title: "Document uploads (clear, tracked, and organised)",
    desc: "Request files with clear requirements and due dates, then track missing items without manual inbox follow-up. Every upload stays attached to the onboarding record for easier handoff and review.",
  },
  {
    title: "Signatures that feel effortless",
    desc: "Capture signatures directly inside the onboarding workflow so legal and approval steps do not become separate bottlenecks. This helps clients complete onboarding in fewer sessions.",
  },
  {
    title: "Step-by-step onboarding workflows",
    desc: "Turn your process into required-step workflows with clear ownership and completion criteria. Teams can see exactly what is done, what is blocked, and what is required before kickoff.",
  },
  {
    title: "Automated reminders",
    desc: "Automatically remind clients when deadlines are approaching or tasks are still incomplete. Automation removes repetitive coordination while keeping communication consistent.",
  },
  {
    title: "Audit-ready history",
    desc: "Track who submitted what and when with a clear onboarding timeline. This supports compliance needs, internal accountability, and post-onboarding process review.",
  },
];

const faqs = [
  {
    q: "Is ClientEnforce a client onboarding tool or a client portal?",
    a: "Both. It’s an onboarding system with a client-facing portal that guides uploads, signatures, and task completion in one place.",
  },
  {
    q: "What types of businesses use ClientEnforce?",
    a: "Any service business that collects documents and approvals—agencies, consultants, accountants, property services, and operations teams.",
  },
  {
    q: "Can I customise the onboarding steps?",
    a: "Yes. You can structure your workflow so each client completes the same required steps, reducing missed items.",
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-zinc-50">
        {/* Hero */}
        <section className="border-b border-zinc-200 bg-white">
          <Container>
            <div className="py-14">
              <p className="text-sm font-medium text-zinc-600">
                Features
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding, enforced.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                ClientEnforce turns messy client onboarding into a structured workflow.
                Collect documents, capture signatures, and track every step in one portal—so nothing gets missed.
                For teams evaluating a
                {" "}
                <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding platform
                </Link>
                , this is where to
                {" "}
                <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                  automate client onboarding
                </Link>
                {" "}
                with consistent workflow controls.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
                >
                  Start free
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Feature grid */}
        <section>
          <Container>
            <div className="py-12">
              <h2 className="text-2xl font-semibold text-zinc-900">
                Everything you need to onboard clients faster
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                Designed for real-world onboarding: uploads, signatures, steps, and tracking—without the clutter.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <Card key={f.title} title={f.title} desc={f.desc} />
                ))}
              </div>

              {/* SEO content block */}
              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Why teams choose ClientEnforce
                </h2>
                <div className="mt-4 grid gap-6 lg:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">Less chasing</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Replace long email chains with a portal that shows what’s missing and what’s completed.
                      If you are looking for a complete platform, explore our
                      {" "}
                      <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                        client onboarding software
                      </Link>
                      .
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">More consistency</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Every client follows the same steps. Your process becomes repeatable and reliable.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Audit-ready records</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Keep a clear history of uploads, signatures, and completion timestamps for compliance.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
                  >
                    Try ClientEnforce
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    Learn why teams switch to ClientEnforce
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">
                  How client onboarding automation works in practice
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Teams launch a standard onboarding template, assign required steps, and keep every
                  client in one trackable flow. When tasks are late, reminders run automatically so
                  delivery teams do not need to manually chase status.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">Step 1: Launch a workflow</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Start onboarding from reusable templates built for your client intake and handoff process.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Step 2: Collect requirements</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Clients upload documents, complete fields, and sign approvals in a single portal.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Step 3: Track completion</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Teams monitor progress, resolve blockers, and export audit-ready evidence when onboarding is complete.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/client-onboarding-software"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
                  >
                    Explore client onboarding software
                  </Link>
                  <Link
                    href="/client-onboarding-automation"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    See onboarding automation examples
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Compare alternatives and plan your rollout
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  If you are comparing onboarding software for agencies or service teams, review our
                  alternative pages and pricing breakdown to choose the right implementation path.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link
                    href="/dubsado-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Compare with Dubsado
                  </Link>
                  <Link
                    href="/honeybook-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Compare with HoneyBook
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Review client onboarding pricing
                  </Link>
                  <Link
                    href="/client-onboarding-software-for-agencies"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Onboarding software for agencies
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">
                  How these onboarding features improve delivery outcomes
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Good feature lists are not enough on their own. The important question is how each capability
                  changes daily execution for account managers, operations leads, and delivery teams.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  ClientEnforce is designed to reduce the most expensive onboarding problems: unclear ownership,
                  missing files at kickoff, and manual follow-up overhead. With one onboarding workflow and one
                  client portal, teams can move from contract to readiness with less rework.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  This structure is especially useful for onboarding software for businesses that handle
                  multiple service lines. Shared templates and stage-based tracking help teams keep quality
                  consistent even as account volume grows.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Faster kickoff readiness</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Required tasks, files, and approvals are visible in one flow so projects start with complete inputs.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Less manual coordination</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Automated reminders and status visibility reduce time spent chasing clients for updates.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Stronger process governance</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Audit-ready history gives teams a clear record of what was submitted, approved, and completed.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/client-onboarding-checklist"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Use the onboarding checklist framework
                  </Link>
                  <Link
                    href="/client-onboarding-tools"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Compare client onboarding tools
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">
                  How each team uses these features
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Strong onboarding outcomes come from role clarity. Account teams, operations, and delivery teams
                  use the same workflow data for different decisions, which is why shared visibility matters.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Account managers</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Use templates, portal status, and reminders to keep clients progressing through onboarding steps.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Operations teams</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Standardize workflows across services, monitor bottlenecks, and maintain governance for required tasks.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Delivery teams</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Validate kickoff readiness with complete files, approvals, and context before project execution starts.
                    </p>
                  </article>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/client-onboarding-process"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Review client onboarding process
                  </Link>
                  <Link
                    href="/client-onboarding-software-for-agencies"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Onboarding software for agencies
                  </Link>
                  <Link
                    href="/best-client-onboarding-software"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Compare best client onboarding software
                  </Link>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-zinc-900">FAQ</h2>
                <div className="mt-6 grid gap-4">
                  {faqs.map((item) => (
                    <div
                      key={item.q}
                      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                      <h3 className="font-semibold text-zinc-900">{item.q}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <PublicFooter />
      <JsonLd
        data={buildFaqPageSchema(
          faqs.map((item) => ({
            question: item.q,
            answer: item.a,
          })),
        )}
      />
    </>
  );
}
