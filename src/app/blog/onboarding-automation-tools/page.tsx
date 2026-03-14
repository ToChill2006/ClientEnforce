import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-automation-tools");

export const metadata = buildBlogMetadata("onboarding-automation-tools");

export default function OnboardingAutomationToolsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-automation-tools")} />;
}
