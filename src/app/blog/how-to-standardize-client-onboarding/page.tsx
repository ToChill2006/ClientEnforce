import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("how-to-standardize-client-onboarding");

export const metadata = buildBlogMetadata("how-to-standardize-client-onboarding");

export default function HowToStandardizeClientOnboardingPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("how-to-standardize-client-onboarding")} />;
}
