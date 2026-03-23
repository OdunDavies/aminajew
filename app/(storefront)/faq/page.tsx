import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import { readSiteContent } from "@/lib/site-content-store";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to common questions about artsybrands in Kuje, Abuja, FCT — shipping, returns, gold jewelry care, gold by the ounce, gift wrapping, and payment methods.",
};

export default function FAQPage() {
  const { faq } = readSiteContent();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Help Center</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Frequently Asked Questions</h1>
        </div>
        <FAQAccordion faqs={faq} />
      </div>
    </div>
  );
}
