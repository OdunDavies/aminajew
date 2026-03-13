import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { fetchNewArrivals, fetchBestSellers } from "@/data/products";
import { ArrowRight } from "lucide-react";

const collections = [
  { name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop" },
  { name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop" },
  { name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=600&fit=crop" },
  { name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop" },
];

const Index = () => {
  const { data: newArrivals = [] } = useQuery({ queryKey: ["new-arrivals"], queryFn: fetchNewArrivals });
  const { data: bestSellers = [] } = useQuery({ queryKey: ["best-sellers"], queryFn: fetchBestSellers });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1920&h=1080&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative text-center z-10 px-4"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-6">Timeless Elegance</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
            Where Luxury<br />Meets Artistry
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Discover handcrafted jewelry pieces that tell your unique story, forged with passion and the finest materials.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
          >
            Explore Collections <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Collections</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Curated With Care</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[3/4]">
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-serif text-lg text-foreground">{col.name}</h3>
                    <span className="text-xs tracking-[0.1em] uppercase text-primary">Shop Now</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Just Arrived</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">New Arrivals</h2>
            </div>
            <Link to="/collections" className="text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=800&fit=crop"
              alt="Craftsmanship"
              className="w-full aspect-[3/4] object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Story</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Crafted by Hand,<br />Worn With Pride</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every piece at artsybrands is a testament to centuries-old craftsmanship, reimagined for the modern connoisseur. Our artisans dedicate countless hours to perfecting each detail.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From sourcing ethically mined gemstones to hand-polishing every facet, we believe luxury should be as meaningful as it is beautiful.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Learn More <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Most Loved</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
