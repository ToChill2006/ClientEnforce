import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-intake-form-template");

export const metadata = buildBlogMetadata("client-intake-form-template");

export default function ClientIntakeFormTemplatePostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-intake-form-template")} />;
}
