import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("automated-onboarding-workflows");

export const metadata = buildBlogMetadata("automated-onboarding-workflows");

export default function AutomatedOnboardingWorkflowsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("automated-onboarding-workflows")} />;
}
