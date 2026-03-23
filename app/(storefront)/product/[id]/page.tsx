import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById, fetchProductsByCollection } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description:
      product.description ||
      `Shop ${product.name} — handcrafted gold ${product.collection} by the ounce at artsybrands, Kuje, Abuja, FCT.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) notFound();

  const allInCollection = await fetchProductsByCollection(product.collection);
  const related = allInCollection.filter((p) => p.id !== product.id).slice(0, 4);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: "artsybrands" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "artsybrands" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
