import type { Metadata } from "next";
import Link from "next/link";

import { ChecklistDownloadForm } from "@/components/marketing/checklist-download-form";
import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Fleet Account Onboarding Checklist (Free Download) | ClientEnforce",
  description:
    "Download the free fleet account onboarding checklist for multi-location auto service operators. Covers account setup, vehicle data, compliance docs, and kickoff readiness — 30+ required steps.",
  path: "/downloads/fleet-account-onboarding-checklist",
});

export default function FleetChecklistDownloadPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Free download — Multi-location operators</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Multi-Location Fleet Account Onboarding Checklist
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                30+ required steps across four phases — account setup, vehicle and asset data, compliance and documents, and kickoff readiness. Used by US auto service operators and fleet service businesses to get accounts live in 24 hours instead of a week.
              </p>
              <ul className="mt-5 grid gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)] sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-[var(--color-accent)]">✓</span>
                  Phase 1: Fleet account intake and stakeholder assignment (8 steps)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-[var(--color-accent)]">✓</span>
                  Phase 2: Vehicle and asset data collection (7 steps)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-[var(--color-accent)]">✓</span>
                  Phase 3: Compliance documents and agreements (9 steps)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-[var(--color-accent)]">✓</span>
                  Phase 4: Account activation and kickoff readiness (6 steps)
                </li>
              </ul>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Get the checklist
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Enter your details and we&apos;ll send you the link immediately. View online or print as PDF.
                </p>
                <div className="mt-5">
                  <ChecklistDownloadForm
                    asset="fleet-account-onboarding-checklist"
                    viewHref="/downloads/fleet-account-onboarding-checklist/view"
                    viewLabel="View the fleet onboarding checklist →"
                  />
                </div>
                <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
                  No spam. Used by US auto service chains and fleet service operators.
                </p>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  Related resources
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Link href="/auto-service" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">
                    Auto service &amp; fleet onboarding software
                  </Link>
                  <Link href="/fleet-account-onboarding" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">
                    Fleet account onboarding guide
                  </Link>
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">
                    Client onboarding software overview
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
