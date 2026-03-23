"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CollectionItem } from "@/lib/site-content-store";

interface Props {
  collections: CollectionItem[];
}

export default function CollectionsClient({ collections }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {collections.map((c, i) => (
        <motion.div
          key={c.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <Link
            href={`/collections/${c.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
          >
            <img
              src={c.image}
              alt={c.label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-end p-4 md:p-6">
              <h2 className="font-serif text-lg md:text-2xl text-white tracking-wide">{c.label}</h2>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
