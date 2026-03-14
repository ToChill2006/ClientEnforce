import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("agency-client-onboarding-checklist");

export const metadata = buildBlogMetadata("agency-client-onboarding-checklist");

export default function AgencyClientOnboardingChecklistPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("agency-client-onboarding-checklist")} />;
}
