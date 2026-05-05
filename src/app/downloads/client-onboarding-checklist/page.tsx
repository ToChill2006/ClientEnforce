import type { Metadata } from "next";
import Link from "next/link";

import { ChecklistDownloadForm } from "@/components/marketing/checklist-download-form";
import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Free Client Onboarding Checklist Template | Download | ClientEnforce",
  description:
    "Download the free client onboarding checklist template used by agencies and consultants. PDF format - covers intake, documents, signatures, and kickoff readiness.",
  path: "/downloads/client-onboarding-checklist",
});

export default function ClientOnboardingChecklistDownloadPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Free download</p>
              <h1
                className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Free client onboarding checklist template
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                The checklist used by agencies, consultants, and accountants to run structured, complete onboarding - every time. Download it free.
              </p>
              <ul className="mt-5 grid gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)] sm:grid-cols-2">
                <li>Pre-onboarding steps (6 internal checks before the client is involved)</li>
                <li>Client intake requirements (7 items to collect from every new client)</li>
                <li>Document and signature collection (5 required documents for most service businesses)</li>
                <li>Kickoff readiness checks (4 steps to confirm before the project starts)</li>
              </ul>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Get the checklist PDF</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Enter your details and we will send you the client onboarding checklist template.
                </p>
                <div className="mt-5">
                  <ChecklistDownloadForm />
                </div>
                <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
                  No spam. Used by teams at agencies, consultancies, and accounting firms.
                </p>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Prefer to read first?</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  You can also use the complete guide and adapt it to your team before automating it.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/blog/client-onboarding-checklist-template" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding checklist template guide</Link>
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">client onboarding automation</Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white">view onboarding pricing</Link>
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
