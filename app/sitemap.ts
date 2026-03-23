import type { MetadataRoute } from "next";
import { readProducts } from "@/lib/products-store";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsybrands.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = readProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/collections`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/collections/rings`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/collections/necklaces`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/collections/bracelets`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/collections/earrings`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [...staticPages, ...productUrls];
}
