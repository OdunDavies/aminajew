import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductsByCollection } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

import ringsImg from "@/assets/collection-rings.jpg";
import necklacesImg from "@/assets/collection-necklaces.jpg";
import braceletsImg from "@/assets/collection-bracelets.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";

const collections = [
  { slug: "rings", label: "Rings", image: ringsImg },
  { slug: "necklaces", label: "Necklaces", image: necklacesImg },
  { slug: "bracelets", label: "Bracelets", image: braceletsImg },
  { slug: "earrings", label: "Earrings", image: earringsImg },
];

const CollectionCards = () => (
  <div className="grid grid-cols-2 gap-4 md:gap-6">
    {collections.map((c, i) => (
      <motion.div
        key={c.slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.4 }}
      >
        <Link
          to={`/collections/${c.slug}`}
          className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
        >
          <img
            src={c.image}
            alt={c.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-end p-4 md:p-6">
            <h2 className="font-serif text-lg md:text-2xl text-white tracking-wide">
              {c.label}
            </h2>
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);

const Collections = () => {
  const { collection } = useParams();
  const title = collection
    ? collections.find((c) => c.slug === collection)?.label || "Collection"
    : "Our Collections";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", collection || "all"],
    queryFn: () => (collection ? fetchProductsByCollection(collection) : fetchProducts()),
    enabled: !!collection,
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <SEO
        title={collection ? `${title} Collection` : "Collections"}
        description={collection ? `Shop our ${title} collection — handcrafted luxury gold ${title.toLowerCase()} by the ounce at artsybrands in Kuje, Abuja, FCT.` : "Browse artsybrands gold jewelry collections in Kuje, Abuja, FCT — rings, necklaces, bracelets, and earrings sold by the ounce."}
      />
      <div className="container mx-auto">
        {/* Breadcrumb */}
        {collection && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-primary">Collections</Link>
            <span>/</span>
            <span className="text-foreground capitalize">{title}</span>
          </div>
        )}

        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            {collection ? "Collection" : "Browse"}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">{title}</h1>
        </div>

        {!collection ? (
          <CollectionCards />
        ) : isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(products || []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {(!products || products.length === 0) && (
              <p className="text-center text-muted-foreground py-20">No products found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collections;
