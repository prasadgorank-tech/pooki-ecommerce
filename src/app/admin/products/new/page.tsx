"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, Package, Tag, Image as ImageIcon,
  Search, Code2, Info, ChevronRight, Percent, BarChart3
} from "lucide-react";

const CATEGORIES = ["Tees", "Bottoms", "Fleece", "Outerwear", "Tops", "Accessories"];
const FITS = ["Oversized", "Baggy", "Slim", "Regular"];
const TABS = [
  { key: "basic", label: "Basic Info", icon: Package },
  { key: "pricing", label: "Pricing & Stock", icon: Tag },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "seo", label: "SEO", icon: Search },
  { key: "schema", label: "Schema / Structured Data", icon: Code2 },
];

const INPUT = "w-full bg-transparent border border-[var(--color-border)] p-3 text-sm outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--color-muted)]";
const LABEL = "block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1.5";
const HINT = "text-[10px] text-[var(--color-muted)] mt-1";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function generateSchema(form: any) {
  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": form.name,
    "description": form.description || form.seo_description,
    "sku": form.sku,
    "image": form.image_url,
    "brand": { "@type": "Brand", "name": "Pooki" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": form.is_on_sale && form.sale_price ? form.sale_price : form.price,
      "availability": form.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://yoursite.com/product/${form.seo_slug}`
    },
    "category": form.category,
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Fit", "value": form.fit },
      { "@type": "PropertyValue", "name": "Material", "value": form.material }
    ]
  }, null, 2);
}

export default function NewProduct() {
  const router = useRouter();
  const [tab, setTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    // Basic
    name: "", category: "Tees", fit: "Oversized",
    description: "", material: "", care_instructions: "",
    sku: "", tags: "",
    // Pricing
    price: "", sale_price: "", is_on_sale: false,
    stock: "", track_inventory: true,
    // Flags
    is_drop: false, is_active: true, is_featured: false,
    // Media
    image_url: "", image_url_2: "", image_url_3: "", image_url_4: "",
    // SEO
    seo_title: "", seo_description: "", seo_slug: "", seo_keywords: "",
    // Schema
    schema_json: "",
  });

  const set = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name && !form.seo_slug) set("seo_slug", slugify(form.name));
    if (form.name && !form.seo_title) set("seo_title", `${form.name} | Pooki`);
  }, [form.name]);

  // Auto-generate schema when key fields change
  useEffect(() => {
    if (form.name && form.price) {
      set("schema_json", generateSchema(form));
    }
  }, [form.name, form.price, form.sale_price, form.is_on_sale, form.stock, form.seo_slug, form.image_url, form.description, form.material, form.fit, form.category, form.sku, form.seo_description]);

  const discountPct = form.price && form.sale_price
    ? Math.round(((parseFloat(form.price) - parseFloat(form.sale_price)) / parseFloat(form.price)) * 100)
    : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Product name is required";
    if (!form.price) e.price = "Price is required";
    if (form.is_on_sale && !form.sale_price) e.sale_price = "Enter offer price";
    if (form.is_on_sale && parseFloat(form.sale_price) >= parseFloat(form.price)) e.sale_price = "Offer price must be less than MRP";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { setTab("basic"); return; }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock: parseInt(form.stock) || 0,
      image_url: form.image_url || "/images/product1.png",
    };
    const { error } = await supabase.from("admin_products").insert(payload);
    setSaving(false);
    if (!error) {
      router.push("/admin/products");
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20">
      {/* Top Bar */}
      <div className="bg-[var(--background)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-black uppercase tracking-widest text-sm">Add New Product</span>
          {form.name && <ChevronRight size={14} className="text-[var(--color-muted)]" />}
          {form.name && <span className="text-xs text-[var(--color-muted)] truncate max-w-48">{form.name}</span>}
        </div>
        <button
          id="save-product-btn"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Product</>}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Tabs */}
          <div className="lg:w-52 flex-shrink-0">
            <nav className="bg-[var(--background)] border border-[var(--color-border)] overflow-hidden">
              {TABS.map(t => (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest border-b border-[var(--color-border)] last:border-0 transition-all ${
                    tab === t.key
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "hover:bg-[var(--color-secondary)] text-[var(--foreground)]"
                  }`}
                >
                  <t.icon size={14} />
                  <span className="text-left leading-tight">{t.label}</span>
                </button>
              ))}
            </nav>

            {/* Status flags */}
            <div className="bg-[var(--background)] border border-[var(--color-border)] p-4 mt-4 space-y-3">
              <p className={LABEL}>Visibility</p>
              {[
                { key: "is_active", label: "Active (visible on site)" },
                { key: "is_drop", label: "🔥 Limited Drop" },
                { key: "is_featured", label: "⭐ Featured" },
                { key: "is_on_sale", label: "🏷 On Sale" },
              ].map(flag => (
                <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[flag.key as keyof typeof form] as boolean}
                    onChange={e => set(flag.key, e.target.checked)}
                    className="w-4 h-4 accent-[var(--foreground)]"
                  />
                  <span className="text-xs font-bold">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* ── BASIC INFO ── */}
            {tab === "basic" && (
              <div className="bg-[var(--background)] border border-[var(--color-border)] p-6 space-y-5">
                <h2 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2"><Package size={16} /> Basic Information</h2>

                <div>
                  <label className={LABEL}>Product Name *</label>
                  <input id="field-name" type="text" className={INPUT + (errors.name ? " border-red-500" : "")}
                    placeholder="e.g. Heavyweight Oversized Tee (Black)"
                    value={form.name} onChange={e => set("name", e.target.value)} />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Category *</label>
                    <select id="field-category" className={INPUT} value={form.category} onChange={e => set("category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Fit *</label>
                    <select id="field-fit" className={INPUT} value={form.fit} onChange={e => set("fit", e.target.value)}>
                      {FITS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Description</label>
                  <textarea id="field-description" rows={4} className={INPUT + " resize-none"}
                    placeholder="Describe the product — fabric, vibe, how it fits..."
                    value={form.description} onChange={e => set("description", e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Material / Fabric</label>
                    <input id="field-material" type="text" className={INPUT} placeholder="100% Heavyweight Cotton, 240gsm"
                      value={form.material} onChange={e => set("material", e.target.value)} />
                  </div>
                  <div>
                    <label className={LABEL}>SKU</label>
                    <input id="field-sku" type="text" className={INPUT} placeholder="PKI-TEE-OVS-BLK-001"
                      value={form.sku} onChange={e => set("sku", e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Care Instructions</label>
                  <input id="field-care" type="text" className={INPUT} placeholder="Machine wash cold. Do not tumble dry."
                    value={form.care_instructions} onChange={e => set("care_instructions", e.target.value)} />
                </div>

                <div>
                  <label className={LABEL}>Tags</label>
                  <input id="field-tags" type="text" className={INPUT} placeholder="oversized, black, tee, summer, streetwear"
                    value={form.tags} onChange={e => set("tags", e.target.value)} />
                  <p className={HINT}>Comma-separated. Helps with search and filtering.</p>
                </div>
              </div>
            )}

            {/* ── PRICING & STOCK ── */}
            {tab === "pricing" && (
              <div className="bg-[var(--background)] border border-[var(--color-border)] p-6 space-y-5">
                <h2 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2"><Tag size={16} /> Pricing & Stock</h2>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>MRP / Original Price (₹) *</label>
                    <input id="field-price" type="number" min="0" step="0.01" className={INPUT + (errors.price ? " border-red-500" : "")}
                      placeholder="1999"
                      value={form.price} onChange={e => set("price", e.target.value)} />
                    {errors.price && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.price}</p>}
                  </div>
                  <div>
                    <label className={LABEL}>
                      Sale / Offer Price (₹)
                      {discountPct > 0 && (
                        <span className="ml-2 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-black">
                          {discountPct}% OFF
                        </span>
                      )}
                    </label>
                    <input id="field-sale-price" type="number" min="0" step="0.01"
                      disabled={!form.is_on_sale}
                      className={INPUT + " disabled:opacity-30" + (errors.sale_price ? " border-red-500" : "")}
                      placeholder={form.is_on_sale ? "1499" : "Enable 'On Sale' first"}
                      value={form.sale_price} onChange={e => set("sale_price", e.target.value)} />
                    {errors.sale_price && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.sale_price}</p>}
                  </div>
                </div>

                {/* Visual price preview */}
                {form.price && (
                  <div className="border border-[var(--color-border)] p-4 bg-[var(--color-secondary)]/30">
                    <p className={LABEL}>Preview on Product Page</p>
                    <div className="flex items-center gap-3 mt-2">
                      {form.is_on_sale && form.sale_price ? (
                        <>
                          <span className="text-2xl font-black text-[var(--color-accent)]">₹{parseFloat(form.sale_price).toLocaleString()}</span>
                          <span className="text-lg line-through text-[var(--color-muted)]">₹{parseFloat(form.price).toLocaleString()}</span>
                          <span className="bg-[var(--color-accent)] text-white text-xs font-black px-2 py-1">{discountPct}% OFF</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black">₹{parseFloat(form.price || "0").toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Stock Quantity</label>
                    <input id="field-stock" type="number" min="0" className={INPUT} placeholder="100"
                      value={form.stock} onChange={e => set("stock", e.target.value)} />
                    <p className={HINT}>Shows "Low Stock" warning when under 10 units.</p>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="track-inventory" checked={form.track_inventory}
                      onChange={e => set("track_inventory", e.target.checked)} className="w-4 h-4 accent-[var(--foreground)]" />
                    <label htmlFor="track-inventory" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Track Inventory</label>
                  </div>
                </div>
              </div>
            )}

            {/* ── MEDIA ── */}
            {tab === "media" && (
              <div className="bg-[var(--background)] border border-[var(--color-border)] p-6 space-y-5">
                <h2 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2"><ImageIcon size={16} /> Product Images</h2>
                <p className="text-xs text-[var(--color-muted)]">Add up to 4 image URLs. Use your own hosted images or Supabase Storage URLs.</p>

                {[
                  { key: "image_url", label: "Main Image (Required)", placeholder: "/images/product1.png" },
                  { key: "image_url_2", label: "Image 2", placeholder: "https://..." },
                  { key: "image_url_3", label: "Image 3", placeholder: "https://..." },
                  { key: "image_url_4", label: "Image 4", placeholder: "https://..." },
                ].map(img => (
                  <div key={img.key} className="grid grid-cols-[1fr_80px] gap-4 items-start">
                    <div>
                      <label className={LABEL}>{img.label}</label>
                      <input id={`field-${img.key}`} type="text" className={INPUT} placeholder={img.placeholder}
                        value={(form as any)[img.key]} onChange={e => set(img.key, e.target.value)} />
                    </div>
                    <div className="pt-5">
                      {(form as any)[img.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(form as any)[img.key]} alt="" className="w-full aspect-square object-cover border border-[var(--color-border)]"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-full aspect-square bg-[var(--color-secondary)] border border-dashed border-[var(--color-border)] flex items-center justify-center">
                          <ImageIcon size={16} className="text-[var(--color-muted)]" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="border border-[var(--color-border)] p-4 bg-blue-50/50 text-xs text-[var(--color-muted)] space-y-1">
                  <p className="font-bold text-[var(--foreground)] flex items-center gap-1"><Info size={12} /> Quick tip</p>
                  <p>Use our local images: <code>/images/product1.png</code>, <code>/images/product2.png</code>, <code>/images/product3.png</code>, <code>/images/product4.png</code></p>
                  <p>Or upload to <strong>Supabase Storage</strong> and paste the public URL.</p>
                </div>
              </div>
            )}

            {/* ── SEO ── */}
            {tab === "seo" && (
              <div className="bg-[var(--background)] border border-[var(--color-border)] p-6 space-y-5">
                <h2 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2"><Search size={16} /> SEO Settings</h2>
                <p className="text-xs text-[var(--color-muted)]">Control how this product appears on Google. Auto-filled from product name — customize as needed.</p>

                <div>
                  <label className={LABEL}>SEO Title (Meta Title)</label>
                  <input id="field-seo-title" type="text" className={INPUT} maxLength={60}
                    placeholder="Heavyweight Oversized Tee (Black) | Pooki"
                    value={form.seo_title} onChange={e => set("seo_title", e.target.value)} />
                  <p className={HINT}>{form.seo_title.length}/60 characters · Keep under 60 for Google.</p>
                </div>

                <div>
                  <label className={LABEL}>SEO Description (Meta Description)</label>
                  <textarea id="field-seo-desc" rows={3} className={INPUT + " resize-none"} maxLength={160}
                    placeholder="Premium 240gsm heavyweight oversized black tee by Pooki. Free shipping India-wide. Agent-first streetwear."
                    value={form.seo_description} onChange={e => set("seo_description", e.target.value)} />
                  <p className={HINT}>{form.seo_description.length}/160 characters · Keep under 160 for Google.</p>
                </div>

                <div>
                  <label className={LABEL}>URL Slug</label>
                  <div className="flex items-center border border-[var(--color-border)] focus-within:border-[var(--foreground)] transition-colors">
                    <span className="px-3 py-3 text-xs text-[var(--color-muted)] bg-[var(--color-secondary)] border-r border-[var(--color-border)] whitespace-nowrap">
                      yoursite.com/product/
                    </span>
                    <input id="field-slug" type="text" className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                      placeholder="heavyweight-oversized-tee-black"
                      value={form.seo_slug} onChange={e => set("seo_slug", slugify(e.target.value))} />
                  </div>
                  <p className={HINT}>Auto-generated from product name. Only lowercase letters, numbers and hyphens.</p>
                </div>

                <div>
                  <label className={LABEL}>Focus Keywords</label>
                  <input id="field-keywords" type="text" className={INPUT}
                    placeholder="oversized tee india, black streetwear tshirt, premium cotton tee"
                    value={form.seo_keywords} onChange={e => set("seo_keywords", e.target.value)} />
                  <p className={HINT}>Comma separated. Use phrases your customers search for on Google.</p>
                </div>

                {/* Google Preview */}
                {(form.seo_title || form.name) && (
                  <div className="border border-[var(--color-border)] p-4 space-y-1">
                    <p className={LABEL + " mb-3"}>Google Search Preview</p>
                    <p className="text-[#1a0dab] text-sm font-normal hover:underline cursor-pointer">
                      {form.seo_title || `${form.name} | Pooki`}
                    </p>
                    <p className="text-[#006621] text-xs">yoursite.com › product › {form.seo_slug || slugify(form.name)}</p>
                    <p className="text-[#545454] text-xs leading-relaxed">
                      {form.seo_description || form.description || "Add a meta description for this product to improve click-through rate from Google."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── SCHEMA ── */}
            {tab === "schema" && (
              <div className="bg-[var(--background)] border border-[var(--color-border)] p-6 space-y-5">
                <h2 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2"><Code2 size={16} /> Schema / Structured Data</h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Schema markup helps Google show rich results (star ratings, price, availability) directly in search. Auto-generated based on your product info.
                </p>

                <div className="border border-[var(--color-border)] p-4 bg-[var(--color-secondary)]/30 space-y-2">
                  <p className={LABEL + " mb-2 flex items-center gap-1"}><BarChart3 size={10} /> What this enables on Google</p>
                  {[
                    "💰 Price shown directly in search results",
                    "✅ In Stock / Out of Stock label",
                    "🏷 Sale price vs original price",
                    "🛍 Product rich snippet with brand name",
                    "📦 Product category & fit in structured data"
                  ].map(item => (
                    <p key={item} className="text-xs text-[var(--color-muted)]">{item}</p>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className={LABEL + " mb-0"}>Schema JSON-LD (Auto-generated)</label>
                    <button
                      type="button"
                      onClick={() => set("schema_json", generateSchema(form))}
                      className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] underline underline-offset-2"
                    >
                      Regenerate
                    </button>
                  </div>
                  <textarea
                    id="field-schema"
                    rows={18}
                    className={INPUT + " resize-none font-mono text-xs"}
                    value={form.schema_json}
                    onChange={e => set("schema_json", e.target.value)}
                  />
                  <p className={HINT}>This JSON-LD is automatically injected into the product page &lt;head&gt;.</p>
                </div>

                <div className="border border-[var(--color-border)] p-4 bg-blue-50/50 text-xs text-[var(--color-muted)]">
                  <p className="font-bold text-[var(--foreground)] mb-1 flex items-center gap-1"><Info size={12} /> Test your schema</p>
                  <p>After publishing, test at: <a href="https://search.google.com/test/rich-results" target="_blank" className="text-blue-600 underline">Google Rich Results Test</a></p>
                </div>
              </div>
            )}

            {/* Save button at bottom */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-4 text-sm hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Product</>}
              </button>
              <Link href="/admin/products" className="px-8 border border-[var(--color-border)] font-black uppercase tracking-widest text-xs flex items-center hover:bg-[var(--color-secondary)] transition-colors">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
