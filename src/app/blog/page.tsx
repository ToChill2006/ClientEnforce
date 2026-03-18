import type { Metadata } from "next";

import { BlogHubTemplate } from "@/components/marketing/seo-pages";
import { blogPostList } from "@/lib/content/seo-content";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/public-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Blog | Guides, Templates & Automation Tips | ClientEnforce",
  description:
    "Practical guides on client onboarding - what breaks, what to automate, and how to build a process that works without constant manual follow-up.",
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
        title="Client onboarding blog for teams that do this work every day"
        description="If you onboard clients for a living, this is for you. Practical guides on what breaks, what to automate, and how to build a process that does not depend on you chasing everyone personally."
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
