import { motion } from "framer-motion";

const About = () => (
  <div className="min-h-screen pt-24 pb-16">
    {/* Hero */}
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&h=600&fit=crop')" }} />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative text-center z-10">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Story</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground">About artsybrands</h1>
      </div>
    </section>

    <div className="container mx-auto px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-muted-foreground leading-relaxed text-lg">
          Founded on the belief that jewelry is more than adornment — it's a language of love, a marker of milestones, and an expression of identity. At artsybrands, we marry centuries-old goldsmithing traditions with contemporary design sensibility.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground leading-relaxed">
          Every gemstone is ethically sourced. Every setting is hand-finished. Every piece undergoes rigorous quality inspection before earning the AURUM hallmark. We work with master artisans who bring decades of expertise to each creation.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground leading-relaxed">
          Our commitment extends beyond beauty. We practice responsible sourcing, minimize environmental impact, and support the communities where our materials originate. Luxury, we believe, should leave the world better than it found it.
        </motion.p>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-20 text-center">
        {[
          { num: "500+", label: "Unique Designs" },
          { num: "15", label: "Years of Craft" },
          { num: "50K+", label: "Happy Customers" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <p className="font-serif text-3xl md:text-4xl text-primary">{stat.num}</p>
            <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
