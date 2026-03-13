import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout. All orders over $500 qualify for free standard shipping." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be in their original condition with all packaging. Custom or engraved pieces are final sale." },
  { q: "Are your diamonds certified?", a: "Yes, all diamonds over 0.30 carats come with a GIA or IGI certification. Certificates are included with your purchase." },
  { q: "How should I care for my jewelry?", a: "Store pieces separately in soft pouches. Clean gently with a soft cloth. Avoid contact with perfume, lotions, and harsh chemicals. We offer complimentary professional cleaning once a year." },
  { q: "Do you offer gift wrapping?", a: "Every artsybrands purchase comes in our signature gift box with a satin ribbon. Complimentary gift messaging is available at checkout." },
  { q: "Can I customize or engrave a piece?", a: "Yes! Many of our pieces can be engraved with a personal message. Select the engraving option on the product page or contact us for custom design requests." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) through our secure Stripe payment system. Apple Pay and Google Pay are also available." },
  { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International shipping rates and delivery times vary by destination. Customs duties may apply and are the responsibility of the buyer." },
];

const FAQ = () => (
  <div className="min-h-screen pt-24 pb-16 px-6">
    <div className="container mx-auto max-w-2xl">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Help Center</p>
        <h1 className="font-serif text-3xl md:text-5xl text-foreground">Frequently Asked Questions</h1>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border px-6">
            <AccordionTrigger className="font-serif text-foreground text-left hover:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default FAQ;
