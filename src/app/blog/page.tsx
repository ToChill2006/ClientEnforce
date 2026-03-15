import type { Metadata } from "next";

import { BlogHubTemplate } from "@/components/marketing/seo-pages";
import { blogPostList } from "@/lib/content/seo-content";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/public-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "Client onboarding best practices blog | ClientEnforce",
  description:
    "Practical client onboarding guides on checklists, automation, and workflow fixes for agencies and service teams.",
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
        description="If you onboard clients for a living, this blog is for you. We write about the practical side of client intake: what breaks, what to automate, and how to build a process that does not depend on someone chasing every task."
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
