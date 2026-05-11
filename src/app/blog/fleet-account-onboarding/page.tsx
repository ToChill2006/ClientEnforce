import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("fleet-account-onboarding");
export const metadata = buildBlogMetadata("fleet-account-onboarding");

export default function FleetAccountOnboardingPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("fleet-account-onboarding")} />;
}
