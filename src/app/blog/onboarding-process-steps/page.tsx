import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-process-steps");

export const metadata = buildBlogMetadata("onboarding-process-steps");

export default function OnboardingProcessStepsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-process-steps")} />;
}
