import Link from "next/link";

import type { BlogPost, ContentSection, SeoLandingPage } from "@/lib/content/seo-content";
import { JsonLd, PublicFooter, PublicHeader, Breadcrumbs, PageContainer } from "@/components/marketing/public-shell";
import { TrackedCtaLink } from "@/components/marketing/tracked-cta-link";

function headingToId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function SectionContent({ section }: { section: ContentSection }) {
  const headingId = headingToId(section.heading);

  return (
    <section
      id={headingId}
      className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8"
      aria-labelledby={`${headingId}-title`}
    >
      <h2 id={`${headingId}-title`} className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {section.heading}
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
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

      {section.steps?.length ? (
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {section.steps.map((step) => (
            <li key={step.title} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.description}</p>
            </li>
          ))}
        </ol>
      ) : null}

      {section.table ? (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[560px] bg-white text-left text-sm text-[var(--color-text-secondary)]">
            <thead>
              <tr className="bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
                {section.table.headers.map((header) => (
                  <th key={header} className="border-b border-[var(--color-border)] px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell} className="border-b border-[var(--color-border)] px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.links?.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">{link.label}</div>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{link.description}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeroActions({
  primary,
  secondary,
  tracking,
}: {
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  tracking: { pagePath: string; surface: string };
}) {
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <TrackedCtaLink
        href={primary.href}
        trackProps={{
          pagePath: tracking.pagePath,
          surface: tracking.surface,
          ctaLabel: primary.label,
          ctaHref: primary.href,
        }}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
      >
        {primary.label}
      </TrackedCtaLink>
      {secondary ? (
        <TrackedCtaLink
          href={secondary.href}
          trackProps={{
            pagePath: tracking.pagePath,
            surface: tracking.surface,
            ctaLabel: secondary.label,
            ctaHref: secondary.href,
          }}
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-bg-subtle)]"
        >
          {secondary.label}
        </TrackedCtaLink>
      ) : null}
    </div>
  );
}

function HighlightList({ highlights }: { highlights: string[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {highlights.map((highlight) => (
        <div key={highlight} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)]">
          {highlight}
        </div>
      ))}
    </div>
  );
}

function RelatedReading({
  links,
  title = "Related reading",
}: {
  links: { href: string; label: string; description: string }[];
  title?: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">{link.label}</div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CtaPanel({
  title,
  description,
  primary,
  secondary,
  tracking,
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  tracking: { pagePath: string; surface: string };
}) {
  return (
    <section className="mt-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">{description}</p>
      <HeroActions primary={primary} secondary={secondary} tracking={tracking} />
    </section>
  );
}

export function SeoLandingTemplate({
  page,
  schema,
}: {
  page: SeoLandingPage;
  schema?: Record<string, unknown>[];
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <Breadcrumbs items={page.breadcrumbs} />
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                {page.eyebrow}
              </div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">{page.intro}</p>
              <HeroActions
                primary={page.cta.primary}
                secondary={page.cta.secondary}
                tracking={{ pagePath: page.path, surface: "hero" }}
              />
              <HighlightList highlights={page.highlights} />
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              {page.sections.map((section) => (
                <SectionContent key={section.heading} section={section} />
              ))}

              {page.faq?.length ? (
                <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">FAQ</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {page.faq.map((item) => (
                      <article key={item.question} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <RelatedReading links={page.relatedLinks} />
              <CtaPanel
                title={page.cta.title}
                description={page.cta.description}
                primary={page.cta.primary}
                secondary={page.cta.secondary}
                tracking={{ pagePath: page.path, surface: "cta_panel" }}
              />
            </div>
          </PageContainer>
        </section>
      </main>
      <PublicFooter />

      {schema?.map((item, index) => (
        <JsonLd key={index} data={item} />
      ))}
    </div>
  );
}

export function BlogPostTemplate({
  post,
  schema,
}: {
  post: BlogPost;
  schema?: Record<string, unknown>[];
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <article className="py-12 sm:py-16">
              <Breadcrumbs items={post.breadcrumbs} />
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1 font-medium">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                {post.h1}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-xs font-bold text-[var(--color-accent)]">
                  T
                </div>
                <div>
                  <span className="font-medium text-[var(--color-text-primary)]">Thomas</span>
                  <span className="mx-1.5 text-[var(--color-text-muted)]">·</span>
                  <span>Founder, ClientEnforce</span>
                  <span className="mx-1.5 text-[var(--color-text-muted)]">·</span>
                  <time dateTime={post.publishedTime}>
                    {new Date(post.publishedTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">{post.intro}</p>

              <section className="mt-6 max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">TL;DR</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-primary)]">
                  {post.highlights.slice(0, 4).map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <HeroActions
                primary={post.cta.primary}
                secondary={post.cta.secondary}
                tracking={{ pagePath: post.path, surface: "hero" }}
              />
            </article>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">On this page</h2>
                <ul className="mt-4 grid gap-2 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
                  {post.sections.map((section) => {
                    const id = headingToId(section.heading);
                    return (
                      <li key={section.heading}>
                        <a href={`#${id}`} className="hover:text-[var(--color-text-primary)] hover:underline hover:underline-offset-4">
                          {section.heading}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {post.sections.map((section) => (
                <SectionContent key={section.heading} section={section} />
              ))}

              {post.checklist?.length ? (
                <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                    Implementation checklist
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {post.checklist.map((item) => (
                      <li key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-primary)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <RelatedReading links={post.relatedLinks} title="Related posts" />

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent)]">
                    T
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Thomas — Founder, ClientEnforce</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Thomas built ClientEnforce to solve a problem he faced running a service business: client onboarding that fell apart in email threads. He writes about onboarding systems, workflow automation, and ops for service teams.
                    </p>
                  </div>
                </div>
              </section>

              <CtaPanel
                title="Ready to fix your onboarding? Try ClientEnforce free."
                description="Launch one structured onboarding template, automate follow-ups, and start your next project with complete intake."
                primary={post.cta.primary}
                secondary={post.cta.secondary}
                tracking={{ pagePath: post.path, surface: "cta_panel" }}
              />
            </div>
          </PageContainer>
        </section>
      </main>
      <PublicFooter />

      {schema?.map((item, index) => (
        <JsonLd key={index} data={item} />
      ))}
    </div>
  );
}

export function BlogHubTemplate({
  title,
  description,
  posts,
}: {
  title: string;
  description: string;
  posts: BlogPost[];
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Resources</div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">{description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Go to ClientEnforce homepage
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-bg-subtle)]"
                >
                  Explore client onboarding software
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="py-10 sm:py-12">
              <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">Featured posts</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  Start with the guides that drive the biggest onboarding gains first: fixing root-cause failures,
                  using a proven checklist template, and choosing software with completion enforcement.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <Link
                    href="/blog/why-client-onboarding-fails"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Why client onboarding fails</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Seven root causes that delay kickoff and exactly how to fix each one.
                    </p>
                    <div className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                      Read the onboarding failure guide
                    </div>
                  </Link>
                  <Link
                    href="/blog/client-onboarding-checklist-template"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Client onboarding checklist template</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Use the full 2026 checklist to standardize onboarding across your team.
                    </p>
                    <div className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                      Read the checklist template guide
                    </div>
                  </Link>
                  <Link
                    href="/blog/best-client-onboarding-software-2026"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Best client onboarding software (2026)</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Compare buyer-fit criteria before choosing an onboarding platform.
                    </p>
                    <div className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                      Read the software comparison guide
                    </div>
                  </Link>
                </div>
              </section>

              <section className="mt-6 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                  What you will learn in this client onboarding blog
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  We cover what breaks in real onboarding workflows, what to automate first, and how to roll out
                  process changes without disrupting delivery.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Process and workflow guides</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Build clearer ownership, cleaner handoffs, and reliable kickoff readiness.
                    </p>
                  </article>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Automation and checklist playbooks</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Automate repetitive follow-up and enforce required onboarding steps.
                    </p>
                  </article>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Software comparison pages</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                      Compare alternatives with practical criteria, not just feature checklists.
                    </p>
                  </article>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Link
                    href="/client-onboarding-software"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white"
                  >
                    client onboarding software
                  </Link>
                  <Link
                    href="/client-onboarding-automation"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white"
                  >
                    client onboarding automation
                  </Link>
                  <Link
                    href="/client-onboarding-checklist"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white"
                  >
                    client onboarding checklist
                  </Link>
                  <Link
                    href="/dubsado-alternative"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white"
                  >
                    Dubsado alternative
                  </Link>
                  <Link
                    href="/honeybook-alternative"
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-white"
                  >
                    HoneyBook alternative
                  </Link>
                </div>
              </section>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={post.path}
                    className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {post.category}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-[var(--color-text-primary)]">{post.h1}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{post.description}</p>
                    <div className="mt-4 text-sm font-medium text-[var(--color-text-primary)]">
                      Read: {post.h1}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
