import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("how-to-improve-client-onboarding");

export const metadata = buildBlogMetadata("how-to-improve-client-onboarding");

export default function HowToImproveClientOnboardingPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("how-to-improve-client-onboarding")} />;
}
