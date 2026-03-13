import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary border-t border-border">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-serif text-2xl text-primary mb-4">artsybrands</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Exquisite jewelry crafted with passion, precision, and the finest materials from around the world.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">Collections</h4>
          <div className="flex flex-col gap-2">
            {["Rings", "Necklaces", "Bracelets", "Earrings"].map((c) => (
              <Link key={c} to={`/collections/${c.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">Company</h4>
          <div className="flex flex-col gap-2">
            {[["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"]].map(([label, href]) => (
              <Link key={href} to={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-foreground mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">Subscribe for exclusive offers and new arrivals.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 text-xs tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 text-center">
        <p className="text-xs text-muted-foreground tracking-wider">
          © 2026 artsybrands. All rights reserved. Crafted with love.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
