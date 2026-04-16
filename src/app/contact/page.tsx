import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact ClientEnforce | Book a Demo or Get Support",
  description:
    "Questions about ClientEnforce? Book a demo, request a trial, or get support. We answer honestly and quickly.",
  path: "/contact",
  keywords: ["contact clientenforce", "book a demo", "client onboarding software support"],
  type: "website",
});

const linkClass = "mt-4 inline-flex rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Contact</p>
              <h1
                className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Contact ClientEnforce
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Got questions? We&apos;ll answer them honestly. Whether you want to see the product in action, talk through whether it&apos;s the right fit for your team, or need support - you&apos;re in the right place.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
                Most sales and support requests get a response within one business day.
              </p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Book a demo</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">See ClientEnforce live. We&apos;ll walk you through a real onboarding workflow in 20 minutes.</p>
                  <a href="https://calendar.app.google/QfkFs4hWUoCbKupj7" target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Book a time
                  </a>
                </article>
                <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Start a free trial</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">No demo needed - just sign up and build your first template.</p>
                  <Link href="/signup" className={linkClass}>Start free trial</Link>
                </article>
                <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Get support</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Already a customer? Contact support for onboarding, workflow, or account help.</p>
                  <a href="mailto:info@clientenforce.com?subject=Support%20Request" className={linkClass}>Email support</a>
                </article>
              </section>

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2
                  className="text-xl font-semibold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Where to go next
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  If you&apos;re still evaluating fit, these pages cover product capabilities, pricing, and implementation depth.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Link href="/features" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding features
                  </Link>
                  <Link href="/pricing" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding pricing
                  </Link>
                  <Link href="/client-onboarding-software" className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white">
                    client onboarding software
                  </Link>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <CtaBand heading="Ready to see ClientEnforce in action?" subtext="Book a demo or start a free trial — no credit card needed." primaryLabel="Start free trial" />
      <PublicFooter />
    </div>
  );
}
