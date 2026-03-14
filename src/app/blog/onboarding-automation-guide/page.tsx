import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-automation-guide");

export const metadata = buildBlogMetadata("onboarding-automation-guide");

export default function OnboardingAutomationGuidePostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-automation-guide")} />;
}
