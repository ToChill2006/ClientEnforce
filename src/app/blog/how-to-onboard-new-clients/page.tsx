import { BlogPostTemplate } from "@/components/marketing/seo-pages";
import { buildBlogMetadata, buildBlogSchemas, getBlogPost } from "@/lib/content/seo-helpers";

const post = getBlogPost("how-to-onboard-new-clients");

export const metadata = buildBlogMetadata("how-to-onboard-new-clients");

export default function HowToOnboardNewClientsPostPage() {
  return <BlogPostTemplate post={post} schema={buildBlogSchemas("how-to-onboard-new-clients")} />;
}
