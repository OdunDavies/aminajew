import Link from "next/link";
import { readSiteContent } from "@/lib/site-content-store";

const Footer = async () => {
  const { brand } = await readSiteContent();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-primary mb-4">{brand.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brand.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">Collections</h4>
            <div className="flex flex-col gap-2">
              {["Rings", "Necklaces", "Bracelets", "Earrings"].map((c) => (
                <Link key={c} href={`/collections/${c.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              {[["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-6 space-y-1 text-sm text-muted-foreground">
              <p className="whitespace-pre-line">{brand.address}</p>
              <p>{brand.phone}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center space-y-2">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} {brand.name}. All rights reserved. Crafted with love.
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            <a href="https://www.flaticon.com/free-icons/jewelry" title="jewelry icons" className="hover:text-muted-foreground transition-colors">
              Jewelry icons created by Karyative – Flaticon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
