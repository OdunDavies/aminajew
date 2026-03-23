import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductsByCollection } from "@/data/products";
import CollectionProductsClient from "@/components/CollectionProductsClient";

const collectionLabels: Record<string, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const label = collectionLabels[collection];
  if (!label) return { title: "Not Found" };
  return {
    title: `${label} Collection`,
    description: `Shop our ${label} collection — handcrafted luxury gold ${label.toLowerCase()} by the ounce at artsybrands in Kuje, Abuja, FCT.`,
    openGraph: {
      title: `${label} Collection | artsybrands`,
      description: `Handcrafted gold ${label.toLowerCase()} by the ounce. Shop the ${label} collection at artsybrands.`,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const label = collectionLabels[collection];
  if (!label) notFound();

  const products = await fetchProductsByCollection(collection);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-primary">Collections</Link>
          <span>/</span>
          <span className="text-foreground capitalize">{label}</span>
        </div>

        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Collection</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">{label}</h1>
        </div>

        <CollectionProductsClient products={products} />
      </div>
    </div>
  );
}
