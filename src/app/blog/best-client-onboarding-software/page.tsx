import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("best-client-onboarding-software");

export const metadata = buildBlogMetadata("best-client-onboarding-software");

export default function BestClientOnboardingSoftwarePostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("best-client-onboarding-software")} />;
}
