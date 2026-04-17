"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tag,Gift, Ticket, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OffersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadOffers() {
      const { data } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      setCoupons(data || []);
      setLoading(false);
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBuyNow = (card: any) => {
    addToCart({
      id: `gift-card-${card.amount}`,
      title: `Pooki Gift Card - ${card.tag} Edition`,
      price: card.amount,
      quantity: 1,
      size: "Digital",
      image: "/images/gift-card-placeholder.png" // We can use a generic gift card image
    });
  };

  const giftCards = [
    { amount: 1000, value: 1100, tag: "STARTER" },
    { amount: 2500, value: 2800, tag: "PREMIUM" },
    { amount: 5000, value: 5750, tag: "ELITE" },
    { amount: 10000, value: 12000, tag: "LEGEND" },
  ];

  const [redeemCode, setRedeemCode] = useState("");
  const [redeemResult, setRedeemResult] = useState<any>(null);

  const handleRedeemCheck = async () => {
    setRedeemResult(null);
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", redeemCode.toUpperCase())
      .single();
    
    if (data) {
      setRedeemResult({ 
        success: true, 
        message: `Valid Gift Card: ₹${data.discount_value} Balance. Use at checkout.` 
      });
    } else {
      setRedeemResult({ success: false, message: "Invalid or expired code." });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Offers & <span className="text-[var(--color-accent)]">Gifts</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Exclusive drops, rewards, and premium access.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Amazon style Redemption Section */}
        <section className="mb-24 bg-zinc-50 border border-zinc-200 p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Redeem or Check Gift Card</h2>
            <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest font-bold">Add to your account or verify a code balance.</p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="Enter Gift Card Code (e.g. PK-GC-XXXXX)"
                className="flex-1 bg-white border-2 border-zinc-200 p-4 font-black uppercase tracking-widest text-sm focus:border-black outline-none transition-colors"
              />
              <button 
                onClick={handleRedeemCheck}
                className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-[var(--foreground)]/90 transition-colors"
              >
                Verify Code
              </button>
            </div>

            {redeemResult && (
              <div className={`mt-6 p-4 border flex items-center gap-3 ${redeemResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <CheckCircle2 size={16} />
                <p className="text-xs font-black uppercase tracking-widest">{redeemResult.message}</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Active Coupons Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-black p-2">
              <Ticket className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Active Coupons</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-zinc-100 animate-pulse border border-zinc-200" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="border border-zinc-200 p-20 text-center">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No public coupons active right now. Check back during drops.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="group relative border-2 border-black p-8 hover:bg-black transition-all duration-300">
                  <div className="mb-6 flex justify-between items-start">
                    <div className="bg-[var(--color-accent)] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                    </div>
                    <Tag size={16} className="text-zinc-300 group-hover:text-zinc-600" />
                  </div>
                  
                  <h3 className="text-3xl font-black tracking-tighter mb-2 group-hover:text-white transition-colors">{coupon.code}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-8 group-hover:text-zinc-400">
                    Min spend ₹{coupon.min_spend} • Valid until {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'N/A'}
                  </p>

                  <button 
                    onClick={() => handleCopy(coupon.code)}
                    className="w-full py-4 border border-black group-hover:border-zinc-800 group-hover:bg-zinc-900 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    {copiedCode === coupon.code ? (
                      <><CheckCircle2 size={14} className="text-green-500" /> COPIED</>
                    ) : (
                      <><Copy size={14} className="group-hover:text-white" /> <span className="group-hover:text-white">Copy Code</span></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gift Cards Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-black p-2">
              <Gift className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Purchase Gift Cards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCards.map((card) => (
              <div key={card.tag} className="border border-zinc-200 p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow bg-zinc-50/50">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">{card.tag} EDITION</span>
                <div className="text-4xl font-black tracking-tighter mb-2">₹{card.amount.toLocaleString()}</div>
                <p className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-widest mb-10">Get ₹{card.value.toLocaleString()} Value</p>
                
                <div className="w-full pt-6 border-t border-zinc-200 space-y-4">
                  <p className="text-[10px] text-zinc-400 font-medium">Digital delivery within 1 hour</p>
                  <button 
                    onClick={() => handleBuyNow(card)}
                    className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-12 p-8 bg-zinc-100 border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-zinc-200">
                <Gift className="text-black" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight">Need a custom amount?</h4>
                <p className="text-xs text-zinc-500">Corporate gifting and custom values are available.</p>
              </div>
            </div>
            <Link href="/contact" className="text-xs font-black uppercase tracking-widest underline underline-offset-8 hover:text-[var(--color-accent)] transition-colors">
              Contact Concierge →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
