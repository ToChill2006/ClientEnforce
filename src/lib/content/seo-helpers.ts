import type { Metadata } from "next";

import { blogPosts, seoLandingPages } from "@/lib/content/seo-content";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildPageMetadata,
} from "@/lib/seo";

export function getLandingPage(key: keyof typeof seoLandingPages) {
  return seoLandingPages[key];
}

export function buildLandingMetadata(key: keyof typeof seoLandingPages): Metadata {
  const page = getLandingPage(key);

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords,
    type: "website",
  });
}

export function buildLandingSchemas(
  key: keyof typeof seoLandingPages,
) {
  const page = getLandingPage(key);
  const schema: Record<string, unknown>[] = [
    buildBreadcrumbSchema(
      page.breadcrumbs.map((item) => ({
        name: item.name,
        path: item.path,
      })),
    ),
  ];

  if (page.faq?.length) {
    schema.push(
      buildFaqPageSchema(
        page.faq.map((item) => ({
          question: item.question,
          answer: item.answer,
        })),
      ),
    );
  }

  return schema;
}

export function getBlogPost(slug: keyof typeof blogPosts) {
  return blogPosts[slug];
}

export function buildBlogMetadata(slug: keyof typeof blogPosts): Metadata {
  const post = getBlogPost(slug);

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: post.path,
    keywords: post.keywords,
    type: "article",
  });
}

export function buildBlogSchemas(slug: keyof typeof blogPosts) {
  const post = getBlogPost(slug);

  return [
    buildBreadcrumbSchema(
      post.breadcrumbs.map((item) => ({
        name: item.name,
        path: item.path,
      })),
    ),
    buildBlogPostingSchema({
      title: post.title,
      description: post.description,
      path: post.path,
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      keywords: post.keywords,
    }),
  ];
}
