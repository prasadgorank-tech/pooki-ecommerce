"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function CartDrawer() {
  const { 
    isCartOpen, setIsCartOpen, items, removeFromCart, 
    cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ msg: string; type: "success" | "error" | null }>({ msg: "", type: null });
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    setCouponStatus({ msg: "", type: null });

    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      setCouponStatus({ msg: "Invalid or expired coupon", type: "error" });
    } else if (data.min_spend > cartTotal) {
      setCouponStatus({ msg: `Min spend ₹${data.min_spend} required`, type: "error" });
    } else {
      applyCoupon(data);
      setCouponStatus({ msg: "Coupon applied!", type: "success" });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-[var(--background)] border-l border-[var(--color-border)] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--foreground)] text-[var(--background)]">
          <h2 className="font-black uppercase tracking-widest flex items-center gap-2 text-sm">
            <ShoppingBag size={16} />
            Cart
            {items.length > 0 && (
              <span className="bg-[var(--color-accent)] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ml-1">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            id="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            className="hover:opacity-60 transition-opacity p-1"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-muted)] gap-4">
              <ShoppingBag size={56} className="opacity-20" />
              <p className="uppercase tracking-widest font-bold text-xs">Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-[var(--foreground)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 pb-5 border-b border-[var(--color-border)] last:border-0">
                <div className="relative w-20 h-24 bg-[var(--color-secondary)] flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-bold text-xs uppercase leading-tight tracking-tight line-clamp-2">{item.title}</h3>
                    <p className="text-[var(--color-muted)] text-xs mt-1">Size: {item.size}</p>
                    <p className="font-black text-sm mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold bg-[var(--foreground)] text-[var(--background)] px-2 py-0.5">
                      Qty: {item.quantity}
                    </span>
                    <button
                      id={`cart-remove-${item.id}`}
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[var(--color-border)] space-y-4 bg-gray-50/50">
            
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="ENTER COUPON CODE"
                    className="flex-1 bg-white border border-[var(--color-border)] px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loading || !couponCode}
                    className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "..." : "Apply"}
                  </button>
                </div>
                {couponStatus.type && (
                  <p className={`text-[9px] font-black uppercase tracking-widest ${couponStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {couponStatus.msg}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-700">Coupon {appliedCoupon.code} Applied</p>
                  <p className="text-[9px] text-green-600 uppercase font-bold">-₹{discountAmount.toLocaleString()} saved</p>
                </div>
                <button 
                  onClick={() => { removeCoupon(); setCouponCode(""); setCouponStatus({ msg: "", type: null }); }}
                  className="text-green-700 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="space-y-1 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-[9px] text-[var(--color-muted)]">Subtotal</span>
                <span className="text-sm font-black text-[var(--color-muted)] line-through decoration-black/20">₹{cartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest text-[9px] text-green-600">Coupon Discount</span>
                  <span className="text-sm font-black text-green-600">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-black/5 mt-1">
                <span className="font-black uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl font-black tracking-tighter">₹{(cartTotal - discountAmount).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[9px] text-[var(--color-muted)] uppercase tracking-widest font-bold text-center">Shipping & taxes calculated at checkout</p>
            
            <Link
              href="/checkout"
              id="cart-checkout-btn"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-[0.2em] text-xs py-5 hover:opacity-95 transition-opacity flex items-center justify-center gap-3 shadow-xl"
            >
              Secure Checkout <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
