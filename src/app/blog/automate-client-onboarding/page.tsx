import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("automate-client-onboarding");

export const metadata = buildBlogMetadata("automate-client-onboarding");

export default function AutomateClientOnboardingPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("automate-client-onboarding")} />;
}
