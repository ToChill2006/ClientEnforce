import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-workflow");

export const metadata = buildBlogMetadata("client-onboarding-workflow");

export default function ClientOnboardingWorkflowPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-workflow")} />;
}
