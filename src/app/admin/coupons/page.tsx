"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, Tag, 
  Percent, DollarSign, Calendar, Users 
} from "lucide-react";

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("coupons").insert({
      code: code.toUpperCase(),
      discount_type: type,
      discount_value: parseFloat(value),
      min_spend: parseFloat(minSpend || "0"),
      expiry_date: expiry || null,
    });
    
    if (error) alert(error.message);
    else {
      setShowForm(false);
      setCode(""); setValue(""); setMinSpend(""); setExpiry("");
      loadCoupons();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    loadCoupons();
  };

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-70">
            <ArrowLeft size={14} /> Back
          </Link>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-5 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            {showForm ? "Cancel" : <><Plus size={14} /> Create Coupon</>}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-black p-6 mb-8 animate-in slide-in-from-top-4 duration-300">
            <h2 className="font-black uppercase tracking-tighter text-xl mb-6">New Coupon</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Coupon Code</label>
                <input 
                  required value={code} onChange={e => setCode(e.target.value)}
                  placeholder="E.G. POOKI20" 
                  className="w-full border-2 border-gray-100 p-3 outline-none focus:border-black uppercase font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Discount Type</label>
                <select 
                  value={type} onChange={e => setType(e.target.value)}
                  className="w-full border-2 border-gray-100 p-3 outline-none focus:border-black font-bold"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Value</label>
                <input 
                  required type="number" value={value} onChange={e => setValue(e.target.value)}
                  placeholder="20" 
                  className="w-full border-2 border-gray-100 p-3 outline-none focus:border-black font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Min Spend (₹)</label>
                <input 
                  type="number" value={minSpend} onChange={e => setMinSpend(e.target.value)}
                  placeholder="999" 
                  className="w-full border-2 border-gray-100 p-3 outline-none focus:border-black font-bold"
                />
              </div>
              <div className="col-span-full">
                <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] text-xs">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Coupons</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center">
              <Tag size={32} className="mx-auto text-gray-100 mb-4" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No active coupons</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {coupons.map(coupon => (
                <div key={coupon.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-3">
                      {coupon.discount_type === "percentage" ? <Percent size={18} /> : <DollarSign size={18} />}
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tighter">{coupon.code}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {coupon.discount_type === "percentage" ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                        {coupon.min_spend > 0 && ` • Min ₹${coupon.min_spend}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Used {coupon.usage_count} times</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className={`w-2 h-2 rounded-full ${coupon.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{coupon.is_active ? 'Active' : 'Expired'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
