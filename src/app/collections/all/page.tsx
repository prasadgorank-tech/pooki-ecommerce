"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts, type Product, effectivePrice, discountPct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, SlidersHorizontal, X, Heart, Loader2 } from "lucide-react";

// Map URL ?cat= slugs → product category/fit names
const CAT_MAP: Record<string, { category?: string; fit?: string }> = {
  "tees":       { category: "Tees" },
  "shirts":     { category: "Tops" },
  "cargo-pants":{ category: "Bottoms", fit: "Baggy" },
  "jeans":      { category: "Bottoms" },
  "trousers":   { category: "Bottoms" },
  "shorts":     { category: "Bottoms" },
  "overshirt":  { category: "Tops" },
  "fleece":     { category: "Fleece" },
  "outerwear":  { category: "Outerwear" },
  "plus-size":  {},
  "sunglasses": { category: "Accessories" },
  "perfumes":   { category: "Accessories" },
};

const TOP_CHIPS = ["All", "New", "Slim", "Oversized", "Baggy", "Tees", "Bottoms", "Outerwear", "Fleece"];
const FILTER_SECTIONS = [
  { key: "size",     label: "Size",     options: ["XS", "S", "M", "L", "XL", "XXL"] },
  { key: "color",    label: "Color",    options: ["Black", "White", "Grey", "Navy", "Sand", "Olive", "Rust", "Charcoal"] },
  { key: "fit",      label: "Fit",      options: ["Oversized", "Baggy", "Slim", "Regular"] },
  { key: "material", label: "Material", options: ["Cotton", "Denim", "Fleece", "Nylon", "Flannel"] },
  { key: "price",    label: "Price",    options: ["Under ₹1,000", "₹1,000 – ₹2,000", "₹2,000 – ₹3,500", "Above ₹3,500"] },
  { key: "sale",     label: "Offers",   options: ["On Sale", "Limited Drop", "Featured"] },
];

type Filters = { size: string[]; color: string[]; fit: string[]; material: string[]; price: string[]; sale: string[] };
const EMPTY: Filters = { size: [], color: [], fit: [], material: [], price: [], sale: [] };

function priceMatch(price: number, range: string) {
  if (range === "Under ₹1,000")      return price < 1000;
  if (range === "₹1,000 – ₹2,000")  return price >= 1000 && price <= 2000;
  if (range === "₹2,000 – ₹3,500")  return price > 2000 && price <= 3500;
  if (range === "Above ₹3,500")      return price > 3500;
  return true;
}

export default function AllCollections() {
  const searchParams = useSearchParams();
  const catSlug = searchParams.get("cat") || "all";
  const catFilter = CAT_MAP[catSlug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [topChip, setTopChip] = useState("All");
  const [filters, setFilters] = useState<Filters>({ ...EMPTY });
  const [openSections, setOpenSections] = useState(["fit", "price", "sale"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts().then(p => { setProducts(p); setLoading(false); });
  }, []);

  const toggleSection = (key: string) =>
    setOpenSections(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const toggleFilter = (key: keyof Filters, value: string) =>
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value],
    }));

  const clearAll = () => { setFilters({ ...EMPTY }); setTopChip("All"); };
  const totalActive = Object.values(filters).flat().length;

  const filtered = products.filter(p => {
    // Category nav filter (?cat= param)
    if (catFilter) {
      if (catFilter.category && p.category.toLowerCase() !== catFilter.category.toLowerCase()) return false;
      if (catFilter.fit && p.fit.toLowerCase() !== catFilter.fit.toLowerCase()) return false;
    }
    // Chip filter
    const chip = topChip.toLowerCase();
    if (chip !== "all") {
      if (["slim", "oversized", "baggy"].includes(chip) && p.fit.toLowerCase() !== chip) return false;
      if (["tees", "bottoms", "outerwear", "fleece"].includes(chip) && p.category.toLowerCase() !== chip) return false;
    }
    if (filters.fit.length   > 0 && !filters.fit.includes(p.fit)) return false;
    if (filters.price.length > 0 && !filters.price.some(r => priceMatch(effectivePrice(p), r))) return false;
    if (filters.sale.includes("On Sale") && !p.is_on_sale) return false;
    if (filters.sale.includes("Limited Drop") && !p.is_drop) return false;
    if (filters.sale.includes("Featured") && !p.is_featured) return false;
    return true;
  });

  // Label for the page header
  const SLUG_LABELS: Record<string, string> = {
    "all": "All Drops", "tees": "T-Shirts", "shirts": "Shirts",
    "cargo-pants": "Cargo Pants", "jeans": "Jeans", "trousers": "Trousers",
    "shorts": "Shorts", "overshirt": "Overshirt", "fleece": "Fleece",
    "outerwear": "Outerwear", "plus-size": "Plus-Size", "sunglasses": "Sunglasses", "perfumes": "Perfumes",
  };
  const pageTitle = SLUG_LABELS[catSlug] || "All Drops";

  const FilterPanel = () => (
    <div className="w-full">
      <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)] mb-2">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <SlidersHorizontal size={12} /> Filters
          {totalActive > 0 && (
            <span className="bg-[var(--foreground)] text-[var(--background)] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </h3>
      </div>

      {FILTER_SECTIONS.map(section => (
        <div key={section.key} className="border-b border-[var(--color-border)]">
          <button
            id={`filter-toggle-${section.key}`}
            className="w-full flex justify-between items-center py-4 text-xs font-black uppercase tracking-widest hover:text-[var(--color-muted)] transition-colors"
            onClick={() => toggleSection(section.key)}
          >
            {section.label}
            {openSections.includes(section.key) ? <Minus size={12} /> : <Plus size={12} />}
          </button>
          {openSections.includes(section.key) && (
            <div className="pb-4 flex flex-wrap gap-2">
              {section.options.map(opt => {
                const active = (filters[section.key as keyof Filters]).includes(opt);
                return (
                  <button
                    key={opt}
                    id={`filter-${section.key}-${opt.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => toggleFilter(section.key as keyof Filters, opt)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
                      active
                        ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                        : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-4 sticky bottom-0 bg-[var(--background)] pb-2">
        <button id="filter-clear-btn" onClick={clearAll} className="flex-1 border border-[var(--color-border)] py-3 text-xs font-black uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors">
          Clear
        </button>
        <button id="filter-apply-btn" onClick={() => setSidebarOpen(false)} className="flex-1 bg-[var(--foreground)] text-[var(--background)] py-3 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
          Apply ({filtered.length})
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.4em] mb-2">The Vault</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">{pageTitle}</h1>
        </div>
      </div>

      {/* Top Chip Filters */}
      <div className="border-b border-[var(--color-border)] bg-[var(--background)]/95 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
            <button id="mobile-filter-open" onClick={() => setSidebarOpen(true)} className="lg:hidden flex-shrink-0 flex items-center gap-1.5 border border-[var(--color-border)] px-3 py-2 text-xs font-black uppercase tracking-widest mr-2">
              <SlidersHorizontal size={12} />
              Filters {totalActive > 0 && `(${totalActive})`}
            </button>

            {TOP_CHIPS.map(chip => (
              <button
                key={chip}
                id={`top-chip-${chip.toLowerCase()}`}
                onClick={() => setTopChip(chip)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-black uppercase tracking-widest border transition-all duration-200 ${
                  topChip === chip
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {chip}
              </button>
            ))}

            {/* Active filter tags */}
            {Object.entries(filters).flatMap(([key, vals]) =>
              (vals as string[]).map(val => (
                <button key={`${key}-${val}`} onClick={() => toggleFilter(key as keyof Filters, val)}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-[var(--foreground)] text-[var(--background)] px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                  {val} <X size={10} />
                </button>
              ))
            )}

            <span className="ml-auto text-xs text-[var(--color-muted)] font-bold uppercase tracking-widest flex-shrink-0 pl-4">
              {loading ? "Loading..." : `${filtered.length} items`}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-[var(--background)] z-50 shadow-2xl flex flex-col lg:hidden">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
              <span className="font-black uppercase tracking-widest text-sm">Filters</span>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5"><FilterPanel /></div>
          </div>
        </>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-36"><FilterPanel /></div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32 gap-3 text-[var(--color-muted)]">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">Loading products...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-3xl font-black uppercase tracking-tighter mb-3">No Results</p>
                <p className="text-sm text-[var(--color-muted)] mb-6">Try adjusting your filters.</p>
                <button onClick={clearAll} className="bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-8 py-3">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map(product => {
                  const ep = effectivePrice(product);
                  const dp = discountPct(product);
                  return (
                    <div key={product.id} id={`collection-item-${product.id}`} className="group relative">
                      <Link href={`/product/${product.seo_slug || product.id}`} className="block">
                        <div className="aspect-[3/4] relative bg-[var(--color-secondary)] overflow-hidden mb-3">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {dp > 0 && <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5">{dp}% OFF</span>}
                            {product.is_drop && <span className="bg-[var(--color-accent)] text-white text-[9px] font-black px-1.5 py-0.5">🔥 DROP</span>}
                          </div>

                          {/* Wishlist */}
                          <button
                            id={`wishlist-${product.id}`}
                            onClick={e => { e.preventDefault(); setWishlist(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]); }}
                            className="absolute top-3 right-3 p-2 bg-[var(--background)]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart size={14} className={wishlist.includes(product.id) ? "text-[var(--color-accent)] fill-current" : "text-[var(--foreground)]"} />
                          </button>

                          {/* Quick Add */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                              id={`quick-add-${product.id}`}
                              onClick={e => { e.preventDefault(); addToCart({ id: product.id, title: product.name, price: ep, quantity: 1, size: "M", image: product.image_url }); }}
                              className="w-full bg-white text-black font-black uppercase tracking-widest text-[10px] py-2.5 hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                            >
                              Quick Add — M
                            </button>
                          </div>
                        </div>
                      </Link>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2">{product.name}</h3>
                          <p className="text-[var(--color-muted)] text-[10px] mt-0.5 uppercase tracking-wider">{product.fit} Fit</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-xs">₹{ep.toLocaleString()}</p>
                          {product.is_on_sale && product.sale_price && (
                            <p className="line-through text-[9px] text-[var(--color-muted)]">₹{product.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
