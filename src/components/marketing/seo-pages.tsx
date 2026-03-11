import Link from "next/link";

import type { BlogPost, ContentSection, SeoLandingPage } from "@/lib/content/seo-content";
import { JsonLd, PublicFooter, PublicHeader, Breadcrumbs, PageContainer } from "@/components/marketing/public-shell";

function headingToId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function SectionContent({ section }: { section: ContentSection }) {
  const headingId = headingToId(section.heading);

  return (
    <section
      id={headingId}
      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby={`${headingId}-title`}
    >
      <h2 id={`${headingId}-title`} className="text-2xl font-semibold tracking-tight text-zinc-900">
        {section.heading}
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-700 sm:text-base">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {section.bullets?.length ? (
        <ul className="mt-5 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-800">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.steps?.length ? (
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {section.steps.map((step) => (
            <li key={step.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{step.description}</p>
            </li>
          ))}
        </ol>
      ) : null}

      {section.table ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="w-full min-w-[560px] bg-white text-left text-sm text-zinc-700">
            <thead>
              <tr className="bg-zinc-50 text-zinc-900">
                {section.table.headers.map((header) => (
                  <th key={header} className="border-b border-zinc-200 px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell} className="border-b border-zinc-100 px-4 py-3 align-top">
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
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="text-sm font-semibold text-zinc-900">{link.label}</div>
              <p className="mt-1 text-sm leading-6 text-zinc-700">{link.description}</p>
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
}: {
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <Link
        href={primary.href}
        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
      >
        {primary.label}
      </Link>
      {secondary ? (
        <Link
          href={secondary.href}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}

function HighlightList({ highlights }: { highlights: string[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {highlights.map((highlight) => (
        <div key={highlight} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
          {highlight}
        </div>
      ))}
    </div>
  );
}

function RelatedReading({ links }: { links: { href: string; label: string; description: string }[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Related reading</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="text-sm font-semibold text-zinc-900">{link.label}</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">{link.description}</p>
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
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700 sm:text-base">{description}</p>
      <HeroActions primary={primary} secondary={secondary} />
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
  const supportingLinks = [
    { href: "/client-onboarding-software", label: "Client onboarding software overview" },
    { href: "/client-onboarding-automation", label: "Client onboarding automation strategies" },
    { href: "/client-onboarding-checklist", label: "Client onboarding checklist framework" },
    { href: "/features", label: "Client onboarding platform features" },
    { href: "/pricing", label: "Client onboarding pricing plans" },
    { href: "/dubsado-alternative", label: "Dubsado alternative comparison" },
    { href: "/honeybook-alternative", label: "HoneyBook alternative comparison" },
  ].filter((link) => link.href !== page.path);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <Breadcrumbs items={page.breadcrumbs} />
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                {page.eyebrow}
              </div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">{page.intro}</p>
              <HeroActions primary={page.cta.primary} secondary={page.cta.secondary} />
              <HighlightList highlights={page.highlights} />
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Why this page matters for onboarding teams
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Teams researching {page.eyebrow.toLowerCase()} usually need a faster, more reliable way
                  to move clients from signed agreement to delivery readiness. The guidance below is built
                  to help you reduce delays, improve completion rates, and keep onboarding workflows consistent.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Use this page alongside related product and comparison resources so you can evaluate fit,
                  align stakeholders, and launch with a practical implementation plan.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {supportingLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              {page.sections.map((section) => (
                <SectionContent key={section.heading} section={section} />
              ))}

              {page.faq?.length ? (
                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">FAQ</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {page.faq.map((item) => (
                      <article key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <h3 className="text-sm font-semibold text-zinc-900">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-700">{item.answer}</p>
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
  const guideLinks = [
    { href: "/client-onboarding-software", label: "Client onboarding software" },
    { href: "/client-onboarding-automation", label: "Client onboarding automation" },
    { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
    { href: "/features", label: "Client onboarding platform features" },
    { href: "/pricing", label: "Client onboarding pricing plans" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <article className="py-12 sm:py-16">
              <Breadcrumbs items={post.breadcrumbs} />
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                {post.h1}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">{post.intro}</p>

              <HeroActions primary={post.cta.primary} secondary={post.cta.secondary} />
              <HighlightList highlights={post.highlights} />
            </article>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">On this page</h2>
                <ul className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                  {post.sections.map((section) => {
                    const id = headingToId(section.heading);
                    return (
                      <li key={section.heading}>
                        <a href={`#${id}`} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
                          {section.heading}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  How to use this client onboarding guide
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  This article is designed for teams improving client onboarding process quality, timeline
                  predictability, and completion rates. Start with the sections that match your current
                  bottleneck, then apply the checklist and workflow recommendations to your next onboarding cycle.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you are implementing changes immediately, pair this guide with the product resources
                  below so you can move from planning to execution with fewer handoffs.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {guideLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              {post.sections.map((section) => (
                <SectionContent key={section.heading} section={section} />
              ))}

              {post.checklist?.length ? (
                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Implementation checklist
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {post.checklist.map((item) => (
                      <li key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Next steps</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  Explore the main product pages after this guide to compare plans and launch your workflow.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    ClientEnforce homepage
                  </Link>
                  <Link
                    href="/client-onboarding-software"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Client onboarding software
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Pricing
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Compare onboarding software options
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  If you are comparing implementation options, review these side-by-side pages to assess
                  workflow fit, feature depth, and rollout tradeoffs.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/dubsado-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Dubsado alternative for client onboarding
                  </Link>
                  <Link
                    href="/honeybook-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    HoneyBook alternative for client onboarding
                  </Link>
                </div>
              </section>

              <RelatedReading links={post.relatedLinks} />

              <CtaPanel
                title={post.cta.title}
                description={post.cta.description}
                primary={post.cta.primary}
                secondary={post.cta.secondary}
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">Resources</div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">{description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Go to ClientEnforce homepage
                </Link>
                <Link
                  href="/client-onboarding-software"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
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
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  What we publish in the ClientEnforce blog
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  This blog focuses on practical execution for client intake and onboarding software.
                  You will find process guides, automation playbooks, checklist frameworks, and fair
                  software comparisons that help teams launch cleaner onboarding workflows.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Process and workflow guides</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Use these when documenting handoffs, ownership, and readiness criteria.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Automation and checklist resources</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Apply these to automate reminders and enforce required onboarding steps.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Comparison pages</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Review side-by-side alternatives before selecting your onboarding platform.
                    </p>
                  </article>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Link
                    href="/features"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Client onboarding features
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Client onboarding pricing
                  </Link>
                  <Link
                    href="/dubsado-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Dubsado alternative
                  </Link>
                  <Link
                    href="/honeybook-alternative"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    HoneyBook alternative
                  </Link>
                  <Link
                    href="/client-onboarding-software-for-agencies"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    Onboarding software for agencies
                  </Link>
                </div>
              </section>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={post.path}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {post.category}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-zinc-900">{post.h1}</h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-700">{post.description}</p>
                    <div className="mt-4 text-sm font-medium text-zinc-900">
                      Read {post.h1}
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
