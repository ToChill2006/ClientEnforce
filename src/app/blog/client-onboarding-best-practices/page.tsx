import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-best-practices");

export const metadata = buildBlogMetadata("client-onboarding-best-practices");

export default function ClientOnboardingBestPracticesPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-best-practices")} />;
}
