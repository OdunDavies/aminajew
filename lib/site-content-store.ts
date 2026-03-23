import "server-only";
import fs from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "data", "site-content.json");

export interface BrandHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface BrandSocial {
  instagram: string;
  facebook: string;
  twitter: string;
}

export interface BrandContent {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: BrandHours;
  social: BrandSocial;
}

export interface HeroContent {
  tagline: string;
  heading: string;
  description: string;
  backgroundImage: string;
}

export interface CollectionItem {
  slug: string;
  label: string;
  image: string;
}

export interface StoryContent {
  tagline: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
}

export interface HomepageContent {
  hero: HeroContent;
  collections: CollectionItem[];
  story: StoryContent;
}

export interface Stat {
  num: string;
  label: string;
}

export interface AboutContent {
  heroImage: string;
  paragraphs: string[];
  stats: Stat[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
}

export interface SiteContent {
  brand: BrandContent;
  homepage: HomepageContent;
  about: AboutContent;
  faq: FaqItem[];
  seo: SeoContent;
}

const defaultContent: SiteContent = {
  brand: {
    name: "artsybrands",
    tagline: "Exquisite jewelry crafted with passion, precision, and the finest materials from around the world.",
    address: "EN 104, Federal Lowcost Housing Estate\nKuje, FCT, Nigeria",
    phone: "09068087189",
    email: "hello@artsybrands.com",
    hours: {
      weekdays: "Mon - Fri: 10am - 7pm",
      saturday: "Sat: 10am - 5pm",
      sunday: "Sun: Closed",
    },
    social: { instagram: "", facebook: "", twitter: "" },
  },
  homepage: {
    hero: {
      tagline: "Timeless Elegance",
      heading: "Where Luxury Meets Artistry",
      description: "Discover handcrafted jewelry pieces that tell your unique story, forged with passion and the finest materials.",
      backgroundImage: "https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1920&h=1080&fit=crop",
    },
    collections: [
      { slug: "rings", label: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop" },
      { slug: "necklaces", label: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop" },
      { slug: "bracelets", label: "Bracelets", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=600&fit=crop" },
      { slug: "earrings", label: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop" },
    ],
    story: {
      tagline: "Our Story",
      heading: "Crafted by Hand, Worn With Pride",
      paragraph1: "Every piece at artsybrands is a testament to centuries-old craftsmanship, reimagined for the modern connoisseur. Our artisans dedicate countless hours to perfecting each detail.",
      paragraph2: "From sourcing ethically mined gemstones to hand-polishing every facet, we believe luxury should be as meaningful as it is beautiful.",
      image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=800&fit=crop",
    },
  },
  about: {
    heroImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&h=600&fit=crop",
    paragraphs: [
      "Founded on the belief that jewelry is more than adornment — it's a language of love, a marker of milestones, and an expression of identity. At artsybrands, we marry centuries-old goldsmithing traditions with contemporary design sensibility.",
      "Every gemstone is ethically sourced. Every setting is hand-finished. Every piece undergoes rigorous quality inspection before earning the artsybrands hallmark. We work with master artisans who bring decades of expertise to each creation.",
      "Our commitment extends beyond beauty. We practice responsible sourcing, minimize environmental impact, and support the communities where our materials originate. Luxury, we believe, should leave the world better than it found it.",
    ],
    stats: [],
  },
  faq: [
    { question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout. All orders over ₦500,000 qualify for free standard shipping." },
    { question: "What is your return policy?", answer: "We offer a 30-day hassle-free return policy. Items must be in their original condition with all packaging. Custom or engraved pieces are final sale." },
    { question: "Are your diamonds certified?", answer: "Yes, all diamonds over 0.30 carats come with a GIA or IGI certification. Certificates are included with your purchase." },
    { question: "How should I care for my jewelry?", answer: "Store pieces separately in soft pouches. Clean gently with a soft cloth. Avoid contact with perfume, lotions, and harsh chemicals. We offer complimentary professional cleaning once a year." },
    { question: "Do you offer gift wrapping?", answer: "Every artsybrands purchase comes in our signature gift box with a satin ribbon. Complimentary gift messaging is available at checkout." },
    { question: "Can I customize or engrave a piece?", answer: "Yes! Many of our pieces can be engraved with a personal message. Select the engraving option on the product page or contact us for custom design requests." },
    { question: "What payment methods do you accept?", answer: "We accept all major payment methods through our secure Paystack payment system — cards (Visa, Mastercard, Verve), bank transfers, and USSD." },
    { question: "Do you ship internationally?", answer: "Yes, we ship worldwide. International shipping rates and delivery times vary by destination. Customs duties may apply and are the responsibility of the buyer." },
  ],
  seo: {
    title: "artsybrands — Exquisite Handcrafted Gold Jewelry in Kuje, Abuja",
    description: "Discover handcrafted gold jewelry by the ounce in Kuje, Abuja, FCT. Shop rings, necklaces, bracelets, and earrings forged with passion and the finest materials.",
    keywords: ["gold jewelry", "handcrafted jewelry", "Kuje", "Abuja", "Nigeria", "rings", "necklaces", "bracelets", "earrings"],
    ogImage: "https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&h=630&fit=crop",
  },
};

export function readSiteContent(): SiteContent {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultContent;
  }
}

export function writeSiteContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}
