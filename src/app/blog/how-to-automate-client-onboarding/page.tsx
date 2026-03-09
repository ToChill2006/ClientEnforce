import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("how-to-automate-client-onboarding");

export const metadata = buildBlogMetadata("how-to-automate-client-onboarding");

export default function HowToAutomateClientOnboardingPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("how-to-automate-client-onboarding")} />;
}
