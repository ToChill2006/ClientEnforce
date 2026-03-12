import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/marketing/public-shell";
import { buildFaqPageSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce | Client Onboarding Software and Automation",
  description:
    "ClientEnforce is client onboarding software for document collection, signatures, follow-ups, templates, and progress tracking in one secure client portal.",
  path: "/",
  keywords: [
    "client onboarding software",
    "client onboarding platform",
    "client onboarding automation",
    "client onboarding process",
    "best client onboarding tools",
  ],
  type: "website",
});

const homeFaqItems = [
  {
    question: "What is ClientEnforce?",
    answer:
      "ClientEnforce is client onboarding software that combines intake steps, document collection, signatures, reminders, and progress tracking in one workflow.",
  },
  {
    question: "Who is ClientEnforce for?",
    answer:
      "ClientEnforce is built for agencies, consultants, accountants, and service teams that want a repeatable onboarding workflow instead of manual email follow-ups.",
  },
  {
    question: "How does client onboarding automation work in ClientEnforce?",
    answer:
      "You launch onboarding from a template, clients complete required tasks in one portal, and automated follow-ups run when deadlines are missed or steps are incomplete.",
  },
  {
    question: "Can ClientEnforce replace separate tools for intake and onboarding?",
    answer:
      "Yes. Teams use ClientEnforce as an onboarding automation platform to manage client intake, approvals, document uploads, and completion tracking together.",
  },
] as const;

function CheckIcon() {
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

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

function ZapIcon() {
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
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
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

function TimelineIcon() {
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
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-zinc-700 sm:text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900">
          {icon}
        </div>
        <div className="text-sm font-semibold tracking-tight text-zinc-900">{title}</div>
      </div>
      <div className="mt-3 text-sm leading-6 text-zinc-700">{desc}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-700 shadow-sm sm:text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
      {children}
    </span>
  );
}

function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" priority />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
            ClientEnforce
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
          <a href="#features" className="hover:text-zinc-900">Features</a>
          <a href="#how" className="hover:text-zinc-900">How it works</a>
          <a href="#security" className="hover:text-zinc-900">Security</a>
          <a href="#pricing" className="hover:text-zinc-900">Pricing</a>
          <Link href="/contact" className="hover:text-zinc-900">Contact</Link>
          <details className="group relative">
            <summary className="list-none cursor-pointer select-none hover:text-zinc-900">
              <span className="inline-flex items-center gap-1">
                Resources
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-zinc-500 transition group-open:rotate-180"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition group-open:visible group-open:opacity-100">
              <Link
                href="/client-onboarding-software"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding software
              </Link>
              <Link
                href="/client-onboarding-checklist"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding checklist
              </Link>
              <Link
                href="/client-onboarding-automation"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding automation
              </Link>
              <Link
                href="/client-onboarding-tools"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Best client onboarding tools
              </Link>
              <Link
                href="/blog"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Blog and guides
              </Link>
              <a
                href="#resources"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Homepage resources section
              </a>
            </div>
          </details>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 sm:inline-flex md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 sm:px-4"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav />

      {/* Hero */}
      <section className="relative isolation-isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-zinc-100/70 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-zinc-100/70 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-18">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-700 sm:hidden">
                Trusted for client onboarding workflows
              </div>
              <div className="mt-3 hidden flex-wrap items-center gap-2 sm:flex">
                <Pill>Purpose-built for client onboarding</Pill>
                <Pill>Files • Signatures • Timeline</Pill>
              </div>

              <h1 className="mt-5 max-w-2xl text-[2.15rem] font-semibold leading-tight tracking-tight text-zinc-900 sm:mt-6 sm:text-5xl sm:leading-tight">
                Client onboarding that clients actually complete.
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-800 sm:text-lg">
                Replace chaotic email chains with one secure flow for uploads, signatures, progress tracking, reminders, and a complete audit trail.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-700 sm:text-base">
                ClientEnforce is onboarding software for businesses that want a repeatable client onboarding workflow
                without extra admin overhead. It is built for agencies, consultants, and operations-led teams.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free
                  <span className="ml-2">
                    <ArrowRightIcon />
                  </span>
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                >
                  See plans
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
                  <span className="text-zinc-900">
                    <CheckIcon />
                  </span>
                  Secure client links
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
                  <span className="text-zinc-900">
                    <CheckIcon />
                  </span>
                  Automated reminders
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
                  <span className="text-zinc-900">
                    <CheckIcon />
                  </span>
                  Full activity trail
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3">
                <Stat label="Fewer chase emails" value="-60%" />
                <Stat label="Faster completion" value="2×" />
                <Stat label="Proof on demand" value="Always" />
              </div>
            </div>

            {/* Mock / Preview */}
            <div className="relative isolate lg:pl-4">
              <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-900">Acme Onboarding</div>
                      <div className="mt-1 text-xs text-zinc-600">Client portal • Secure link</div>
                    </div>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                      In progress
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-700 sm:hidden">
                    <span>Completion tracking</span>
                    <span className="font-semibold text-zinc-900">Live</span>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                            Required
                          </div>
                          <div className="mt-2 text-sm font-medium text-zinc-900">Upload contract</div>
                          <div className="mt-1 text-sm text-zinc-700">
                            Collect signed docs without chasing emails.
                          </div>
                        </div>
                        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700">
                          2/3
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-zinc-100">
                        <div className="h-2 w-2/3 rounded-full bg-zinc-900" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                          <ZapIcon /> Follow-ups
                        </div>
                        <div className="mt-1 text-sm text-zinc-700">Automatically scheduled.</div>
                      </div>
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                          <ShieldIcon /> Audit trail
                        </div>
                        <div className="mt-1 text-sm text-zinc-700">Who did what, when.</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-zinc-900">Timeline</div>
                        <span className="text-xs text-zinc-600">Live</span>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-zinc-700">
                        <div className="flex items-center justify-between">
                          <span>Link opened</span>
                          <span className="text-xs text-zinc-600">2m ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Answer saved</span>
                          <span className="text-xs text-zinc-600">1m ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>File uploaded</span>
                          <span className="text-xs text-zinc-600">Just now</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                        <FileIcon /> Evidence pack
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        Download everything as a clean PDF.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-24 -top-16 -z-10 h-56 w-56 rounded-full bg-zinc-100/60 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 -z-10 h-56 w-56 rounded-full bg-zinc-100/60 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Built for modern service businesses
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-zinc-600 sm:grid-cols-4">
            {[
              "Agencies",
              "Consultancies",
              "Accountants",
              "Compliance teams",
            ].map((t) => (
              <div key={t} className="rounded-xl border border-zinc-200 bg-zinc-50 py-3">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Features</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                Everything you need to ship onboarding fast.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                Standardize intake, reduce churn, and keep the whole team aligned — without
                spreadsheets, inbox archaeology, or guessing what’s missing.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900">
                  <TimelineIcon />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Audit-ready by default</div>
                  <div className="mt-1 text-sm text-zinc-700">
                    Every action becomes an event you can export: opens, uploads, signatures,
                    submissions, and admin updates.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ZapIcon />}
              title="Templates & reuse"
              desc="Build once, run forever. Templates keep every onboarding consistent and professional."
            />
            <FeatureCard
              icon={<ShieldIcon />}
              title="Secure client links"
              desc="Send a tokenized portal link so clients can complete requirements without accounts."
            />
            <FeatureCard
              icon={<FileIcon />}
              title="Files & signatures"
              desc="Collect documents, signatures, and evidence packs in the same workflow."
            />
            <FeatureCard
              icon={<TimelineIcon />}
              title="Activity & timeline"
              desc="Always know who did what, when — perfect for internal review and compliance."
            />
            <FeatureCard
              icon={<ZapIcon />}
              title="Follow-ups & automation"
              desc="Automatically track what’s due and nudge clients without manual chasing."
            />
            <FeatureCard
              icon={<ShieldIcon />}
              title="Team-ready"
              desc="Invite teammates, keep roles clean, and stay aligned across onboarding work."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">How it works</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                From template to completion in minutes.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                A simple workflow that scales with your volume.
              </p>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-zinc-900">Best practice</div>
                <div className="mt-2 text-sm text-zinc-600">
                  Keep requirements short and required. Your completion rate will thank you.
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid gap-6 sm:grid-cols-3">
                {[ 
                  {
                    step: "Step 1",
                    title: "Choose a template",
                    desc: "Start from a standard intake or your own custom template.",
                  },
                  {
                    step: "Step 2",
                    title: "Send the link",
                    desc: "Clients upload, sign, and answer questions in one place.",
                  },
                  {
                    step: "Step 3",
                    title: "Track & export",
                    desc: "See what’s missing and export an evidence pack when complete.",
                  },
                ].map((s) => (
                  <div key={s.step} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{s.step}</div>
                    <div className="mt-2 text-sm font-semibold text-zinc-900">{s.title}</div>
                    <div className="mt-2 text-sm text-zinc-700">{s.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Ready to stop chasing?</div>
                    <div className="mt-1 text-sm text-zinc-700">
                      Launch a clean onboarding flow with ClientEnforce.
                    </div>
                  </div>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                  >
                    Start free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding SEO content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Client Onboarding Software for Agencies and Service Businesses
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-700 sm:text-base">
              Slow onboarding usually comes from unclear requirements, disconnected tools, and too many manual
              follow-ups. ClientEnforce helps teams run one structured onboarding workflow so clients know what
              to complete, account teams can see what is missing, and delivery can start with full context.
              Instead of relying on inbox threads or spreadsheet checklists, teams can standardize intake,
              automate reminders, and track completion in one place.
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700 sm:text-base">
              If you are evaluating options, start with the
              {" "}
              <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                client onboarding software page
              </Link>
              {" "}
              and the
              {" "}
              <Link href="/client-onboarding-automation" className="font-medium text-zinc-900 underline underline-offset-4">
                client onboarding automation guide
              </Link>
              {" "}
              to map your rollout. If you need a full
              {" "}
              <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                client onboarding platform
              </Link>
              , this page also shows how to
              {" "}
              <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                automate client onboarding
              </Link>
              {" "}
              in one system.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
              How ClientEnforce Automates Client Onboarding
            </h2>
            <ul className="mt-4 space-y-2 rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-800">
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>Automated workflows that move clients through required onboarding stages.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>Onboarding checklists that enforce consistent completion before kickoff.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>Document collection and signatures in one secure client portal.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                <span>Client intake forms that reduce missing details and rework.</span>
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900">
              Who ClientEnforce Is For
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-zinc-800 sm:grid-cols-2">
              {[
                "Marketing agencies",
                "Consultants",
                "Freelancers",
                "Service businesses",
              ].map((audience) => (
                <li key={audience} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  {audience}
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/client-onboarding-software"
                className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                client onboarding software
              </Link>
              <Link
                href="/client-onboarding-automation"
                className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                client onboarding automation
              </Link>
              <Link
                href="/client-onboarding-checklist"
                className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                client onboarding checklist
              </Link>
              <Link
                href="/pricing"
                className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                client onboarding pricing
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                A Practical Client Onboarding Workflow Playbook
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-700 sm:text-base">
                Strong onboarding performance comes from operational clarity, not from adding more tools.
                Teams that complete onboarding quickly usually define scope early, collect the right documents
                once, and keep clients moving with clear next actions. When those basics are missing, project
                delays start before work even begins. ClientEnforce gives teams one operational system to run
                intake, approvals, uploads, signatures, and follow-ups in the same workflow.
              </p>

              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                1. Confirm scope before kickoff
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Define exactly what the client must submit before delivery starts. This can include project
                goals, access credentials, legal documents, stakeholder contacts, and required approvals.
                Setting requirements at the start avoids confusion later and reduces rework for delivery teams.
                A structured
                {" "}
                <Link href="/client-onboarding-checklist" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding checklist
                </Link>
                {" "}
                helps teams standardize this step across every account.
              </p>

              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                2. Collect documents and answers in one place
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Fragmented collection creates unnecessary delays. Instead of asking clients to upload files in
                one app, sign in another, and answer questions over email, route everything through one portal.
                This reduces missed requirements and gives account managers a clear status view for every step.
                A centralized
                {" "}
                <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding software
                </Link>
                {" "}
                workflow keeps the process predictable for both teams and clients.
              </p>

              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                3. Use reminders to keep momentum
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Onboarding stalls when deadlines rely on manual follow-up. Build reminder rules that trigger
                automatically when tasks are overdue or incomplete. This keeps clients progressing without
                constant check-ins from your team. If your current process depends on ad hoc emails, start with
                a focused
                {" "}
                <Link href="/client-onboarding-automation" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding automation
                </Link>
                {" "}
                rollout and expand from there.
              </p>

              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                4. Hand off cleanly from onboarding to delivery
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                A complete onboarding flow should produce a clear handoff package: submitted answers, uploaded
                files, signatures, and a timeline of completed actions. Delivery teams can start work faster
                when they do not need to reconstruct context from scattered messages. Clear completion criteria
                also improve client trust because kickoff happens with fewer surprises.
              </p>

              <p className="mt-6 text-sm leading-7 text-zinc-700 sm:text-base">
                For a full walkthrough, explore our
                {" "}
                <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding software
                </Link>
                {" "}
                page, review the
                {" "}
                <Link href="/client-onboarding-automation" className="font-medium text-zinc-900 underline underline-offset-4">
                  onboarding automation
                </Link>
                {" "}
                implementation guide, and compare plan fit on
                {" "}
                <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                  pricing
                </Link>
                .
              </p>

              <h3 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900">
                How different teams use this workflow
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Marketing agencies usually run onboarding across several stakeholders, which means requirements
                often arrive out of order. A structured workflow helps agencies collect brand assets, access
                permissions, legal approvals, and campaign goals without repeatedly asking for updates. It also
                gives account managers a clear client status before handoff to production teams. If your agency
                currently relies on email threads and manual reminders, standardizing intake steps is usually
                the fastest operational win.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                Consultants and advisory teams often need complete discovery inputs before they can deliver
                strategic recommendations. A clear onboarding flow ensures statements of work, diagnostic forms,
                stakeholder context, and supporting files are submitted before kickoff calls. This reduces
                meetings spent on missing context and improves time-to-value for clients. When teams can trust
                onboarding quality, they spend more time delivering outcomes and less time chasing preparation.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                Freelancers and small service teams benefit from having one repeatable system that works across
                every client type. Instead of rebuilding the onboarding process for each project, they can reuse
                templates, keep expectations consistent, and protect project margins. Repeatable onboarding also
                creates a better client experience because next steps are clear from day one. That consistency
                matters when smaller teams are balancing sales, delivery, and account communication at the same time.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                Operations and compliance-led businesses use onboarding workflows to document exactly what was
                requested, what was submitted, and when each step was completed. Centralized records reduce risk
                in audits and simplify internal review, especially when several team members touch one account
                before delivery starts. A complete onboarding timeline gives leadership better visibility into
                process quality and helps identify where clients are most likely to stall.
              </p>

              <h3 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900">
                Metrics to track when you automate client onboarding
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Teams usually see the strongest results when they track operational metrics each week and use
                those signals to improve templates. Start with completion rate, average time-to-completion,
                overdue requirement count, and handoff readiness at kickoff. These four metrics reveal whether
                clients understand what to do, whether reminders are effective, and whether your intake
                requirements are realistic. As your process matures, you can also monitor rework rate after
                kickoff and the number of projects delayed by missing onboarding inputs.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-800">
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>
                    <span className="font-medium text-zinc-900">Completion rate:</span>
                    {" "}
                    percentage of onboardings finished by the expected deadline.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>
                    <span className="font-medium text-zinc-900">Time-to-completion:</span>
                    {" "}
                    how long clients take from link open to full submission.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>
                    <span className="font-medium text-zinc-900">Overdue tasks:</span>
                    {" "}
                    open requirements that need reminders or process simplification.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>
                    <span className="font-medium text-zinc-900">Kickoff readiness:</span>
                    {" "}
                    share of projects that start with complete onboarding data.
                  </span>
                </li>
              </ul>

              <p className="mt-6 text-sm leading-7 text-zinc-700 sm:text-base">
                If you are implementing this process now, start with a single high-volume service and refine
                your onboarding template for two to four weeks before expanding. You can also compare practical
                options in our
                {" "}
                <Link href="/client-onboarding-tools" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding tools
                </Link>
                {" "}
                guide and review requirements planning in the
                {" "}
                <Link href="/client-onboarding-checklist" className="font-medium text-zinc-900 underline underline-offset-4">
                  client onboarding checklist
                </Link>
                {" "}
                resource.
              </p>

              <h3 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900">
                Common onboarding automation questions
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                Teams evaluating onboarding systems usually ask the same operational questions before rollout.
                The answers below reflect how most service businesses implement onboarding automation without
                disrupting delivery operations.
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <h4 className="text-base font-semibold text-zinc-900">
                    How long does onboarding setup usually take?
                  </h4>
                  <p className="mt-1 text-sm leading-7 text-zinc-700 sm:text-base">
                    Most teams can launch an initial workflow quickly by starting with one core service template
                    and a clear definition of required inputs. The fastest implementations avoid overbuilding
                    and focus on a short list of required questions, uploads, and approvals. Once the first
                    workflow is stable, additional templates can be added for other service lines.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-zinc-900">
                    Should every client follow the same onboarding flow?
                  </h4>
                  <p className="mt-1 text-sm leading-7 text-zinc-700 sm:text-base">
                    The core process should stay consistent, but templates can still adapt to service type,
                    contract scope, or client segment. A shared structure makes reporting and handoff easier,
                    while template-level variations keep requirements relevant. This balance helps teams stay
                    standardized without forcing one rigid process for every engagement.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-zinc-900">
                    What should be required before kickoff?
                  </h4>
                  <p className="mt-1 text-sm leading-7 text-zinc-700 sm:text-base">
                    Required items should cover anything that blocks delivery if missing: project objectives,
                    stakeholder contacts, approvals, key files, access credentials, and signed documents.
                    Optional fields are helpful for context, but mandatory requirements should stay focused so
                    clients can complete onboarding quickly. Keeping this list practical improves completion
                    rates and reduces kickoff delays.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-zinc-900">
                    How do teams reduce client drop-off during onboarding?
                  </h4>
                  <p className="mt-1 text-sm leading-7 text-zinc-700 sm:text-base">
                    Drop-off usually decreases when onboarding is simple, time-bounded, and clearly sequenced.
                    Teams see better results when clients can complete everything in one portal, receive clear
                    due dates, and get automated reminders before deadlines pass. Reducing unnecessary fields
                    and making required tasks explicit also improves completion consistency across accounts.
                  </p>
                </div>
              </div>

              <h3 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900">
                30-day rollout checklist
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                If you want to launch quickly without overcomplicating implementation, run a short 30-day
                rollout. Week 1: define required onboarding inputs and publish one template. Week 2: send new
                clients through the process and monitor completion bottlenecks. Week 3: tighten reminder timing
                and remove questions that do not affect delivery decisions. Week 4: review completion metrics,
                finalize handoff criteria, and expand to additional service lines. This phased approach keeps
                adoption practical and gives teams enough feedback to improve onboarding quality before scaling.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-800">
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>Start with one high-volume service, not every service at once.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>Keep required steps focused on information that blocks kickoff if missing.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>Use reminders to reduce manual follow-up workload for account teams.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                  <span>Require a complete handoff package before delivery teams begin execution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Security</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                Built with security in mind.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                Keep onboarding data tidy, permissioned, and auditable.
              </p>

              <div className="mt-6 space-y-4">
                {[ 
                  {
                    title: "Secure client links",
                    desc: "Tokenized links per onboarding designed for low-friction access.",
                  },
                  {
                    title: "Audit timeline",
                    desc: "A clear record of events: opens, uploads, signatures, completions.",
                  },
                  {
                    title: "Export evidence packs",
                    desc: "Generate a PDF pack for internal review and client records.",
                  },
                ].map((x) => (
                  <div key={x.title} className="flex items-start gap-3">
                    <span className="mt-0.5 text-zinc-900">
                      <CheckIcon />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{x.title}</div>
                      <div className="mt-1 text-sm text-zinc-700">{x.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
              <div className="text-sm font-semibold text-zinc-900">Security checklist</div>
              <div className="mt-4 grid gap-3">
                {[
                  "Client portal per onboarding",
                  "Files & signature capture",
                  "Status lifecycle tracking",
                  "Evidence pack export",
                  "Minimal, permissioned access patterns",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="text-zinc-900">
                      <CheckIcon />
                    </span>
                    <span className="text-sm text-zinc-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Pricing</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
              Simple plans that scale.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Start with the essentials, then unlock automation and team scale as your onboarding volume grows.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {/* Starter */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">Starter</div>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                  Free
                </span>
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">£0</div>
              <div className="mt-2 text-sm text-zinc-700">For testing the flow and onboarding a few clients.</div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-800">
                {[
                  "1 admin user",
                  "1 onboarding template",
                  "Client portal link per onboarding",
                  "Document uploads + signatures",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 text-zinc-900">
                      <CheckIcon />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-3xl border border-zinc-900 bg-white p-6 sm:p-8 shadow-sm">
              <div className="absolute right-6 top-6 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
                Most popular
              </div>
              <div className="text-sm font-semibold text-zinc-900">Pro</div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                £29<span className="text-base font-medium text-zinc-700">/mo</span>
              </div>
              <div className="mt-2 text-sm text-zinc-700">For solo operators + small teams who want automation.</div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-800">
                {[
                  "Up to 5 admin users",
                  "Up to 10 templates",
                  "Automated reminders (email)",
                  "Audit timeline",
                  "Evidence pack export",
                  "Up to 50 active onboardings",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 text-zinc-900">
                      <CheckIcon />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
              >
                Start Pro
              </Link>
            </div>

            {/* Business */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">Business</div>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                  Scale
                </span>
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                £89<span className="text-base font-medium text-zinc-700">/mo</span>
              </div>
              <div className="mt-2 text-sm text-zinc-700">For teams onboarding clients at volume.</div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-800">
                {[
                  "Up to 15 admin users",
                  "Unlimited templates",
                  "Everything in Pro",
                  "Advanced reporting (coming soon)",
                  "Priority support",
                  "Up to 200 active onboardings",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 text-zinc-900">
                      <CheckIcon />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                Upgrade to Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Resources</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                Learn the client onboarding playbook.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
                Explore practical guides for client onboarding software, client onboarding checklist
                design, client onboarding automation, and best client onboarding tools.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Start here</div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-700">
                <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Client onboarding software
                </Link>
                <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Client onboarding checklist
                </Link>
                <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Client onboarding automation
                </Link>
                <Link href="/client-onboarding-tools" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Best client onboarding tools
                </Link>
                <Link href="/features" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Client onboarding platform features
                </Link>
                <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                  Client onboarding software pricing
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">What ClientEnforce is</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                ClientEnforce is client intake and onboarding software that unifies steps, approvals,
                and client communication in one onboarding automation platform.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">Who it is for</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                It is built for agencies, consultants, accountants, and service operators that want
                predictable onboarding workflows and fewer delivery delays.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">How automation works</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Launch a template, assign required tasks, and let automated follow-ups run when clients
                miss steps so your team can focus on delivery instead of chasing updates.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/blog"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Blog hub</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Practical guides, checklists, templates, and software comparisons.
              </div>
            </Link>
            <Link
              href="/blog/client-onboarding-process"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Client onboarding process guide</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Build a repeatable workflow from contract to kickoff.
              </div>
            </Link>
            <Link
              href="/blog/client-onboarding-checklist"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Client onboarding checklist guide</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Use a 10-step checklist to reduce onboarding delays.
              </div>
            </Link>
            <Link
              href="/blog/best-client-onboarding-software"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Best client onboarding software</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Compare onboarding tools with a fair buying framework.
              </div>
            </Link>
            <Link
              href="/blog/client-onboarding-workflow"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Client onboarding workflow guide</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Define roles, handoffs, and automation triggers across each onboarding stage.
              </div>
            </Link>
            <Link
              href="/blog/onboarding-documents-for-clients"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">Onboarding documents for clients</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700">
                Use a practical document request framework to reduce missing files and kickoff delays.
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">FAQ</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
              Common questions about onboarding software for businesses
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {homeFaqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Turn onboarding into your competitive advantage.
                </div>
                <div className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
                  Clean, fast, and trackable for your team — simple and reassuring for every client.
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-700">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="relative h-6 w-6 overflow-hidden rounded-md border border-zinc-200 bg-white">
                    <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" />
                  </span>
                  <span className="font-medium text-zinc-900">ClientEnforce</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-600">Client onboarding, enforced.</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  <a className="hover:text-zinc-900" href="#features">
                    Features
                  </a>
                  <a className="hover:text-zinc-900" href="#pricing">
                    Pricing
                  </a>
                  <a className="hover:text-zinc-900" href="#resources">
                    Resources
                  </a>
                  <Link className="hover:text-zinc-900" href="/contact">
                    Contact
                  </Link>
                  <Link className="hover:text-zinc-900" href="/privacy">
                    Privacy
                  </Link>
                  <Link className="hover:text-zinc-900" href="/terms">
                    Terms
                  </Link>
                  <Link className="hover:text-zinc-900" href="/dubsado-alternative">
                    Dubsado alternative
                  </Link>
                  <Link className="hover:text-zinc-900" href="/honeybook-alternative">
                    HoneyBook alternative
                  </Link>
                  <Link className="hover:text-zinc-900" href="/client-onboarding-software-for-agencies">
                    Onboarding software for agencies
                  </Link>
                  <Link className="hover:text-zinc-900" href="/blog">
                    Blog
                  </Link>
                  <Link className="hover:text-zinc-900" href="/login">
                    Sign in
                  </Link>
                </div>
              </div>
              <div className="mt-3 text-xs text-zinc-600">© {new Date().getFullYear()} ClientEnforce</div>
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={buildFaqPageSchema(
          homeFaqItems.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )}
      />
    </div>
  );
}
