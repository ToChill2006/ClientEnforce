import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/marketing/public-shell";
import { buildPageMetadata, buildSoftwareApplicationSchema } from "@/lib/seo";

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
              </div>
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
                  <Link className="hover:text-zinc-900" href="/dubsado-alternative">
                    Dubsado alternative
                  </Link>
                  <Link className="hover:text-zinc-900" href="/honeybook-alternative">
                    HoneyBook alternative
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
      <JsonLd data={buildSoftwareApplicationSchema("/")} />
    </div>
  );
}
