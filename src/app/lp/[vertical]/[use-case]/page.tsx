import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildPageMetadata, buildBreadcrumbSchema, buildFaqPageSchema, buildSoftwareApplicationSchema, jsonLdString } from "@/lib/seo";
import { useCasePages, useCaseBySlug, verticalBySlug } from "@/lib/verticals";

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return useCasePages.map((uc) => ({
    vertical: uc.parentVertical,
    "use-case": uc.slug,
  }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; "use-case": string }>;
}): Promise<Metadata> {
  const { vertical, "use-case": useCase } = await params;
  const page = useCaseBySlug[`${vertical}/${useCase}`];
  if (!page) return {};

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/lp/${vertical}/${useCase}`,
    keywords: [page.primaryKeyword],
    type: "website",
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UseCaseLandingPage({
  params,
}: {
  params: Promise<{ vertical: string; "use-case": string }>;
}) {
  const { vertical, "use-case": useCase } = await params;
  const page = useCaseBySlug[`${vertical}/${useCase}`];
  const parentPage = verticalBySlug[vertical];

  if (!page || !parentPage) notFound();

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/client-onboarding-software" },
    { name: parentPage.vertical, path: `/lp/${vertical}` },
    { name: page.h1, path: `/lp/${vertical}/${useCase}` },
  ]);

  const faq = buildFaqPageSchema(page.faqItems);

  const software = buildSoftwareApplicationSchema({
    description: page.metaDescription,
    path: `/lp/${vertical}/${useCase}`,
  });

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <PageContainer>
          <div className="py-12 sm:py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <Link href="/client-onboarding-software" className="hover:text-[var(--color-text-primary)]">Solutions</Link>
              <span>/</span>
              <Link href={`/lp/${vertical}`} className="hover:text-[var(--color-text-primary)]">
                {parentPage.vertical}
              </Link>
              <span>/</span>
              <span className="text-[var(--color-text-secondary)]">{page.h1}</span>
            </nav>

            <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {parentPage.vertical}
            </div>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              {page.h1.charAt(0).toUpperCase() + page.h1.slice(1)}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
              {page.heroSubheadline}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
              >
                Start free trial
              </Link>
              <Link
                href={`/lp/${vertical}`}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
              >
                {parentPage.primaryKeyword}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Content sections */}
      <section>
        <PageContainer>
          <div className="space-y-6 py-10 sm:py-12">
            {page.sections.map((section) => (
              <section
                key={section.heading}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-text-primary)]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {/* FAQ */}
            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                Frequently asked questions
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {page.faqItems.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                Start onboarding {parentPage.vertical.toLowerCase()} clients the right way
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Build your first template in under 20 minutes. No credit card required.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Start free trial — no credit card needed
                </Link>
                <Link
                  href={`/lp/${vertical}`}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                >
                  {parentPage.vertical} onboarding overview
                </Link>
              </div>
            </section>
          </div>
        </PageContainer>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(software) }}
      />
    </>
  );
}
