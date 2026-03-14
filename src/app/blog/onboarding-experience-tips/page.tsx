import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-experience-tips");

export const metadata = buildBlogMetadata("onboarding-experience-tips");

export default function OnboardingExperienceTipsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-experience-tips")} />;
}
