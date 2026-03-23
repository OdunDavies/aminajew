import type { Metadata } from "next";
import { readSiteContent } from "@/lib/site-content-store";
import CollectionsClient from "@/components/CollectionsClient";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse artsybrands gold jewelry collections in Kuje, Abuja, FCT — rings, necklaces, bracelets, and earrings sold by the ounce.",
};

export default async function CollectionsPage() {
  const { homepage } = await readSiteContent();

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Browse</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Our Collections</h1>
        </div>
        <CollectionsClient collections={homepage.collections} />
      </div>
    </div>
  );
}
