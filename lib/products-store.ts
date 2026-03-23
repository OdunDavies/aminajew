import "server-only";
import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

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

export function readProducts(): StoredProduct[] {
  try {
    const content = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(content) as StoredProduct[];
  } catch {
    return [];
  }
}

export function writeProducts(products: StoredProduct[]): void {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}
