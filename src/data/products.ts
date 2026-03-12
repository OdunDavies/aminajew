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

const jewelryImages = {
  rings: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&h=600&fit=crop",
  ],
  necklaces: [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
  ],
  bracelets: [
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602752250015-52934bc45613?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
  ],
  earrings: [
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=600&fit=crop",
  ],
};

export const products: Product[] = [
  // Rings
  { id: "r1", name: "Eternal Gold Band", price: 1250, category: "rings", material: "18K Gold", description: "A timeless band crafted from polished 18-karat gold, designed for everyday elegance.", image: jewelryImages.rings[0], images: jewelryImages.rings, isBestSeller: true, sizes: ["5", "6", "7", "8", "9"] },
  { id: "r2", name: "Diamond Solitaire", price: 3800, category: "rings", material: "Platinum & Diamond", description: "A stunning solitaire ring featuring a brilliant-cut diamond set in platinum.", image: jewelryImages.rings[1], images: jewelryImages.rings, isNew: true, sizes: ["5", "6", "7", "8"] },
  { id: "r3", name: "Rose Gold Twist", price: 890, category: "rings", material: "Rose Gold", description: "An elegant twisted design in warm rose gold, perfect for stacking.", image: jewelryImages.rings[2], images: jewelryImages.rings, sizes: ["5", "6", "7", "8", "9"] },
  { id: "r4", name: "Sapphire Halo Ring", price: 4200, category: "rings", material: "White Gold & Sapphire", description: "A magnificent sapphire surrounded by a halo of pavé diamonds.", image: jewelryImages.rings[3], images: jewelryImages.rings, isNew: true, sizes: ["5", "6", "7", "8"] },

  // Necklaces
  { id: "n1", name: "Pearl Drop Pendant", price: 680, category: "necklaces", material: "Sterling Silver & Pearl", description: "A luminous freshwater pearl suspended from a delicate silver chain.", image: jewelryImages.necklaces[0], images: jewelryImages.necklaces, isBestSeller: true },
  { id: "n2", name: "Gold Chain Layered", price: 1450, category: "necklaces", material: "14K Gold", description: "A set of three layered chains in 14-karat gold for effortless sophistication.", image: jewelryImages.necklaces[1], images: jewelryImages.necklaces, isNew: true },
  { id: "n3", name: "Emerald Choker", price: 2900, category: "necklaces", material: "Gold & Emerald", description: "A statement choker featuring a cushion-cut emerald on a gold setting.", image: jewelryImages.necklaces[2], images: jewelryImages.necklaces },
  { id: "n4", name: "Diamond Tennis Necklace", price: 7500, category: "necklaces", material: "Platinum & Diamond", description: "An exquisite tennis necklace with over 5 carats of round diamonds.", image: jewelryImages.necklaces[3], images: jewelryImages.necklaces, isBestSeller: true },

  // Bracelets
  { id: "b1", name: "Gold Cuff Bracelet", price: 1100, category: "bracelets", material: "18K Gold", description: "A bold cuff bracelet in hammered 18-karat gold.", image: jewelryImages.bracelets[0], images: jewelryImages.bracelets, isBestSeller: true },
  { id: "b2", name: "Diamond Bangle", price: 3200, category: "bracelets", material: "White Gold & Diamond", description: "A sleek bangle encrusted with channel-set diamonds.", image: jewelryImages.bracelets[1], images: jewelryImages.bracelets, isNew: true },
  { id: "b3", name: "Charm Bracelet", price: 560, category: "bracelets", material: "Sterling Silver", description: "A classic charm bracelet with hand-picked charms.", image: jewelryImages.bracelets[2], images: jewelryImages.bracelets },
  { id: "b4", name: "Rose Gold Bangle Set", price: 780, category: "bracelets", material: "Rose Gold", description: "A trio of slim rose gold bangles, perfect for layering.", image: jewelryImages.bracelets[3], images: jewelryImages.bracelets },

  // Earrings
  { id: "e1", name: "Diamond Stud Earrings", price: 2400, category: "earrings", material: "Platinum & Diamond", description: "Classic round brilliant diamond studs in a platinum four-prong setting.", image: jewelryImages.earrings[0], images: jewelryImages.earrings, isBestSeller: true },
  { id: "e2", name: "Gold Hoop Earrings", price: 650, category: "earrings", material: "14K Gold", description: "Medium-sized hoops in polished 14-karat gold.", image: jewelryImages.earrings[1], images: jewelryImages.earrings },
  { id: "e3", name: "Pearl Drop Earrings", price: 480, category: "earrings", material: "Gold & Pearl", description: "Elegant drop earrings featuring lustrous South Sea pearls.", image: jewelryImages.earrings[2], images: jewelryImages.earrings, isNew: true },
  { id: "e4", name: "Chandelier Earrings", price: 1850, category: "earrings", material: "Gold & Gemstones", description: "Dramatic chandelier earrings with cascading gemstones.", image: jewelryImages.earrings[3], images: jewelryImages.earrings },
];

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);

export const getNewArrivals = () => products.filter((p) => p.isNew);
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
export const getProductById = (id: string) => products.find((p) => p.id === id);
