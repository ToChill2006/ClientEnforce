import type { Metadata } from "next";
import Link from "next/link";

import { ChecklistDownloadForm } from "@/components/marketing/checklist-download-form";
import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Client Onboarding Checklist Template | Download | ClientEnforce",
  description:
    "Download the free client onboarding checklist template used by agencies and consultants. PDF format - covers intake, documents, signatures, and kickoff readiness.",
  path: "/downloads/client-onboarding-checklist",
  keywords: [
    "client onboarding checklist template",
    "client onboarding checklist",
    "onboarding checklist for agencies",
    "client onboarding software",
  ],
  type: "website",
});

export default function ClientOnboardingChecklistDownloadPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Free download</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Free client onboarding checklist template
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                The checklist used by agencies, consultants, and accountants to run structured, complete onboarding - every time. Download it free.
              </p>
              <ul className="mt-5 grid gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-800 sm:grid-cols-2">
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
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Get the checklist PDF</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Enter your details and we will send you the client onboarding checklist template.
                </p>
                <div className="mt-5">
                  <ChecklistDownloadForm />
                </div>
                <p className="mt-4 text-xs text-zinc-600">
                  No spam. Used by teams at agencies, consultancies, and accounting firms.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Prefer to read first?</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  You can also use the complete guide and adapt it to your team before automating it.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/blog/client-onboarding-checklist-template" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding checklist template guide</Link>
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding software</Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">client onboarding automation</Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 hover:bg-white">view onboarding pricing</Link>
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
