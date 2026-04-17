import { supabase } from "@/lib/supabase";

// ── Unified Product Type ──────────────────────────────────────────
export type Product = {
  id: string;
  name: string;
  category: string;
  fit: string;
  price: number;
  sale_price: number | null;
  is_on_sale: boolean;
  image_url: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  description?: string;
  material?: string;
  care_instructions?: string;
  sku?: string;
  tags?: string;
  stock: number;
  is_drop: boolean;
  is_active: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_slug?: string;
  seo_keywords?: string;
  schema_json?: string;
  // computed
  image: string; // alias for image_url for backward-compat
};

// ── Static fallback (demo data) ────────────────────────────────────
const FALLBACK_PRODUCTS: Product[] = [
  { id: "heavyweight-oversized-tee-black", name: "Heavyweight Oversized Tee (Black)", fit: "Oversized", price: 1499, sale_price: null, is_on_sale: false, image_url: "/images/product1.png", image: "/images/product1.png", category: "Tees", stock: 50, is_drop: false, is_active: true, is_featured: true, seo_slug: "heavyweight-oversized-tee-black" },
  { id: "utility-cargo-charcoal", name: "Utility Cargo Pants (Charcoal)", fit: "Baggy", price: 2999, sale_price: null, is_on_sale: false, image_url: "/images/product2.png", image: "/images/product2.png", category: "Bottoms", stock: 30, is_drop: false, is_active: true, is_featured: true, seo_slug: "utility-cargo-charcoal" },
  { id: "minimal-slim-denim-black", name: "Minimal Slim Denim (Black Wash)", fit: "Slim", price: 3499, sale_price: null, is_on_sale: false, image_url: "/images/product3.png", image: "/images/product3.png", category: "Bottoms", stock: 20, is_drop: false, is_active: true, is_featured: false, seo_slug: "minimal-slim-denim-black" },
  { id: "heavyweight-oversized-tee-white", name: "Heavyweight Oversized Tee (White)", fit: "Oversized", price: 1499, sale_price: 1199, is_on_sale: true, image_url: "/images/product4.png", image: "/images/product4.png", category: "Tees", stock: 45, is_drop: false, is_active: true, is_featured: true, seo_slug: "heavyweight-oversized-tee-white" },
  { id: "track-jacket-obsidian", name: "Nylon Track Jacket (Obsidian)", fit: "Baggy", price: 4599, sale_price: null, is_on_sale: false, image_url: "/images/hero.png", image: "/images/hero.png", category: "Outerwear", stock: 15, is_drop: true, is_active: true, is_featured: true, seo_slug: "track-jacket-obsidian" },
  { id: "relaxed-fit-hoodie-ash", name: "Relaxed Fit Hoodie (Ash Grey)", fit: "Oversized", price: 2499, sale_price: null, is_on_sale: false, image_url: "/images/product4.png", image: "/images/product4.png", category: "Fleece", stock: 25, is_drop: false, is_active: true, is_featured: false, seo_slug: "relaxed-fit-hoodie-ash" },
  { id: "pleated-trousers-sand", name: "Pleated Wide Trousers (Sand)", fit: "Baggy", price: 3299, sale_price: null, is_on_sale: false, image_url: "/images/product2.png", image: "/images/product2.png", category: "Bottoms", stock: 18, is_drop: false, is_active: true, is_featured: false, seo_slug: "pleated-trousers-sand" },
  { id: "essential-slim-tee-bone", name: "Essential Slim Tee (Bone)", fit: "Slim", price: 999, sale_price: null, is_on_sale: false, image_url: "/images/product1.png", image: "/images/product1.png", category: "Tees", stock: 60, is_drop: false, is_active: true, is_featured: false, seo_slug: "essential-slim-tee-bone" },
];

// ── Normalize Supabase row → Product ──────────────────────────────
function normalizeProduct(row: any): Product {
  return {
    ...row,
    id: row.seo_slug || row.id, // use slug as ID for URL routing
    image: row.image_url || "/images/product1.png",
    image_url: row.image_url || "/images/product1.png",
    sale_price: row.sale_price ? parseFloat(row.sale_price) : null,
    price: parseFloat(row.price),
    stock: parseInt(row.stock) || 0,
  };
}

// ── Fetch all active products (Supabase → fallback) ────────────────
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("admin_products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
    return data.map(normalizeProduct);
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

// ── Fetch single product by slug or id ───────────────────────────
export async function fetchProduct(slugOrId: string): Promise<Product | null> {
  try {
    // Try Supabase by slug first
    const { data: bySlug } = await supabase
      .from("admin_products")
      .select("*")
      .eq("seo_slug", slugOrId)
      .single();

    if (bySlug) return normalizeProduct(bySlug);

    // Try by UUID id
    const { data: byId } = await supabase
      .from("admin_products")
      .select("*")
      .eq("id", slugOrId)
      .single();

    if (byId) return normalizeProduct(byId);
  } catch { /* fall through */ }

  // Fallback to static data
  const fb = FALLBACK_PRODUCTS.find(p => p.id === slugOrId || p.seo_slug === slugOrId);
  return fb || null;
}

// ── Fetch drop products only ──────────────────────────────────────
export async function fetchDropProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("admin_products")
      .select("*")
      .eq("is_active", true)
      .eq("is_drop", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS.filter(p => p.is_drop);
    }
    return data.map(normalizeProduct);
  } catch {
    return FALLBACK_PRODUCTS.filter(p => p.is_drop);
  }
}

// ── Fetch featured products (for home page) ───────────────────────
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("admin_products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS.filter(p => p.is_featured).slice(0, 8);
    }
    return data.map(normalizeProduct);
  } catch {
    return FALLBACK_PRODUCTS.filter(p => p.is_featured).slice(0, 8);
  }
}

// ── Effective price (sale or regular) ────────────────────────────
export function effectivePrice(p: Product): number {
  return p.is_on_sale && p.sale_price ? p.sale_price : p.price;
}

// ── Discount % ───────────────────────────────────────────────────
export function discountPct(p: Product): number {
  if (!p.is_on_sale || !p.sale_price) return 0;
  return Math.round(((p.price - p.sale_price) / p.price) * 100);
}
