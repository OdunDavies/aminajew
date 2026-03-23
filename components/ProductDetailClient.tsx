"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={`/collections/${product.collection}`} className="hover:text-primary capitalize">{product.collection}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square overflow-hidden bg-secondary mb-4">
              <Image
                src={product.images[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-transparent"}`}
                    >
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 mt-3 md:hidden">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${selectedImage === i ? "bg-primary" : "bg-border"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <p className="text-xs tracking-[0.2em] uppercase text-primary mb-2">{product.material}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.name}</h1>
            <p className="font-serif text-2xl text-primary mb-6">{formatPrice(product.price)}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {product.sizes && (
              <div className="mb-8">
                <p className="text-xs tracking-[0.15em] uppercase text-foreground mb-3">Size</p>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 border text-sm transition-colors ${selectedSize === s ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => addItem(product, selectedSize)}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors mb-8"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8">
              {[
                { icon: Truck, label: "Free Shipping", desc: "On orders ₦500k+" },
                { icon: Shield, label: "Authenticity", desc: "Certified genuine" },
                { icon: RotateCcw, label: "30-Day Returns", desc: "Hassle-free" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center">
                  <Icon size={20} className="mx-auto text-primary mb-2" />
                  <p className="text-xs text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-2xl text-foreground text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
