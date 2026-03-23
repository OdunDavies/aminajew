import { readProducts, type StoredProduct } from "@/lib/products-store";

export interface Product {
  id: string;
  name: string;
  price: number;
  collection: "rings" | "necklaces" | "bracelets" | "earrings";
  material: string;
  description: string;
  image: string;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  sizes?: string[];
}

// Module-level cache — avoids reading on every filter call within one request cycle.
// Cleared by invalidateProductsCache() after any write operation.
let _cache: StoredProduct[] | null = null;

async function getProducts(): Promise<StoredProduct[]> {
  if (!_cache) _cache = await readProducts();
  return _cache;
}

export function invalidateProductsCache(): void {
  _cache = null;
}

function mapRow(row: StoredProduct): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    collection: row.collection,
    material: row.material || "",
    description: row.description || "",
    image: row.image || "",
    images: row.images || [],
    isNew: row.is_new || false,
    isBestSeller: row.is_best_seller || false,
    sizes: row.sizes && row.sizes.length > 0 ? row.sizes : undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  return (await getProducts())
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapRow);
}

export async function fetchProductsByCollection(collection: string): Promise<Product[]> {
  return (await getProducts())
    .filter((p) => p.collection === collection)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapRow);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const product = (await getProducts()).find((p) => p.id === id);
  return product ? mapRow(product) : null;
}

export async function fetchNewArrivals(): Promise<Product[]> {
  return (await getProducts())
    .filter((p) => p.is_new)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapRow);
}

export async function fetchBestSellers(): Promise<Product[]> {
  return (await getProducts())
    .filter((p) => p.is_best_seller)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapRow);
}
