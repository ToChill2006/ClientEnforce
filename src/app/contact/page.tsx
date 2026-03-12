import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ClientEnforce | Support, Sales, and Demo Requests",
  description:
    "Get in touch with ClientEnforce for support, sales, onboarding demo requests, and partnership inquiries.",
  path: "/contact",
  keywords: ["contact clientenforce", "client onboarding software support", "saas contact"],
  type: "website",
});

type ContactReason = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

const reasons: ContactReason[] = [
  {
    title: "Support",
    description:
      "Need help with onboarding workflows, documents, signatures, or account setup? Our support team can help.",
    actionLabel: "Email support",
    actionHref: "mailto:info@clientenforce.com",
  },
  {
    title: "Sales",
    description:
      "Evaluating ClientEnforce for your team? Contact us for plan guidance and onboarding workflow fit.",
    actionLabel: "Talk to sales",
    actionHref: "mailto:info@clientenforce.com?subject=Sales%20Inquiry",
  },
  {
    title: "Partnerships",
    description:
      "Interested in a strategic partnership, referral collaboration, or integration opportunity?",
    actionLabel: "Discuss partnerships",
    actionHref: "mailto:info@clientenforce.com?subject=Partnership%20Inquiry",
  },
];

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-800">
      {children}
    </label>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Contact</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Contact ClientEnforce
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Reach out for support, sales guidance, onboarding demo questions, or partnership discussions.
                We handle most inquiries by email and aim to respond quickly with practical next steps based on your use case.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:info@clientenforce.com"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Email info@clientenforce.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Back to homepage
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Explore client onboarding software
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Review product features
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Compare pricing plans
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="py-10 sm:py-12">
              <div className="grid gap-4 md:grid-cols-3">
                {reasons.map((reason) => (
                  <article key={reason.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">{reason.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{reason.description}</p>
                    <a
                      href={reason.actionHref}
                      className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline underline-offset-4"
                    >
                      {reason.actionLabel}
                    </a>
                  </article>
                ))}
              </div>

              <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-900">How to contact the right team</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Support requests</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Contact support when you need help with onboarding workflows, document collection,
                      signatures, reminders, or account access.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Sales and onboarding demos</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Contact sales if you are evaluating client intake and onboarding software, comparing
                      plans, or mapping how to automate client onboarding for your team.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Partnership inquiries</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Use the partnerships route for referral collaboration, integration opportunities,
                      or strategic ecosystem conversations.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Response expectations</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Include your company name, onboarding goals, and any blockers. Clear context helps
                      us route your request and respond with useful guidance faster.
                    </p>
                  </article>
                </div>
              </section>

              <div className="mt-8 grid gap-6 lg:grid-cols-5">
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-3">
                  <h2 className="text-xl font-semibold text-zinc-900">Send us a message</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    Use this form layout for quick inquiries. For immediate help, email
                    {" "}
                    <a href="mailto:info@clientenforce.com" className="font-medium text-zinc-900 underline underline-offset-4">
                      info@clientenforce.com
                    </a>
                    .
                  </p>

                  <form
                    className="mt-5 grid gap-4 sm:grid-cols-2"
                    action="mailto:info@clientenforce.com?subject=ClientEnforce%20Contact%20Form"
                    method="post"
                    encType="text/plain"
                  >
                    <div>
                      <Label htmlFor="fullName">Full name</Label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Work email</Label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
                        placeholder="jane@company.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="company">Company</Label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
                        placeholder="Acme Agency"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="reason">Reason for contacting us</Label>
                      <select
                        id="reason"
                        name="reason"
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a reason
                        </option>
                        <option value="support">Support</option>
                        <option value="sales">Sales</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
                        placeholder="Tell us what you need help with."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                      >
                        Send message
                      </button>
                    </div>
                  </form>
                </section>

                <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <h2 className="text-xl font-semibold text-zinc-900">Contact details</h2>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-700">
                    <div>
                      <div className="font-medium text-zinc-900">Support email</div>
                      <a href="mailto:info@clientenforce.com" className="underline underline-offset-4">
                        info@clientenforce.com
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900">Legal</div>
                      <div className="mt-1 flex flex-col gap-1">
                        <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
                        <Link href="/terms" className="underline underline-offset-4">Terms & Conditions</Link>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Who ClientEnforce helps
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  ClientEnforce is built for agencies, consultants, and service businesses that need a
                  clear client onboarding workflow. Teams use it to collect intake information, request
                  documents, capture signatures, and track completion without long email chains.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  If you are choosing customer onboarding software, start with our
                  {" "}
                  <Link href="/client-onboarding-software" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding software overview
                  </Link>
                  , review
                  {" "}
                  <Link href="/features" className="font-medium text-zinc-900 underline underline-offset-4">
                    platform features
                  </Link>
                  , and compare
                  {" "}
                  <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                    plan options
                  </Link>
                  {" "}
                  before contacting sales.
                </p>
              </section>

              <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-900">Before you reach out</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  To help us provide a useful answer quickly, include your onboarding workflow goals,
                  current process bottlenecks, and expected rollout timeline. Requests with this context
                  are easier to route and usually receive more practical guidance.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Sales inquiries</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Share team size, onboarding volume, and the features you need to automate client onboarding.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Support requests</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Include account details, impacted workflow step, and any error screenshots so support can respond faster.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Partnership requests</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Describe audience fit, integration ideas, and collaboration goals so we can evaluate alignment.
                    </p>
                  </article>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/client-onboarding-automation"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Explore onboarding automation
                  </Link>
                  <Link
                    href="/client-onboarding-checklist"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Review onboarding checklist
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Read onboarding guides
                  </Link>
                </div>
              </section>

              <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-900">Contact FAQ</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  The fastest path is usually to review product fit first, then reach out with specific
                  implementation questions. If you are still comparing options, focus on how each platform
                  handles required-step enforcement, document collection, follow-up automation, and kickoff readiness.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Our team can help you map ClientEnforce to your onboarding workflow, but sharing detail
                  about your current process will make that conversation more useful from the start.
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  If your team is preparing a migration from manual onboarding, include expected go-live
                  dates and service priorities so we can provide rollout guidance that matches your timeline.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">How quickly does ClientEnforce respond?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Response times vary by request type and volume, but we prioritize clear, actionable next steps in each reply.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Can I request a product walkthrough?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Sales inquiries can include walkthrough or onboarding demo questions tailored to your workflow.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Where can I compare alternatives first?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Start with our
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
                      pages for side-by-side context.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Is there self-serve guidance available?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Browse the
                      {" "}
                      <Link href="/blog" className="font-medium text-zinc-900 underline underline-offset-4">
                        onboarding resource library
                      </Link>
                      {" "}
                      for process, automation, and checklist guides.
                    </p>
                  </article>
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
