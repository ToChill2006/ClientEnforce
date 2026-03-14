import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-new-clients-checklist");

export const metadata = buildBlogMetadata("onboarding-new-clients-checklist");

export default function OnboardingNewClientsChecklistPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-new-clients-checklist")} />;
}
