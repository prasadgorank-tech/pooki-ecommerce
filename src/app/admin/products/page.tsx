"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ArrowLeft, Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  fit: string;
  price: number;
  image_url: string;
  stock: number;
  is_active: boolean;
  is_drop: boolean;
  created_at: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    await supabase.from("admin_products").delete().eq("id", id);
    await load();
    setDeleting(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20">
      {/* Top Bar */}
      <div className="bg-[var(--background)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <Package size={18} />
          <span className="font-black uppercase tracking-widest text-sm">Products</span>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/upload" className="flex items-center gap-2 border border-[var(--color-border)] font-black uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all">
            Bulk Upload CSV
          </Link>
          <Link href="/admin/products/new" id="products-add-btn" className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-4 py-2.5 hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            id="product-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--color-border)] bg-[var(--background)] outline-none focus:border-[var(--foreground)] transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-[var(--background)] border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
                  {["Product", "Category", "Fit", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-xs text-[var(--color-muted)]">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <Package size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest">
                        {search ? "No products match your search." : "No products yet. Add your first one!"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(product => (
                    <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-secondary)]/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image_url || "/images/product1.png"} alt={product.name} className="w-10 h-12 object-cover flex-shrink-0 bg-[var(--color-secondary)]" />
                          <div>
                            <p className="text-xs font-black uppercase leading-tight">{product.name}</p>
                            {product.is_drop && <span className="text-[9px] bg-[var(--color-accent)] text-white px-1.5 py-0.5 font-black uppercase">Drop</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)]">{product.category}</td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)]">{product.fit}</td>
                      <td className="px-4 py-3 text-xs font-black">₹{product.price?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black px-2 py-1 ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black px-2 py-1 ${product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {product.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-1.5 border border-[var(--color-border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                          >
                            <Pencil size={12} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-1.5 border border-[var(--color-border)] hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-30"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border)] text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest">
            {filtered.length} of {products.length} products
          </div>
        </div>
      </div>
    </div>
  );
}
