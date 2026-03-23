import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import { readSiteContent } from "@/lib/site-content-store";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about artsybrands in Kuje, Abuja, FCT — our story, craftsmanship philosophy, and commitment to ethically sourced, handcrafted gold jewelry sold by the ounce.",
};

export default function AboutPage() {
  const { about } = readSiteContent();

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${about.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative text-center z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Our Story</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">About artsybrands</h1>
        </div>
      </section>
      <AboutContent paragraphs={about.paragraphs} stats={about.stats} />
    </div>
  );
}
