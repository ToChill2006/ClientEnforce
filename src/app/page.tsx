import type { Metadata } from "next";
import Link from "next/link";

import { PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce | Client Onboarding Software and Automation",
  description:
    "Client onboarding software that automates onboarding workflows, intake forms, document collection, and progress tracking for agencies and service businesses.",
  path: "/",
  keywords: [
    "client onboarding software",
    "client onboarding automation",
    "client onboarding tools",
    "client onboarding workflow software",
    "client onboarding platform",
  ],
  type: "website",
});

const featureHighlights = [
  {
    title: "Client Intake Forms",
    description:
      "Capture project context, stakeholders, and requirements in structured forms that are easy for clients to complete.",
    icon: "form",
  },
  {
    title: "Automated Onboarding Tasks",
    description:
      "Trigger reminders and escalation steps automatically so onboarding does not stall in manual follow-up loops.",
    icon: "automation",
  },
  {
    title: "Document Collection",
    description:
      "Collect contracts, credentials, approvals, and files in one secure portal instead of scattered email threads.",
    icon: "files",
  },
  {
    title: "Client Onboarding Workflows",
    description:
      "Run a repeatable onboarding workflow software process from signed agreement to kickoff-ready handoff.",
    icon: "workflow",
  },
  {
    title: "Agency Onboarding Templates",
    description:
      "Standardize onboarding across account managers with templates that keep quality and communication consistent.",
    icon: "templates",
  },
  {
    title: "Progress Tracking",
    description:
      "See exactly what is complete, what is blocked, and who owns the next action for every onboarding.",
    icon: "progress",
  },
] as const;

const workflowSteps = [
  {
    step: "1",
    title: "Create onboarding workflow",
    description:
      "Start from a proven template or build your own client onboarding workflow for each service type.",
  },
  {
    step: "2",
    title: "Send onboarding forms to clients",
    description:
      "Share one secure client link so clients can complete forms, uploads, and approvals in one place.",
  },
  {
    step: "3",
    title: "Collect documents and information",
    description:
      "Gather required files, signatures, credentials, and answers without tool switching.",
  },
  {
    step: "4",
    title: "Track onboarding progress",
    description:
      "Monitor due dates, blocked tasks, and completion status across your full onboarding pipeline.",
  },
  {
    step: "5",
    title: "Deliver a consistent onboarding experience",
    description:
      "Hand off to delivery only when onboarding criteria are complete and validated.",
  },
] as const;

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M5.64 5.64 8.46 8.46" />
      <path d="m15.54 15.54 2.82 2.82" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m5.64 18.36 2.82-2.82" />
      <path d="m15.54 8.46 2.82-2.82" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 11l2 2 4-4" />
      <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19h16" />
      <path d="M6 15V9" />
      <path d="M12 15V5" />
      <path d="M18 15v-3" />
    </svg>
  );
}

function iconForFeature(name: (typeof featureHighlights)[number]["icon"]) {
  if (name === "form") return <FileIcon />;
  if (name === "automation") return <SparkIcon />;
  if (name === "files") return <ShieldIcon />;
  if (name === "workflow") return <LayersIcon />;
  if (name === "templates") return <ChecklistIcon />;
  return <ProgressIcon />;
}

function DashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Acme Onboarding</div>
            <div className="mt-1 text-xs text-zinc-600">Client portal • Workflow automation</div>
          </div>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
            In progress
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
            <span>Onboarding completion</span>
            <span>72%</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
            <div className="h-2 w-[72%] rounded-full bg-zinc-900" />
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-medium text-zinc-900">Forms completed</div>
            <div className="mt-1 text-sm text-zinc-700">8 of 10 required answers submitted.</div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-medium text-zinc-900">Documents collected</div>
            <div className="mt-1 text-sm text-zinc-700">Brand files and credentials uploaded.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">Automated next action</div>
          <div className="mt-1 text-sm text-zinc-700">
            Reminder scheduled for incomplete legal approval in 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-zinc-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-zinc-100/70 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
            Client onboarding automation for modern service teams
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Client Onboarding Software That Automates Your Entire Workflow
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg">
            Automate client onboarding, collect documents, manage tasks, and streamline onboarding workflows for agencies and service businesses.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-700 sm:text-base">
            ClientEnforce combines client onboarding software, client onboarding automation, and client onboarding tools in one platform so teams can launch faster with less admin.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Start Free
              <span className="ml-2">
                <ArrowRightIcon />
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
            >
              Book Demo
            </Link>
            <Link
              href="#workflow"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-transparent bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-7 grid gap-3 text-sm text-zinc-700 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">Automated reminders</div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">Checklist-driven workflows</div>
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">Ready-to-kickoff tracking</div>
          </div>
        </div>

        <div>
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const cards = [
    {
      title: "Streamline Client Onboarding",
      description:
        "Automate onboarding tasks, forms, and document collection in one place so clients complete requirements faster.",
      icon: <SparkIcon />,
    },
    {
      title: "Improve Client Experience",
      description:
        "Create a structured onboarding journey that keeps clients informed, reduces confusion, and builds confidence early.",
      icon: <ShieldIcon />,
    },
    {
      title: "Standardize Your Workflow",
      description:
        "Build repeatable onboarding systems that save time, reduce rework, and eliminate process chaos across teams.",
      icon: <LayersIcon />,
    },
  ] as const;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900">
                {card.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductExplanation() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Product explanation</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">How ClientEnforce Works</h2>

          <h3 className="mt-6 text-lg font-semibold text-zinc-900">Why onboarding workflows matter</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-700">
            When onboarding workflows are unclear, projects start late and teams lose delivery momentum. A clear system ensures required inputs are submitted before kickoff.
          </p>

          <h3 className="mt-5 text-lg font-semibold text-zinc-900">How automation improves onboarding</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-700">
            Client onboarding automation reduces manual reminder work, keeps tasks moving, and gives teams a live status view for every onboarding.
          </p>

          <h3 className="mt-5 text-lg font-semibold text-zinc-900">One platform for intake through handoff</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-700">
            Use ClientEnforce as your client onboarding workflow software to collect forms, request documents, track progress, and confirm readiness in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              client onboarding software
            </Link>
            <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              client onboarding automation
            </Link>
          </div>
        </div>

        <div>
          <DashboardPreview compact />
        </div>
      </div>
    </section>
  );
}

function FeatureHighlights() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Feature highlights</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">Core Product Capabilities</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">
            Every capability is designed to help teams run a repeatable, measurable client onboarding process with less friction.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureHighlights.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900">
                {iconForFeature(feature.icon)}
              </div>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{feature.description}</p>
              <div className="mt-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600">
                Workflow preview: enabled in onboarding template
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Trust</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
            Trusted by agencies and service businesses
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
            Built for teams that need clear onboarding execution, cleaner kickoff handoffs, and consistent client communication.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Agencies", "Consultants", "Freelancers", "Service businesses"].map((label) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-700">
              {label}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">Customer logo placeholder</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Add verified customer logo when approved.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">Testimonial placeholder</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Add real customer quote and attribution when available.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900">Review snippet placeholder</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Add verified review snippet with source when approved.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function WorkflowSteps() {
  return (
    <section id="workflow" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Onboarding workflow</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">How the process flows</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">
            A visual process flow for teams implementing client onboarding automation and workflow standardization.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {workflowSteps.map((item) => (
            <article key={item.step} className="relative rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                {item.step}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Differentiation</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
            Manual onboarding vs ClientEnforce
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">
            Compare a manual onboarding process with a structured client onboarding software system.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-left text-sm text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr>
                <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Capability</th>
                <th className="border-b border-zinc-200 px-4 py-3 font-semibold">Manual onboarding</th>
                <th className="border-b border-zinc-200 px-4 py-3 font-semibold">ClientEnforce</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Automation", "Manual reminders and follow-ups", "Automated reminder and escalation workflows"],
                ["Document collection", "Files split across inboxes and drives", "Centralized file and signature collection"],
                ["Task tracking", "Spreadsheet-based tracking", "Live onboarding status and owner visibility"],
                ["Client communication", "Ad hoc updates", "Structured onboarding communication flow"],
                ["Progress tracking", "Hard to audit and measure", "Clear stage-level completion tracking"],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-b border-zinc-100 px-4 py-3 font-medium text-zinc-900">{row[0]}</td>
                  <td className="border-b border-zinc-100 px-4 py-3">{row[1]}</td>
                  <td className="border-b border-zinc-100 px-4 py-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-10">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Start Automating Your Client Onboarding Today
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base">
            Replace spreadsheets and scattered tools with a streamlined onboarding system built for agencies and service businesses.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Start Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
            >
              Book Demo
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              client onboarding software
            </Link>
            <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              client onboarding automation
            </Link>
            <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              client onboarding checklist
            </Link>
            <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
              view pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PublicHeader />
      <main>
        <HeroSection />
        <FeatureCards />
        <ProductExplanation />
        <FeatureHighlights />
        <TrustSection />
        <WorkflowSteps />
        <ComparisonTable />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  );
}
