import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryTitles: Record<string, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

const Collections = () => {
  const { category } = useParams();
  const title = category ? categoryTitles[category] || "Collection" : "All Collections";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category || "all"],
    queryFn: () => category ? fetchProductsByCategory(category) : fetchProducts(),
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Collection</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">{title}</h1>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-20">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products || []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {!isLoading && (!products || products.length === 0) && (
          <p className="text-center text-muted-foreground py-20">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Collections;
