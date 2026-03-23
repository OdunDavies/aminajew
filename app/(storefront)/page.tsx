import { fetchNewArrivals, fetchBestSellers } from "@/data/products";
import { readSiteContent } from "@/lib/site-content-store";
import HomePageClient from "@/components/HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsybrands.com";

export default async function HomePage() {
  const [newArrivals, bestSellers, siteContent] = await Promise.all([
    fetchNewArrivals(),
    fetchBestSellers(),
    readSiteContent(),
  ]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteContent.brand.name,
    url: siteUrl,
    description: siteContent.seo.description,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteContent.brand.name,
    description: siteContent.seo.description,
    url: siteUrl,
    telephone: siteContent.brand.phone,
    ...(siteContent.brand.email ? { email: siteContent.brand.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteContent.brand.address,
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    openingHoursSpecification: [
      siteContent.brand.hours.weekdays,
      siteContent.brand.hours.saturday,
      siteContent.brand.hours.sunday,
    ]
      .filter(Boolean)
      .map((h) => ({ "@type": "OpeningHoursSpecification", description: h })),
    sameAs: [
      siteContent.brand.social.instagram,
      siteContent.brand.social.facebook,
      siteContent.brand.social.twitter,
    ].filter(Boolean),
    ...(siteContent.seo.ogImage ? { image: siteContent.seo.ogImage } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomePageClient
        newArrivals={newArrivals}
        bestSellers={bestSellers}
        homepageContent={siteContent.homepage}
      />
    </>
  );
}
