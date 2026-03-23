import { NextResponse } from "next/server";
import { z } from "zod";
import { readProducts, writeProducts } from "@/lib/products-store";
import { verifyAdmin } from "@/lib/verify-admin";
import { invalidateProductsCache } from "@/data/products";
import fs from "fs";
import path from "path";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  collection: z.enum(["rings", "necklaces", "bracelets", "earrings"]).optional(),
  material: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  image: z.string().max(500).optional(),
  images: z.array(z.string().max(500)).optional(),
  is_new: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  sizes: z.array(z.string().max(20)).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  await writeProducts(products);
  invalidateProductsCache();
  return NextResponse.json(products[index]);
}

export async function DELETE(_request: Request, { params }: Params) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const products = await readProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Clean up uploaded image files
  const uploadsDir = path.join(process.cwd(), "public");
  const filesToDelete = [product.image, ...product.images].filter(
    (url) => url && url.startsWith("/uploads/")
  );
  for (const url of filesToDelete) {
    try {
      fs.unlinkSync(path.join(uploadsDir, url));
    } catch {
      // File may already be gone — ignore
    }
  }

  await writeProducts(products.filter((p) => p.id !== id));
  invalidateProductsCache();
  return NextResponse.json({ ok: true });
}
