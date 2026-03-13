import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert(form);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <SEO
        title="Contact Us"
        description="Get in touch with artsybrands. Reach out for inquiries about our handcrafted jewelry, custom orders, or customer support."
      />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Get in Touch</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-xl text-foreground mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs tracking-wider uppercase">Name</Label>
                <Input id="name" className="bg-background" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs tracking-wider uppercase">Email</Label>
                <Input id="email" type="email" className="bg-background" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs tracking-wider uppercase">Subject</Label>
                <Input id="subject" className="bg-background" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs tracking-wider uppercase">Message</Label>
                <Textarea id="message" rows={5} className="bg-background resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.15em] uppercase text-xs py-6" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <h2 className="font-serif text-xl text-foreground mb-6">Visit Us</h2>
            {[
              { icon: MapPin, title: "Address", text: "123 Luxury Lane\nNew York, NY 10001" },
              { icon: Phone, title: "Phone", text: "+1 (555) 123-4567" },
              { icon: Mail, title: "Email", text: "hello@artsybrands.com" },
            ].map(({ icon: Icon, title, text }) => (
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
              <p className="text-sm text-muted-foreground">Mon - Fri: 10am - 7pm</p>
              <p className="text-sm text-muted-foreground">Sat: 10am - 5pm</p>
              <p className="text-sm text-muted-foreground">Sun: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
