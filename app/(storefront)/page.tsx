import { fetchNewArrivals, fetchBestSellers } from "@/data/products";
import { readSiteContent } from "@/lib/site-content-store";
import HomePageClient from "@/components/HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsybrands.com";

export default async function HomePage() {
  const [newArrivals, bestSellers, siteContent] = await Promise.all([
    fetchNewArrivals(),
    fetchBestSellers(),
    Promise.resolve(readSiteContent()),
  ]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteContent.brand.name,
    url: siteUrl,
    description: siteContent.seo.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePageClient
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        homepageContent={siteContent.homepage}
      />
    </>
  );
}
