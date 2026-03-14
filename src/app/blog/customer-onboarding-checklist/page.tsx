import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("customer-onboarding-checklist");

export const metadata = buildBlogMetadata("customer-onboarding-checklist");

export default function CustomerOnboardingChecklistPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("customer-onboarding-checklist")} />;
}
