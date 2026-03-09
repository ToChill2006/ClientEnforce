import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-process");

export const metadata = buildBlogMetadata("client-onboarding-process");

export default function ClientOnboardingProcessPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-process")} />;
}
