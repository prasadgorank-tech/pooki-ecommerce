"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Plus, Upload, TrendingUp, ArrowRight, LogOut
} from "lucide-react";

const ADMIN_PASSWORD = "pooki2024admin";

type Stats = { products: number; orders: number; users: number; revenue: number; coupons: number };

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, revenue: 0, coupons: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Simple admin password gate
  const ADMIN_PASSWORD = "pooki2024admin";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      localStorage.setItem("pooki_admin", "true");
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("pooki_admin") === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      setLoading(true);
      const [{ count: productCount }, { count: orderCount }, { count: userCount }, { count: couponCount }, { data: orders }] =
        await Promise.all([
          supabase.from("admin_products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("user_profiles").select("*", { count: "exact", head: true }),
          supabase.from("coupons").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("total, status, created_at").order("created_at", { ascending: false }).limit(5),
        ]);
      const revenue = orders?.reduce((s: number, o: any) => s + (o.total || 0), 0) || 0;
      setStats({ products: productCount || 0, orders: orderCount || 0, users: userCount || 0, revenue, coupons: couponCount || 0 });
      setRecentOrders(orders || []);
      setLoading(false);
    };
    load();
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-sm border border-[var(--color-border)] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Pooki</h1>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1.5">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-transparent border border-[var(--color-border)] p-3 text-sm outline-none focus:border-[var(--foreground)] transition-colors"
              />
            </div>
            {error && <p className="text-[var(--color-accent)] text-xs font-bold">{error}</p>}
            <button
              id="admin-login-btn"
              type="submit"
              className="w-full bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-4 text-sm hover:opacity-90 transition-opacity"
            >
              Enter Dashboard
            </button>
          </form>
          <p className="text-[10px] text-center text-[var(--color-muted)] mt-4">Default password: pooki2024admin</p>
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-blue-500", href: "/admin/products" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-green-500", href: "/admin/orders" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-[var(--color-accent)]", href: "/admin/orders" },
    { label: "Active Coupons", value: stats.coupons, icon: Users, color: "text-orange-500", href: "/admin/coupons" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20">
      {/* Top Bar */}
      <div className="bg-[var(--background)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={18} />
          <span className="font-black uppercase tracking-widest text-sm">Pooki Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
            ← Back to Site
          </Link>
          <button
            onClick={() => { localStorage.removeItem("pooki_admin"); setAuthed(false); }}
            className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Dashboard</h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">Welcome back, Admin.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              id="admin-add-product"
              className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-5 py-3 hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Add Product
            </Link>
            <Link
              href="/admin/products/upload"
              id="admin-bulk-upload"
              className="flex items-center gap-2 border border-[var(--color-border)] font-black uppercase tracking-widest text-xs px-5 py-3 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
            >
              <Upload size={14} /> Bulk Upload
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(card => (
            <Link key={card.label} href={card.href} className="bg-[var(--background)] border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-3">
                <card.icon size={20} className={card.color} />
                <ArrowRight size={14} className="text-[var(--color-muted)] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-2xl font-black">{loading ? "—" : card.value}</p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <div className="bg-[var(--background)] border border-[var(--color-border)] p-6">
            <h2 className="text-xs font-black uppercase tracking-widest mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add New Product", href: "/admin/products/new", icon: Plus },
                { label: "Bulk CSV Upload", href: "/admin/products/upload", icon: Upload },
                { label: "View All Products", href: "/admin/products", icon: Package },
                { label: "View All Orders", href: "/admin/orders", icon: ShoppingCart },
                { label: "Manage Coupons", href: "/admin/coupons", icon: Users },
              ].map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 border border-[var(--color-border)] hover:bg-[var(--color-secondary)] transition-colors group"
                >
                  <action.icon size={14} className="text-[var(--color-muted)]" />
                  <span className="text-xs font-bold uppercase tracking-widest">{action.label}</span>
                  <ArrowRight size={12} className="ml-auto text-[var(--color-muted)] group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[var(--background)] border border-[var(--color-border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest">Recent Orders</h2>
              <Link href="/admin/orders" className="text-[10px] text-[var(--color-muted)] hover:text-[var(--foreground)] underline underline-offset-4">
                View All
              </Link>
            </div>
            {loading ? (
              <p className="text-xs text-[var(--color-muted)]">Loading...</p>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--color-muted)]">
                <ShoppingCart size={32} className="opacity-20 mb-2" />
                <p className="text-xs uppercase tracking-widest">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border border-[var(--color-border)]">
                    <div>
                      <p className="text-xs font-bold uppercase">Order #{i + 1}</p>
                      <p className="text-[10px] text-[var(--color-muted)]">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 ${
                      order.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{order.status}</span>
                    <p className="text-sm font-black">₹{order.total?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
