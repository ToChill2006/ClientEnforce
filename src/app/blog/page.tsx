import type { Metadata } from "next";

import { BlogHubTemplate } from "@/components/marketing/seo-pages";
import { blogPostList } from "@/lib/content/seo-content";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/public-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Blog: Guides, Checklists, and Automation | ClientEnforce",
  description:
    "Read actionable client onboarding guides on process design, automation, checklists, templates, and software comparisons.",
  path: "/blog",
  keywords: [
    "client onboarding",
    "client onboarding process",
    "client onboarding checklist",
    "client onboarding automation",
    "best client onboarding software",
  ],
  type: "website",
});

export default function BlogPage() {
  return (
    <>
      <BlogHubTemplate
        title="Client onboarding resources for high-converting service teams"
        description="Explore practical guides on client onboarding process, checklist design, automation, workflow execution, and software selection."
        posts={blogPostList}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
    </>
  );
}
