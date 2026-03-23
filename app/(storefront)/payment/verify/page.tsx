"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const { clearCart } = useCart();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/payment/verify?reference=${encodeURIComponent(reference)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error ?? "Verification failed");

        if (json.data?.status === "success") {
          setStatus("success");
          clearCart();

          // Fire-and-forget order notification email
          const meta = json.data.metadata ?? {};
          fetch("/api/payment/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference,
              customerName: meta.customer_name ?? json.data.customer?.first_name ?? "Customer",
              customerEmail: meta.customer_email ?? json.data.customer?.email ?? "",
              customerPhone: meta.customer_phone ?? json.data.customer?.phone ?? "",
              address: meta.shipping_address ?? "",
              items: meta.items ?? [],
              total: json.data.amount / 100,
            }),
          }).catch(() => {});
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    verify();
  }, [reference, clearCart]);

  return (
    <div className="text-center max-w-md">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-foreground mb-2">Verifying Payment</h1>
          <p className="text-muted-foreground text-sm">Please wait while we confirm your payment...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm mb-2">
            Thank you for your order. We&apos;ll send you a confirmation email shortly.
          </p>
          <p className="text-xs text-muted-foreground mb-8">Reference: {reference}</p>
          <Link href="/collections">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.1em] uppercase text-xs">
              Continue Shopping
            </Button>
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-foreground mb-2">Payment Failed</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Something went wrong with your payment. Please try again.
          </p>
          <Link href="/checkout">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.1em] uppercase text-xs">
              Back to Checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-6 flex items-start justify-center">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      }>
        <PaymentVerifyContent />
      </Suspense>
    </div>
  );
}
