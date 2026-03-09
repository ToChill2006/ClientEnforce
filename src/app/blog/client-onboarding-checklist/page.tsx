import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-checklist");

export const metadata = buildBlogMetadata("client-onboarding-checklist");

export default function ClientOnboardingChecklistPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-checklist")} />;
}
