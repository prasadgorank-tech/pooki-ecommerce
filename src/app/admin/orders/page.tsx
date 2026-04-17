"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = orders.filter(o => o.status === "CONFIRMED").reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20">
      <div className="bg-[var(--background)] border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <ShoppingCart size={18} />
        <span className="font-black uppercase tracking-widest text-sm">Orders</span>
        <span className="ml-auto text-xs font-black text-green-600 bg-green-100 px-3 py-1">
          Revenue: ₹{totalRevenue.toLocaleString()}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--background)] border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
                  {["Order ID", "User ID", "Status", "Total", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-xs text-[var(--color-muted)]">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <ShoppingCart size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest">No orders yet</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order, i) => (
                    <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-secondary)]/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-[var(--color-muted)]">#{String(i + 1).padStart(4, "0")}</td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--color-muted)] max-w-[120px] truncate">{order.user_id || "Guest"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 ${
                          order.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                          order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{order.status || "PENDING"}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-black">₹{order.total?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)]">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border)] text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest">
            {orders.length} total orders
          </div>
        </div>
      </div>
    </div>
  );
}
