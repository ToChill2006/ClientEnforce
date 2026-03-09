import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-mistakes");

export const metadata = buildBlogMetadata("client-onboarding-mistakes");

export default function ClientOnboardingMistakesPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-mistakes")} />;
}
