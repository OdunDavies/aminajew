import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", price: 0, estimate: "5-7 business days" },
  { id: "express", label: "Express Shipping", price: 5000, estimate: "2-3 business days" },
  { id: "overnight", label: "Overnight Shipping", price: 10000, estimate: "Next business day" },
];

const Checkout = () => {
  const { items, subtotal } = useCart();
  const [shipping, setShipping] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", country: "Nigeria",
  });

  const shippingCost = shippingOptions.find((o) => o.id === shipping)?.price || 0;
  const total = subtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePay = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/payment/verify`;

      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          email: form.email,
          amount: total,
          callback_url: callbackUrl,
          metadata: {
            customer_name: `${form.firstName} ${form.lastName}`,
            customer_email: form.email,
            customer_phone: form.phone,
            shipping_address: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
            shipping_address_obj: {
              address: form.address,
              city: form.city,
              zip: form.zip,
              country: form.country,
            },
            items: items.map((i) => ({
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
            })),
            subtotal,
            shipping_cost: shippingCost,
          },
        },
      });

      if (error) throw error;

      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center px-6">
        <SEO title="Checkout" description="Complete your artsybrands gold jewelry purchase securely from Kuje, Abuja, FCT." />
        <h1 className="font-serif text-2xl text-foreground mb-4">Your cart is empty</h1>
        <Link to="/collections" className="text-primary text-sm hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <SEO title="Checkout" description="Complete your artsybrands gold jewelry purchase securely from Kuje, Abuja, FCT." />
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl text-foreground text-center mb-12">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Form */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs tracking-wider uppercase">First Name *</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs tracking-wider uppercase">Last Name *</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange} className="bg-background" />
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
                <div className="sm:col-span-1 space-y-2">
                  <Label htmlFor="city" className="text-xs tracking-wider uppercase">City *</Label>
                  <Input id="city" value={form.city} onChange={handleChange} className="bg-background" />
                </div>
                <div className="sm:col-span-1 space-y-2">
                  <Label htmlFor="zip" className="text-xs tracking-wider uppercase">Zip Code</Label>
                  <Input id="zip" value={form.zip} onChange={handleChange} className="bg-background" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="country" className="text-xs tracking-wider uppercase">Country</Label>
                  <Input id="country" value={form.country} onChange={handleChange} className="bg-background" />
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
                    <span className="text-sm text-foreground">{opt.price === 0 ? "Free" : `₦${opt.price.toLocaleString()}`}</span>
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
                `Pay ₦${total.toLocaleString()}`
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
                    <p className="text-sm text-foreground">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₦${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-foreground font-serif text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
