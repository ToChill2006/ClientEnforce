import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildPageMetadata, buildBreadcrumbSchema, buildFaqPageSchema, buildSoftwareApplicationSchema, jsonLdString } from "@/lib/seo";
import { verticals, verticalBySlug, type VerticalConfig } from "@/lib/verticals";

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return verticals.map((v) => ({ vertical: v.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: slug } = await params;
  const page = verticalBySlug[slug];
  if (!page) return {};

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/lp/${slug}`,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    type: "website",
  });
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

function VerticalJsonLd({ page }: { page: VerticalConfig }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/client-onboarding-software" },
    { name: page.vertical, path: `/lp/${page.slug}` },
  ]);

  const faq = buildFaqPageSchema(page.faqItems);

  const software = buildSoftwareApplicationSchema({
    description: page.metaDescription,
    path: `/lp/${page.slug}`,
  });

  return (
    <>
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

// ─── Section components ───────────────────────────────────────────────────────

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

function Breadcrumbs({ page }: { page: VerticalConfig }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
      <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
      <span>/</span>
      <Link href="/client-onboarding-software" className="hover:text-[var(--color-text-primary)]">Solutions</Link>
      <span>/</span>
      <span className="text-[var(--color-text-secondary)]">{page.vertical}</span>
    </nav>
  );
}

function HeroSection({ page }: { page: VerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-white">
      <PageContainer>
        <div className="py-12 sm:py-16">
          <Breadcrumbs page={page} />
          <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {page.vertical} onboarding
          </div>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {page.primaryKeyword.charAt(0).toUpperCase() + page.primaryKeyword.slice(1)}
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
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              See how it works
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function ProblemSection({ page }: { page: VerticalConfig }) {
  return (
    <section id="problem" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <PageContainer>
        <div className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            The {page.vertical.toLowerCase()} onboarding problem
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {page.painPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]">
                  <span className="h-4 w-4 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function SolutionSection({ page }: { page: VerticalConfig }) {
  return (
    <section id="solution" className="border-b border-[var(--color-border)] bg-white">
      <PageContainer>
        <div className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            How ClientEnforce fixes {page.vertical.toLowerCase()} onboarding
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            {page.solutionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
            <p className="text-base font-medium italic text-[var(--color-text-primary)]">
              &ldquo;{page.pullQuote.quote}&rdquo;
            </p>
            <footer className="mt-3 text-sm text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text-primary)]">
                {page.pullQuote.name}
              </span>
              {" · "}{page.pullQuote.role}{" · "}{page.pullQuote.company}
              {/* TODO: Replace with real customer quote */}
            </footer>
          </blockquote>
        </div>
      </PageContainer>
    </section>
  );
}

function FeaturesSection({ page }: { page: VerticalConfig }) {
  return (
    <section id="features" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <PageContainer>
        <div className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Everything {page.vertical.toLowerCase()} teams need
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.industrySpecificFeatures.map((feature) => (
              <article
                key={feature.name}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]">
                  <span className="h-4 w-4 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function ComparisonSection({ page }: { page: VerticalConfig }) {
  const [comp1, comp2] = page.competitorsMentioned;

  return (
    <section id="compare" className="border-b border-[var(--color-border)] bg-white">
      <PageContainer>
        <div className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            ClientEnforce vs {comp1} for {page.vertical.toLowerCase()} teams
          </h2>
          <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <table className="w-full min-w-[560px] bg-white text-left text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-subtle)]">
                  <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">
                    Feature
                  </th>
                  <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-accent)]">
                    ClientEnforce
                  </th>
                  <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">
                    {comp1}
                  </th>
                  <th className="border-b border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text-primary)]">
                    {comp2}
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-text-primary)]">
                      {row.feature}
                    </td>
                    <td className="border-b border-[var(--color-border)] px-4 py-3 text-[var(--color-text-secondary)]">
                      {row.clientenforce}
                    </td>
                    <td className="border-b border-[var(--color-border)] px-4 py-3 text-[var(--color-text-secondary)]">
                      {row.competitor1}
                    </td>
                    <td className="border-b border-[var(--color-border)] px-4 py-3 text-[var(--color-text-secondary)]">
                      {row.competitor2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            {/* TODO: Update month/year each quarter */}
            Comparison based on publicly available information as of April 2026. Verify details on each vendor&apos;s website.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}

function FaqSection({ page }: { page: VerticalConfig }) {
  return (
    <section id="faq" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <PageContainer>
        <div className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {page.faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
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
        </div>
      </PageContainer>
    </section>
  );
}

function CtaSection({ page }: { page: VerticalConfig }) {
  return (
    <section id="cta" className="bg-white">
      <PageContainer>
        <div className="py-12 sm:py-16">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Start onboarding {page.vertical.toLowerCase()} clients the right way
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
              Build your first {page.vertical.toLowerCase()} onboarding template in under 20 minutes. No
              credit card required.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
              >
                Start free trial — no credit card needed
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function RelatedVerticals({ page }: { page: VerticalConfig }) {
  const related = page.relatedVerticals
    .map((slug) => verticalBySlug[slug])
    .filter(Boolean);

  if (!related.length) return null;

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <PageContainer>
        <div className="py-8">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Also popular:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {related.map((v) => (
              <Link
                key={v.slug}
                href={`/lp/${v.slug}`}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
              >
                {v.primaryKeyword}
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VerticalLandingPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const page = verticalBySlug[slug];

  if (!page) notFound();

  return (
    <>
      <HeroSection page={page} />
      <ProblemSection page={page} />
      <SolutionSection page={page} />
      <FeaturesSection page={page} />
      <ComparisonSection page={page} />
      <FaqSection page={page} />
      <CtaSection page={page} />
      <RelatedVerticals page={page} />
      <VerticalJsonLd page={page} />
    </>
  );
}
