"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/site-content-store";

export default function FAQAccordion({ faqs }: { faqs: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border border-border px-6">
          <AccordionTrigger className="font-serif text-foreground text-left hover:text-primary">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
