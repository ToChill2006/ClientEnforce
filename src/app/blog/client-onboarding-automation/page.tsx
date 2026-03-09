import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-automation");

export const metadata = buildBlogMetadata("client-onboarding-automation");

export default function ClientOnboardingAutomationPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-automation")} />;
}
