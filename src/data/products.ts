import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "rings" | "necklaces" | "bracelets" | "earrings";
  material: string;
  description: string;
  image: string;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  sizes?: string[];
}

// Map DB row to Product interface
function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
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
  const { data, error } = await supabase.from("products").select("*").order("created_at");
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("category", category).order("created_at");
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function fetchNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("is_new", true).order("created_at");
  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function fetchBestSellers(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("is_best_seller", true).order("created_at");
  if (error) throw error;
  return (data || []).map(mapRow);
}
