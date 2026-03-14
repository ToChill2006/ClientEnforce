import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-process-for-agencies");

export const metadata = buildBlogMetadata("onboarding-process-for-agencies");

export default function OnboardingProcessForAgenciesPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-process-for-agencies")} />;
}
