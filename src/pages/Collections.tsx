import { useParams } from "react-router-dom";
import { products, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useState, useMemo } from "react";

const categoryTitles: Record<string, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

const Collections = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState("newest");
  const [materialFilter, setMaterialFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = category ? getProductsByCategory(category) : products;
    if (materialFilter !== "all") {
      list = list.filter((p) => p.material.toLowerCase().includes(materialFilter));
    }
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [category, sortBy, materialFilter]);

  const title = category ? categoryTitles[category] || "Collection" : "All Collections";
  const materials = ["all", "gold", "silver", "platinum", "pearl", "diamond"];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Collection</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">{title}</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-border pb-6">
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => (
              <button
                key={m}
                onClick={() => setMaterialFilter(m)}
                className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-colors ${
                  materialFilter === m
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {m === "all" ? "All" : m}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background border border-border text-sm text-foreground px-4 py-2 focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No products found matching your filters.</p>
        )}
      </div>
    </div>
  );
};

export default Collections;
