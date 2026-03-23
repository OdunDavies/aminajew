import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <CartDrawer />
      <Footer />
    </>
  );
}
