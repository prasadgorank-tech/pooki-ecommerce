"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchProducts, fetchProduct, type Product, effectivePrice, discountPct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Truck, RotateCcw, Shield, ChevronDown, ArrowRight } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductClient({
  initialProduct,
  slug,
}: {
  initialProduct: Product;
  slug: string;
}) {
  const [product] = useState<Product>(initialProduct);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const images = [
    product.image_url,
    product.image_url_2,
    product.image_url_3,
    product.image_url_4,
  ].filter(Boolean) as string[];
  if (images.length === 0) images.push("/images/product1.png");

  const salePrice = effectivePrice(product);
  const pctOff = discountPct(product);
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ id: product.id, title: product.name, price: salePrice, quantity: 1, size: selectedSize, image: product.image_url });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Schema JSON-LD */}
      {product.schema_json && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: product.schema_json }} />
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-[var(--foreground)] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* IMAGE GALLERY */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  id={`product-thumb-${i}`}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i ? "border-[var(--foreground)]" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 aspect-[3/4] bg-[var(--color-secondary)] overflow-hidden">
              <Image src={images[activeImage]} alt={product.name} fill className="object-cover transition-opacity duration-300" priority />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-[var(--color-accent)] text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">{product.fit} Fit</span>
                {pctOff > 0 && <span className="bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">{pctOff}% OFF</span>}
                {product.is_drop && <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">🔥 Limited Drop</span>}
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.3em] mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 leading-none">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black">₹{salePrice.toLocaleString()}</span>
              {product.is_on_sale && product.sale_price && (
                <span className="text-xl line-through text-[var(--color-muted)]">₹{product.price.toLocaleString()}</span>
              )}
              {pctOff > 0 && (
                <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 uppercase tracking-wider">Save {pctOff}%</span>
              )}
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-widest">Incl. GST</span>
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-[var(--color-accent)] text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
                ⚡ Only {product.stock} left in stock!
              </p>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-widest">Select Size</span>
                <button className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--foreground)] transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    id={`size-btn-${size}`}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-3 text-xs font-black uppercase tracking-widest border-2 transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                        : "border-[var(--color-border)] hover:border-[var(--foreground)] text-[var(--foreground)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">⚠ Please select a size first</p>}
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className="w-full bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-5 text-sm flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.99] transition-all duration-200 mb-3"
            >
              <ShoppingBag size={16} /> Add to Cart — ₹{salePrice.toLocaleString()}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mb-8 text-center">
              {[
                { icon: Truck, label: "Free Shipping\nOver ₹2999" },
                { icon: RotateCcw, label: "14-Day\nFree Returns" },
                { icon: Shield, label: "Quality\nVerified" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="border border-[var(--color-border)] py-3 px-2 flex flex-col items-center gap-1.5">
                  <Icon size={14} className="text-[var(--color-muted)]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)] leading-tight whitespace-pre-line">{label}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
              {[
                { key: "description", title: "Description", content: product.description || `Premium ${product.fit.toLowerCase()} fit streetwear piece. Made from high-quality materials with superior stitching and craftsmanship.` },
                { key: "details",     title: "Product Details", content: `Category: ${product.category} · Fit: ${product.fit}${product.material ? ` · Material: ${product.material}` : ""}${product.sku ? ` · SKU: ${product.sku}` : ""}` },
                { key: "care",        title: "Care Instructions", content: product.care_instructions || "Machine wash cold. Do not tumble dry. Iron on low heat." },
                { key: "shipping",    title: "Shipping & Returns", content: "Ships within 24 hours India-wide. Free standard shipping on orders above ₹2999. Free returns within 14 days of delivery." },
              ].map(({ key, title, content }) => (
                <div key={key}>
                  <button
                    id={`accordion-${key}`}
                    onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                    className="w-full flex justify-between items-center py-4 text-xs font-black uppercase tracking-widest hover:text-[var(--color-muted)] transition-colors"
                  >
                    {title}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openAccordion === key ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === key && <p className="text-[var(--color-muted)] text-xs leading-relaxed pb-4">{content}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.3em] mb-1">More Like This</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter">You May Also Like</h2>
            </div>
            <Link href="/collections/all" className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors group">
              View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map(p => {
              const ep = effectivePrice(p);
              const dp = discountPct(p);
              return (
                <Link key={p.id} href={`/product/${p.seo_slug || p.id}`} id={`related-${p.id}`} className="group block">
                  <div className="aspect-[3/4] relative bg-[var(--color-secondary)] overflow-hidden mb-3">
                    <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    {dp > 0 && <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5">{dp}% OFF</span>}
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-tight leading-tight line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-black text-xs">₹{ep.toLocaleString()}</p>
                    {p.is_on_sale && p.sale_price && <p className="line-through text-[9px] text-[var(--color-muted)]">₹{p.price.toLocaleString()}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
