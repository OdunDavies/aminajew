"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Product } from "@/data/products";
import type { HomepageContent } from "@/lib/site-content-store";

interface Props {
  newArrivals: Product[];
  bestSellers: Product[];
  homepageContent: HomepageContent;
}

export default function HomePageClient({ newArrivals, bestSellers, homepageContent }: Props) {
  const { hero, collections, story } = homepageContent;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={hero.backgroundImage}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative text-center z-10 px-4"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-6">{hero.tagline}</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
            {hero.heading}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm leading-relaxed">
            {hero.description}
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
          >
            Explore Collections <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
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
                <Link href={`/collections/${col.slug}`} className="group block relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={col.image}
                    alt={col.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-serif text-lg text-foreground">{col.label}</h3>
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Just Arrived</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">New Arrivals</h2>
            </div>
            <Link href="/collections" className="text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
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
            className="relative aspect-[3/4] w-full"
          >
            <Image
              src={story.image}
              alt="Craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">{story.tagline}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{story.heading}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{story.paragraph1}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{story.paragraph2}</p>
            <Link
              href="/about"
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
}
