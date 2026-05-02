import type { MetadataRoute } from "next";
import { getPublicAppUrl } from "@/lib/app-url";
import { products } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicAppUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.92 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    {
      url: `${base}/become-distributor`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.78,
    },
  ];

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...productUrls];
}
