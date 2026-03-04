import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: "https://clientenforce.com", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://clientenforce.com/features", lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://clientenforce.com/pricing", lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://clientenforce.com/about", lastModified, changeFrequency: "monthly", priority: 0.7 },
    
  ];
}