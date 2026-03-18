import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Accountants | Compliant and Auditable | ClientEnforce",
  description:
    "Client onboarding software for accountants and accounting firms. Collect documents, capture signatures, run AML checks, and maintain a full audit trail - all in one structured workflow.",
  path: "/onboarding-for-accountants",
  keywords: [
    "onboarding software for accountants",
    "client onboarding software",
    "client onboarding checklist",
    "client onboarding automation",
    "client document collection software",
  ],
  type: "website",
});

export default function OnboardingForAccountantsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Built for accountants
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Client onboarding software for accountants - compliant, auditable, and structured
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                For accounting firms, client onboarding is not just a process - it is a compliance obligation. Documents need to be collected correctly, stored securely, and traceable. An email thread is not an audit trail.
              </p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  The compliance problem with email-based onboarding
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  When a new client joins an accounting firm, the intake process typically needs to cover anti-money laundering checks, Know Your Customer documentation, proof of identity and address, a signed engagement letter, and payment setup. Each of these needs to be completed, documented, and retrievable.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  When this happens over email - documents in inboxes, attachments forwarded between accounts, verbal confirmations with no record - you have a compliance exposure. A practice manager asking whether you have the ID for a particular client should be able to get an answer in seconds, not spend twenty minutes searching email threads.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  What accountants need from onboarding software
                </h2>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">A complete, timestamped audit trail</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Every document received, every step completed, every signature collected - with a date, time, and record of who submitted what. Not an activity log. A full evidence trail exportable as a PDF at any time.
                </p>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">Required step enforcement</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  AML checks are not optional. Proof of identity is not optional. The system must enforce these steps - a client&apos;s onboarding is not complete until every required item is submitted.
                </p>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">Document collection in one place</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Required files arrive in the portal, not scattered across email inboxes. Every document is stored against the correct client record from the moment it arrives.
                </p>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">Engagement letter e-signature</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Engagement letters are signed inside the onboarding flow. The signed document is stored as part of the onboarding record automatically.
                </p>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">Exportable evidence pack</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700 sm:text-base">
                  Export a PDF at any point showing the complete onboarding record - all documents, all signatures, all steps, all timestamps. Ready for file review, regulatory inspection, or internal audit.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  How ClientEnforce handles accountant onboarding
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Step 1: Build a compliance-ready onboarding template</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Define all required steps: AML check, KYC documents, engagement letter signature, fee agreement, proof of identity. Mark each step as required - clients cannot complete onboarding without them.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Step 2: Send the portal link when a new client engages</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      One link. The client sees their onboarding requirements clearly. They upload documents directly. They sign the engagement letter in the portal. No email attachments, no confusion.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Step 3: Track completion and export the record</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      See completion status for every active onboarding from one dashboard. When everything is in, export the full evidence pack as a PDF for the client file.
                    </p>
                  </article>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">A note on compliance obligations</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  ClientEnforce is onboarding workflow software - it is not a compliance platform and does not provide legal or regulatory advice. It supports your onboarding process by enforcing completion, storing records, and providing an exportable audit trail. The specific compliance requirements for your firm should be defined by your compliance officer or professional adviser.
                </p>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Does ClientEnforce support AML and KYC document collection?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      ClientEnforce allows you to define required documents as part of your onboarding template - including proof of identity, proof of address, and any other KYC documents your firm requires. The system enforces collection of these documents before marking onboarding as complete.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Can we export an audit trail for each client?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Every onboarding record includes a timestamped history of every document submitted, every step completed, and every signature collected. This can be exported as a PDF evidence pack at any time.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Does the client need to create an account to access the portal?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      No. Clients access their onboarding portal through a secure link. No account creation, no password, no friction.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Can we use different templates for different types of client?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Build separate templates for business clients versus individual clients, or for different service types such as audit, tax, or bookkeeping.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:col-span-2">
                    <h3 className="text-sm font-semibold text-zinc-900">Is ClientEnforce suitable for sole practitioners as well as larger firms?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Pricing is based on onboarding volume rather than team size. A sole practitioner onboarding a small number of clients per month can use ClientEnforce cost-effectively.
                    </p>
                  </article>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding software
                  </Link>
                  <Link href="/client-onboarding-checklist" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding checklist
                  </Link>
                  <Link href="/honeybook-alternative" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    HoneyBook alternative
                  </Link>
                  <Link href="/client-onboarding-automation" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding automation
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Run a compliant, auditable onboarding process - without the admin overhead
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
                    Start free trial
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">
                    See pricing →
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
