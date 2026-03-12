import { useParams } from "react-router-dom";
import { products, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryTitles: Record<string, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

const Collections = () => {
  const { category } = useParams();
  const filtered = category ? getProductsByCategory(category) : products;
  const title = category ? categoryTitles[category] || "Collection" : "All Collections";

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Collection</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">{title}</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Collections;
