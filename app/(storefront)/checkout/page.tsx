"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { validateCheckoutForm } from "@/lib/validation";

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", price: 0, estimate: "5-7 business days" },
  { id: "express", label: "Express Shipping", price: 5000, estimate: "2-3 business days" },
  { id: "overnight", label: "Overnight Shipping", price: 10000, estimate: "Next business day" },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const [shipping, setShipping] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const shippingCost = shippingOptions.find((o) => o.id === shipping)?.price || 0;
  const total = subtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePay = async () => {
    const result = validateCheckoutForm(form);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setLoading(true);
    try {
      const callbackUrl = `${siteUrl}/payment/verify`;

      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.data.email,
          amount: total,
          callback_url: callbackUrl,
          metadata: {
            customer_name: result.data.name,
            customer_email: result.data.email,
            customer_phone: result.data.phone,
            shipping_address: result.data.address,
            items: items.map((i) => ({
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
            })),
            subtotal,
            shipping_cost: shippingCost,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment");

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center px-6">
        <h1 className="font-serif text-2xl text-foreground mb-4">Your cart is empty</h1>
        <Link href="/collections" className="text-primary text-sm hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <Link href="/collections" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={14} /> Back to shopping
        </Link>
        <h1 className="font-serif text-3xl text-foreground text-center mb-12">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Form */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="name" className="text-xs tracking-wider uppercase">Full Name *</Label>
                  <Input id="name" value={form.name} onChange={handleChange} className="bg-background" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="email" className="text-xs tracking-wider uppercase">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange} className="bg-background" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="phone" className="text-xs tracking-wider uppercase">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={handleChange} className="bg-background" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-xs tracking-wider uppercase">Address *</Label>
                  <Input id="address" value={form.address} onChange={handleChange} className="bg-background" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      shipping === opt.id ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id)}
                        className="accent-[hsl(var(--primary))]"
                      />
                      <div>
                        <p className="text-sm text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.estimate}</p>
                      </div>
                    </div>
                    <span className="text-sm text-foreground">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.15em] uppercase text-xs py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">Secured by Paystack</p>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-secondary p-6 sticky top-28">
              <h2 className="font-serif text-lg text-foreground mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-foreground font-serif text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
