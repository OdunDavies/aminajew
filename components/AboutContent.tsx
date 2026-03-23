"use client";

import { motion } from "framer-motion";
import type { Stat } from "@/lib/site-content-store";

interface Props {
  paragraphs: string[];
  stats: Stat[];
}

export default function AboutContent({ paragraphs, stats }: Props) {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`text-muted-foreground leading-relaxed ${i === 0 ? "text-lg" : ""}`}
          >
            {p}
          </motion.p>
        ))}
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-serif text-3xl md:text-4xl text-primary">{stat.num}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
