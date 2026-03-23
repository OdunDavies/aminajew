import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";
import { readSiteContent } from "@/lib/site-content-store";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with artsybrands in Kuje, Abuja, FCT. Reach out for inquiries about our handcrafted gold jewelry, custom orders, gold by the ounce, or customer support.",
};

export default function ContactPage() {
  const { brand } = readSiteContent();

  const contactDetails = [
    { icon: MapPin, title: "Address", text: brand.address },
    { icon: Phone, title: "Phone", text: brand.phone },
    { icon: Mail, title: "Email", text: brand.email },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Get in Touch</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <ContactForm />

          <div className="space-y-8">
            <h2 className="font-serif text-xl text-foreground mb-6">Visit Us</h2>
            {contactDetails.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <Icon size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{text}</p>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-8 mt-8">
              <h3 className="text-sm text-foreground mb-2">Hours</h3>
              <p className="text-sm text-muted-foreground">{brand.hours.weekdays}</p>
              <p className="text-sm text-muted-foreground">{brand.hours.saturday}</p>
              <p className="text-sm text-muted-foreground">{brand.hours.sunday}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
