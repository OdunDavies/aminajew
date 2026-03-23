import { NextResponse } from "next/server";
import { z } from "zod";
import { readProducts, writeProducts, type StoredProduct } from "@/lib/products-store";
import { verifyAdmin } from "@/lib/verify-admin";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  price: z.number().positive("Price must be greater than 0"),
  collection: z.enum(["rings", "necklaces", "bracelets", "earrings"]),
  material: z.string().max(200).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  image: z.string().max(500).optional().default(""),
  images: z.array(z.string().max(500)).optional().default([]),
  is_new: z.boolean().optional().default(false),
  is_best_seller: z.boolean().optional().default(false),
  sizes: z.array(z.string().max(20)).optional().default([]),
});

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const now = new Date().toISOString();
  const product: StoredProduct = {
    id: crypto.randomUUID(),
    ...parsed.data,
    material: parsed.data.material ?? "",
    description: parsed.data.description ?? "",
    image: parsed.data.image ?? "",
    images: parsed.data.images ?? [],
    is_new: parsed.data.is_new ?? false,
    is_best_seller: parsed.data.is_best_seller ?? false,
    sizes: parsed.data.sizes ?? [],
    created_at: now,
    updated_at: now,
  };

  const products = readProducts();
  products.push(product);
  writeProducts(products);

  return NextResponse.json(product, { status: 201 });
}
