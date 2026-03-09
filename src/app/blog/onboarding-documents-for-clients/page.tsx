import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("onboarding-documents-for-clients");

export const metadata = buildBlogMetadata("onboarding-documents-for-clients");

export default function OnboardingDocumentsForClientsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("onboarding-documents-for-clients")} />;
}
