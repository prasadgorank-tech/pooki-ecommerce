"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";

export default function PaymentClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      if (orderId.startsWith("mock_order_")) {
        setOrder({ id: orderId, total: 1499 }); // Safe fallback
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
      if (data) {
        setOrder(data);
      }
      setIsLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  const confirmPayment = async () => {
    setIsLoading(true);
    // Simulate successful payment confirmation processing delay
    await new Promise(r => setTimeout(r, 1000));
    
    if (!order.id.startsWith("mock_order_")) {
      await supabase.from("orders").update({ status: "CONFIRMED (PAID)" }).eq("id", order.id);
    }

    router.push("/profile");
  };

  if (isLoading) return <div className="min-h-screen pt-24 text-center">Processing Gateway...</div>;
  if (!order) return <div className="min-h-screen pt-24 text-center">Order Not Found</div>;

  const paypalLink = `https://paypal.me/DurgaTangeti/${order.total}`;

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--background)] border border-[var(--color-border)] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Security Badge */}
        <div className="absolute top-0 right-0 bg-[var(--foreground)] text-[var(--background)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck size={12} /> Encrypted
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tighter text-center mt-4 mb-2">
          Secure Payment
        </h1>
        <p className="text-center text-[var(--color-muted)] text-sm mb-6 pb-6 border-b border-[var(--color-border)]">
          Complete your purchase to secure the drop.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase tracking-widest text-[var(--color-muted)]">Order ID</span>
            <span className="font-mono">{order.id.split('-')[0]}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase tracking-widest text-[var(--color-muted)]">Amount Due</span>
            <span className="font-bold text-lg">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Step 1: External PayPal */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Step 1: Send Payment</h3>
          <a 
            href={paypalLink}
            target="_blank"
            rel="noreferrer"
            className="w-full flex justify-between items-center bg-blue-600 text-white font-bold uppercase tracking-widest p-4 hover:bg-blue-700 transition-colors"
          >
            <span>Pay on PayPal</span>
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Step 2: Confirmation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Step 2: Verification</h3>
          <button 
            onClick={confirmPayment}
            className="w-full flex justify-between items-center bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-widest p-4 hover:opacity-90 transition-opacity"
          >
            <span>I Have Paid (Confirm)</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
