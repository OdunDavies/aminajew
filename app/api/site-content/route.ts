import { NextResponse } from "next/server";
import { z } from "zod";
import { readSiteContent, writeSiteContent, type SiteContent } from "@/lib/site-content-store";
import { verifyAdmin } from "@/lib/verify-admin";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

const hoursSchema = z.object({
  weekdays: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});

const socialSchema = z.object({
  instagram: z.string(),
  facebook: z.string(),
  twitter: z.string(),
});

const brandSchema = z.object({
  name: z.string().min(1).max(100),
  tagline: z.string().max(300),
  address: z.string().max(300),
  phone: z.string().max(30),
  email: z.union([z.string().email(), z.literal("")]),
  hours: hoursSchema,
  social: socialSchema,
});

const heroSchema = z.object({
  tagline: z.string().max(100),
  heading: z.string().max(200),
  description: z.string().max(500),
  backgroundImage: z.string(),
});

const collectionItemSchema = z.object({
  slug: z.string(),
  label: z.string(),
  image: z.string(),
});

const storySchema = z.object({
  tagline: z.string().max(100),
  heading: z.string().max(200),
  paragraph1: z.string().max(1000),
  paragraph2: z.string().max(1000),
  image: z.string(),
});

const homepageSchema = z.object({
  hero: heroSchema,
  collections: z.array(collectionItemSchema),
  story: storySchema,
});

const statSchema = z.object({
  num: z.string(),
  label: z.string(),
});

const aboutSchema = z.object({
  heroImage: z.string(),
  paragraphs: z.array(z.string().max(2000)),
  stats: z.array(statSchema),
});

const faqItemSchema = z.object({
  question: z.string().max(300),
  answer: z.string().max(2000),
});

const seoSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(500),
  keywords: z.array(z.string()),
  ogImage: z.string(),
});

const siteContentSchema = z.object({
  brand: brandSchema.optional(),
  homepage: homepageSchema.optional(),
  about: aboutSchema.optional(),
  faq: z.array(faqItemSchema).optional(),
  seo: seoSchema.optional(),
});

export async function PUT(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = siteContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const current = await readSiteContent();
  const b = parsed.data.brand;
  const h = parsed.data.homepage;
  const a = parsed.data.about;
  const s = parsed.data.seo;

  const updated: SiteContent = {
    brand: b
      ? {
          name: b.name,
          tagline: b.tagline,
          address: b.address,
          phone: b.phone,
          email: b.email,
          hours: {
            weekdays: b.hours.weekdays,
            saturday: b.hours.saturday,
            sunday: b.hours.sunday,
          },
          social: {
            instagram: b.social.instagram,
            facebook: b.social.facebook,
            twitter: b.social.twitter,
          },
        }
      : current.brand,
    homepage: h
      ? { hero: h.hero, collections: h.collections, story: h.story }
      : current.homepage,
    about: a
      ? { heroImage: a.heroImage, paragraphs: a.paragraphs, stats: a.stats }
      : current.about,
    faq: parsed.data.faq ?? current.faq,
    seo: s
      ? { title: s.title, description: s.description, keywords: s.keywords, ogImage: s.ogImage }
      : current.seo,
  };

  await writeSiteContent(updated);
  return NextResponse.json({ ok: true });
}
