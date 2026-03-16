import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import SEO from "@/components/SEO";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
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
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { reference },
        });

        if (error) throw error;

        if (data?.data?.status === "success") {
          setStatus("success");
          clearCart();
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
    <div className="min-h-screen pt-32 pb-16 px-6 flex items-start justify-center">
      <SEO title="Payment Verification" description="Verifying your payment status." />
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
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <p className="text-xs text-muted-foreground mb-8">Reference: {reference}</p>
            <Link to="/collections">
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
            <Link to="/checkout">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-[0.1em] uppercase text-xs">
                Back to Checkout
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;
