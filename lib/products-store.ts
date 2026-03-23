import "server-only";
import fs from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const BLOB_STORE = "cms";
const BLOB_KEY = "products";

export interface StoredProduct {
  id: string;
  name: string;
  price: number;
  collection: "rings" | "necklaces" | "bracelets" | "earrings";
  material: string;
  description: string;
  image: string;
  images: string[];
  is_new: boolean;
  is_best_seller: boolean;
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export async function readProducts(): Promise<StoredProduct[]> {
  // Try Netlify Blobs first (production)
  try {
    const store = getStore({ name: BLOB_STORE, consistency: "strong" });
    const products = await store.get(BLOB_KEY, { type: "json" });
    if (products) return products as StoredProduct[];
  } catch {
    // Not on Netlify — fall through to file system
  }

  // Fall back to committed JSON file (local dev or first deploy seed)
  try {
    const content = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(content) as StoredProduct[];
  } catch {
    return [];
  }
}

export async function writeProducts(products: StoredProduct[]): Promise<void> {
  // Try Netlify Blobs first (production)
  try {
    const store = getStore({ name: BLOB_STORE, consistency: "strong" });
    await store.setJSON(BLOB_KEY, products);
    return;
  } catch {
    // Not on Netlify — fall through to file system
  }

  // Fall back to file system (local dev)
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}
