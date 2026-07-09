import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.kambesttrado.com";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
