import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("client-intake-process");

export const metadata = buildBlogMetadata("client-intake-process");

export default function ClientIntakeProcessPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("client-intake-process")} />;
}
