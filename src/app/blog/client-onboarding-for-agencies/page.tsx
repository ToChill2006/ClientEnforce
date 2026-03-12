import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-for-agencies");

export const metadata = buildBlogMetadata("client-onboarding-for-agencies");

export default function ClientOnboardingForAgenciesPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-for-agencies")} />;
}
