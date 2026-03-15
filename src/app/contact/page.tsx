import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ClientEnforce | Book a Demo or Get Support",
  description:
    "Questions about ClientEnforce? Book a demo, request a trial, or get support. We answer honestly and quickly.",
  path: "/contact",
  keywords: ["contact clientenforce", "book a demo", "client onboarding software support"],
  type: "website",
});

const contactOptions = [
  {
    title: "Book a demo",
    description: "See ClientEnforce live. We&apos;ll walk you through a real onboarding workflow in 20 minutes.",
    ctaLabel: "Book a time",
    ctaHref: "mailto:info@clientenforce.com?subject=Book%20a%20Demo",
  },
  {
    title: "Start a free trial",
    description: "No demo needed - just sign up and build your first template.",
    ctaLabel: "Start free trial",
    ctaHref: "/signup",
  },
  {
    title: "Get support",
    description: "Already a customer? Contact support for onboarding, workflow, or account help.",
    ctaLabel: "Email support",
    ctaHref: "mailto:info@clientenforce.com?subject=Support%20Request",
  },
] as const;

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
                Got questions? We&apos;ll answer them honestly. Whether you want to see the product in action, talk through whether it&apos;s the right fit for your team, or need support - you&apos;re in the right place.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-700">
                Most sales and support requests get a response within one business day.
              </p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="grid gap-4 md:grid-cols-3">
                {contactOptions.map((option) => (
                  <article key={option.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">{option.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{option.description}</p>
                    <Link
                      href={option.ctaHref}
                      className="mt-4 inline-flex rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
                    >
                      {option.ctaLabel}
                    </Link>
                  </article>
                ))}
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-900">Where to go next</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  If you&apos;re still evaluating fit, these pages cover product capabilities, pricing, and implementation depth.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Link href="/features" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding features
                  </Link>
                  <Link href="/pricing" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding pricing
                  </Link>
                  <Link href="/client-onboarding-software" className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white">
                    client onboarding software
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
