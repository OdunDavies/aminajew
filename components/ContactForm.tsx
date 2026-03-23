"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Validation error", description: data.error ?? "Something went wrong.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }

    setLoading(false);
  };

  return (
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
        {/* Honeypot */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.15em] uppercase text-xs py-6" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
