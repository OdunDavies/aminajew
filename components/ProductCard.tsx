"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square bg-secondary">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.isNew ? (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase px-3 py-1">
              New
            </span>
          ) : product.isBestSeller ? (
            <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase px-3 py-1">
              Best Seller
            </span>
          ) : null}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm p-2.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <h3 className="font-serif text-sm text-foreground">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.material}</p>
        <p className="text-sm text-primary">{formatPrice(product.price)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
