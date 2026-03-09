import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-onboarding-email-templates");

export const metadata = buildBlogMetadata("client-onboarding-email-templates");

export default function ClientOnboardingEmailTemplatesPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-onboarding-email-templates")} />;
}
