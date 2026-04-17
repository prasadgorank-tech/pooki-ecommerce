"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Upload, Download, CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";

type ParsedProduct = {
  // Basic Info
  name: string;
  category: string;
  fit: string;
  description: string;
  material: string;
  care_instructions: string;
  sku: string;
  tags: string;
  // Pricing
  price: number;
  sale_price: number | null;
  is_on_sale: boolean;
  stock: number;
  track_inventory: boolean;
  // Media
  image_url: string;
  image_url_2: string;
  image_url_3: string;
  image_url_4: string;
  // Flags
  is_drop: boolean;
  is_active: boolean;
  is_featured: boolean;
  // SEO
  seo_title: string;
  seo_description: string;
  seo_slug: string;
  seo_keywords: string;
  // Schema
  schema_json: string;
};

type RowResult = { name: string; status: "success" | "error"; error?: string };

// ── Column definitions ───────────────────────────────────────────────
const COLUMNS = [
  // Basic Info
  { key: "name",              label: "name",              group: "Basic Info",    hint: "Text – Product name (required)",                          example: "Heavyweight Oversized Tee (Black)" },
  { key: "category",          label: "category",          group: "Basic Info",    hint: "Tees / Bottoms / Fleece / Outerwear / Tops / Accessories", example: "Tees" },
  { key: "fit",               label: "fit",               group: "Basic Info",    hint: "Oversized / Baggy / Slim / Regular",                       example: "Oversized" },
  { key: "description",       label: "description",       group: "Basic Info",    hint: "Text – Full product description",                          example: "Premium 240gsm heavyweight cotton tee." },
  { key: "material",          label: "material",          group: "Basic Info",    hint: "Text – Fabric composition",                               example: "100% Heavyweight Cotton, 240gsm" },
  { key: "care_instructions", label: "care_instructions", group: "Basic Info",    hint: "Text – Wash / care guide",                                example: "Machine wash cold. Do not tumble dry." },
  { key: "sku",               label: "sku",               group: "Basic Info",    hint: "Text – Unique product code",                              example: "PKI-TEE-OVS-BLK-001" },
  { key: "tags",              label: "tags",              group: "Basic Info",    hint: "Comma-separated keywords",                                example: "oversized,black,tee,streetwear" },
  // Pricing & Stock
  { key: "price",             label: "price",             group: "Pricing",       hint: "Number – MRP / original price (required)",                example: "1999" },
  { key: "sale_price",        label: "sale_price",        group: "Pricing",       hint: "Number – Offer/sale price (leave blank if no sale)",      example: "1499" },
  { key: "is_on_sale",        label: "is_on_sale",        group: "Pricing",       hint: "true / false",                                            example: "true" },
  { key: "stock",             label: "stock",             group: "Pricing",       hint: "Number – Units in stock",                                 example: "100" },
  { key: "track_inventory",   label: "track_inventory",   group: "Pricing",       hint: "true / false",                                            example: "true" },
  // Media
  { key: "image_url",         label: "image_url",         group: "Media",         hint: "URL – Main product image (required)",                     example: "/images/product1.png" },
  { key: "image_url_2",       label: "image_url_2",       group: "Media",         hint: "URL – Second image (optional)",                           example: "/images/product2.png" },
  { key: "image_url_3",       label: "image_url_3",       group: "Media",         hint: "URL – Third image (optional)",                            example: "" },
  { key: "image_url_4",       label: "image_url_4",       group: "Media",         hint: "URL – Fourth image (optional)",                           example: "" },
  // Visibility Flags
  { key: "is_active",         label: "is_active",         group: "Visibility",    hint: "true / false – Show on site",                             example: "true" },
  { key: "is_drop",           label: "is_drop",           group: "Visibility",    hint: "true / false – Mark as limited drop",                     example: "false" },
  { key: "is_featured",       label: "is_featured",       group: "Visibility",    hint: "true / false – Featured product",                         example: "false" },
  // SEO
  { key: "seo_title",         label: "seo_title",         group: "SEO",           hint: "Text – Meta title (max 60 chars)",                        example: "Heavyweight Oversized Tee (Black) | Pooki" },
  { key: "seo_description",   label: "seo_description",   group: "SEO",           hint: "Text – Meta description (max 160 chars)",                 example: "Premium 240gsm black oversized tee. Free shipping India-wide." },
  { key: "seo_slug",          label: "seo_slug",          group: "SEO",           hint: "Text – URL slug (lowercase, hyphens only)",               example: "heavyweight-oversized-tee-black" },
  { key: "seo_keywords",      label: "seo_keywords",      group: "SEO",           hint: "Comma-separated Google keywords",                         example: "oversized tee india,black streetwear tshirt" },
  // Schema
  { key: "schema_json",       label: "schema_json",       group: "Schema",        hint: "JSON-LD structured data (optional, leave blank to skip)", example: "" },
];

const GROUPS = ["Basic Info", "Pricing", "Media", "Visibility", "SEO", "Schema"];
const GROUP_COLORS: Record<string, string> = {
  "Basic Info":  "bg-blue-50 text-blue-700",
  "Pricing":     "bg-green-50 text-green-700",
  "Media":       "bg-purple-50 text-purple-700",
  "Visibility":  "bg-yellow-50 text-yellow-700",
  "SEO":         "bg-orange-50 text-orange-700",
  "Schema":      "bg-gray-50 text-gray-600",
};

// ── CSV template content ─────────────────────────────────────────────
const CSV_HEADER = COLUMNS.map(c => c.label).join(",");
const CSV_ROW1 = COLUMNS.map(c => c.example.includes(",") ? `"${c.example}"` : c.example).join(",");
const CSV_TEMPLATE = `${CSV_HEADER}\n${CSV_ROW1}`;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function bool(val: string) { return val?.toLowerCase() === "true"; }

function parseCSV(text: string): ParsedProduct[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
  return lines.slice(1).map(line => {
    // Handle quoted values with commas inside
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    values.push(current.trim());

    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });

    const name = obj.name || "Untitled Product";
    const price = parseFloat(obj.price) || 999;
    const salePrice = obj.sale_price ? parseFloat(obj.sale_price) : null;
    const slug = obj.seo_slug || slugify(name);

    return {
      name,
      category: obj.category || "Tees",
      fit: obj.fit || "Oversized",
      description: obj.description || "",
      material: obj.material || "",
      care_instructions: obj.care_instructions || "",
      sku: obj.sku || "",
      tags: obj.tags || "",
      price,
      sale_price: salePrice,
      is_on_sale: bool(obj.is_on_sale) || (salePrice !== null && salePrice < price),
      stock: parseInt(obj.stock) || 0,
      track_inventory: obj.track_inventory ? bool(obj.track_inventory) : true,
      image_url: obj.image_url || "/images/product1.png",
      image_url_2: obj.image_url_2 || "",
      image_url_3: obj.image_url_3 || "",
      image_url_4: obj.image_url_4 || "",
      is_active: obj.is_active ? bool(obj.is_active) : true,
      is_drop: bool(obj.is_drop),
      is_featured: bool(obj.is_featured),
      seo_title: obj.seo_title || `${name} | Pooki`,
      seo_description: obj.seo_description || obj.description || "",
      seo_slug: slug,
      seo_keywords: obj.seo_keywords || "",
      schema_json: obj.schema_json || "",
    };
  });
}

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedProduct[]>([]);
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<RowResult[]>([]);
  const [done, setDone] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Basic Info");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setParseError(""); setResults([]); setDone(false);
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        setPreview(parseCSV(ev.target?.result as string));
      } catch (err: any) {
        setParseError(err.message);
        setPreview([]);
      }
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!preview.length) return;
    setUploading(true);
    const rowResults: RowResult[] = [];
    for (const product of preview) {
      const { error } = await supabase.from("admin_products").insert(product);
      rowResults.push({ name: product.name, status: error ? "error" : "success", error: error?.message });
    }
    setResults(rowResults);
    setDone(true);
    setUploading(false);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "pooki_products_template.csv"; a.click();
  };

  const successCount = results.filter(r => r.status === "success").length;
  const errorCount   = results.filter(r => r.status === "error").length;

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20">
      {/* Top Bar */}
      <div className="bg-[var(--background)] border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-3">
        <Link href="/admin/products" className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <Upload size={18} />
        <span className="font-black uppercase tracking-widest text-sm">Bulk CSV Upload</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Step 1 — Column Reference + Download */}
        <div className="bg-[var(--background)] border border-[var(--color-border)] p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1">Step 1</p>
              <h2 className="text-lg font-black uppercase tracking-tighter mb-1">Download CSV Template</h2>
              <p className="text-xs text-[var(--color-muted)] max-w-lg">
                Open in Excel or Google Sheets. Fill each row = 1 product. <strong>Don't rename column headers.</strong> Scroll right — there are {COLUMNS.length} columns across 6 sections.
              </p>
            </div>
            <button
              id="download-template-btn"
              onClick={downloadTemplate}
              className="flex-shrink-0 flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-5 py-3 hover:opacity-90 transition-opacity"
            >
              <Download size={14} /> Download Template
            </button>
          </div>

          {/* Group tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar mb-4">
            {GROUPS.map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeGroup === g
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--foreground)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Column reference table */}
          <div className="border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--color-secondary)]/60 border-b border-[var(--color-border)]">
                  <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider w-48">Column Name</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider w-56">Example Value</th>
                </tr>
              </thead>
              <tbody>
                {COLUMNS.filter(c => c.group === activeGroup).map((col, i) => (
                  <tr key={col.key} className={`border-b border-[var(--color-border)] ${i % 2 === 0 ? "" : "bg-[var(--color-secondary)]/20"}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-black text-[11px]">{col.label}</code>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 ${GROUP_COLORS[col.group]}`}>{col.group}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[var(--color-muted)]">{col.hint}</td>
                    <td className="px-4 py-2.5">
                      {col.example
                        ? <code className="text-[10px] bg-[var(--color-secondary)] px-1.5 py-0.5">{col.example}</code>
                        : <span className="text-[var(--color-muted)] italic">blank</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--color-muted)]">
            <Info size={11} /> Auto-generated fields: <strong>seo_slug</strong> and <strong>seo_title</strong> are auto-filled from <code>name</code> if left blank. <strong>schema_json</strong> can be left blank.
          </div>
        </div>

        {/* Step 2 — Upload */}
        <div className="bg-[var(--background)] border border-[var(--color-border)] p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1">Step 2</p>
          <h2 className="text-lg font-black uppercase tracking-tighter mb-4">Upload Your CSV File</h2>

          <label
            htmlFor="csv-upload"
            className={`flex flex-col items-center justify-center border-2 border-dashed p-12 cursor-pointer transition-colors ${
              file ? "border-green-500 bg-green-500/5" : "border-[var(--color-border)] hover:border-[var(--foreground)]"
            }`}
          >
            <Upload size={32} className={`mb-3 ${file ? "text-green-500" : "text-[var(--color-muted)]"}`} />
            {file ? (
              <>
                <p className="font-black text-sm">{file.name}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">{preview.length} products parsed — click to change file</p>
              </>
            ) : (
              <>
                <p className="font-black text-sm">Drop your CSV here or click to browse</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Supports .csv files only · {COLUMNS.length} columns supported</p>
              </>
            )}
            <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          {parseError && (
            <div className="mt-3 flex items-center gap-2 text-[var(--color-accent)] text-xs font-bold">
              <AlertCircle size={14} /> {parseError}
            </div>
          )}
        </div>

        {/* Step 3 — Preview */}
        {preview.length > 0 && !done && (
          <div className="bg-[var(--background)] border border-[var(--color-border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1">Step 3</p>
                <h2 className="text-lg font-black uppercase tracking-tighter">Preview & Confirm</h2>
                <p className="text-xs text-[var(--color-muted)]">{preview.length} products ready to upload</p>
              </div>
              <button
                id="confirm-upload-btn"
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {uploading
                  ? <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                  : <><Upload size={14} /> Upload {preview.length} Products</>}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
                    {["#", "Name", "Category", "Fit", "MRP", "Sale Price", "Discount", "Stock", "Drop?", "SEO Slug", "Active"].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider text-[var(--color-muted)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((p, i) => {
                    const discPct = p.sale_price ? Math.round(((p.price - p.sale_price) / p.price) * 100) : 0;
                    return (
                      <tr key={i} className="border-b border-[var(--color-border)] hover:bg-[var(--color-secondary)]/30">
                        <td className="px-3 py-2 text-[var(--color-muted)]">{i + 1}</td>
                        <td className="px-3 py-2 font-bold max-w-[180px] truncate">{p.name}</td>
                        <td className="px-3 py-2 text-[var(--color-muted)]">{p.category}</td>
                        <td className="px-3 py-2 text-[var(--color-muted)]">{p.fit}</td>
                        <td className="px-3 py-2 font-black">₹{p.price.toLocaleString()}</td>
                        <td className="px-3 py-2">
                          {p.sale_price ? <span className="text-green-600 font-black">₹{p.sale_price.toLocaleString()}</span> : <span className="text-[var(--color-muted)]">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          {discPct > 0 ? <span className="bg-green-100 text-green-700 font-black px-1.5 py-0.5 text-[10px]">{discPct}% OFF</span> : "—"}
                        </td>
                        <td className="px-3 py-2">{p.stock}</td>
                        <td className="px-3 py-2">{p.is_drop ? "🔥" : "—"}</td>
                        <td className="px-3 py-2 font-mono text-[10px] text-[var(--color-muted)] max-w-[120px] truncate">{p.seo_slug}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results */}
        {done && (
          <div className="bg-[var(--background)] border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 size={24} className="text-green-500" />
              <div>
                <h2 className="font-black uppercase tracking-tighter text-lg">Upload Complete!</h2>
                <p className="text-xs text-[var(--color-muted)]">{successCount} successful · {errorCount} failed</p>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs p-2.5 ${r.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {r.status === "success" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  <span className="font-bold">{r.name}</span>
                  {r.error && <span className="ml-auto opacity-70 text-[10px]">{r.error}</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <Link href="/admin/products" className="flex-1 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs py-3 text-center hover:opacity-90">
                View All Products →
              </Link>
              <button
                onClick={() => { setFile(null); setPreview([]); setResults([]); setDone(false); }}
                className="px-6 border border-[var(--color-border)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-secondary)] transition-colors"
              >
                Upload More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
