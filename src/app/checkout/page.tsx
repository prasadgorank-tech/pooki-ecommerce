"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Lock, Truck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PAYPAL_ME = "https://paypal.me/DurgaTangeti";

type Step = "information" | "shipping" | "payment" | "confirmed";

const INPUT_CLS = "w-full bg-transparent border border-[var(--color-border)] p-3 text-sm outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--color-muted)]";
const LABEL_CLS = "block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-1.5";

export default function CheckoutPage() {
  const { items, cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount } = useCart();
  const [step, setStep] = useState<Step>("information");
  const [loading, setLoading] = useState(false);
  const [paypalClicked, setPaypalClicked] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");

  // Form state
  const [info, setInfo] = useState({ email: "", firstName: "", lastName: "", phone: "" });
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", pincode: "" });

  const handleApplyPromo = async () => {
    setPromoError("");
    if (!promoCode) return;

    // Direct query if helper doesn't exist
    const { data: couponData } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", promoCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (couponData) {
      if (couponData.min_spend > cartTotal) {
        setPromoError(`Min spend ₹${couponData.min_spend} required.`);
      } else {
        applyCoupon(couponData);
        setPromoCode("");
      }
    } else {
      setPromoError("Invalid or expired code.");
    }
  };

  const taxableTotal = items
    .filter(item => !item.id.startsWith("gift-card"))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shipping = 0; // Free shipping
  const tax = Math.round(taxableTotal * 0.05);
  const total = Math.max(0, cartTotal + tax - discountAmount);


  // Redirect to cart if empty
  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Your Cart is Empty</h1>
        <p className="text-[var(--color-muted)] text-sm">Add some items before checking out.</p>
        <Link href="/collections/all" className="bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-8 py-4">
          Shop Now
        </Link>
      </div>
    );
  }

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Process Gift Cards
      const giftCards = items.filter(item => item.id.startsWith("gift-card"));
      for (const gc of giftCards) {
        // Generate a unique code (e.g., PK-GC-XXXX)
        const gcCode = `PK-GC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        // In a real app, this would be an edge function/webhook
        // Here we insert the coupon into the table
        await supabase.from("coupons").insert({
          code: gcCode,
          discount_type: "fixed",
          discount_value: gc.price, // Same value as purchased
          min_spend: 0,
          is_active: true
        });
        
        console.log(`Simulated Email Sent to ${info.email}: Your ${gc.title} is ready! Your code is: ${gcCode}`);
      }

      if (user) {
        await supabase.from("orders").insert({
          user_id: user.id,
          status: "PENDING_PAYMENT",
          total,
        });
      }
      
      window.open(`${PAYPAL_ME}/${total}`, "_blank");
      setPaypalClicked(true);
      setTimeout(() => setStep("confirmed"), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 py-20">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <p className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.4em]">Order Confirmed</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Thank You,<br />{info.firstName || "Agent"}!</h1>
        <p className="text-[var(--color-muted)] text-sm max-w-sm">
          Your order is confirmed and will be dispatched within 24 hours. A confirmation has been sent to <strong>{info.email}</strong>.
        </p>
        <div className="border border-[var(--color-border)] p-6 max-w-sm w-full text-left space-y-3">
          <p className="text-xs font-black uppercase tracking-widest">Order Summary</p>
          {items.map((item) => (
            <div key={item.id + item.size} className="flex justify-between text-xs text-[var(--color-muted)]">
              <span>{item.title} × {item.quantity} (Size {item.size})</span>
              <span className="font-bold text-[var(--foreground)]">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-black">
            <span className="text-xs uppercase tracking-widest">Total Paid</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
        <Link href="/" className="bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-xs px-10 py-4 hover:opacity-90 transition-opacity mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono font-black text-xl tracking-tighter uppercase">POOKI</Link>
          <div className="flex items-center gap-1.5 text-[var(--color-muted)] text-xs font-bold">
            <Lock size={12} /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">

          {/* ── LEFT: FORM ── */}
          <div>
            {/* Step Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8">
              {(["information", "shipping", "payment"] as Step[]).map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={step === s ? "text-[var(--foreground)]" : "text-[var(--color-muted)]"}>
                    {i + 1}. {s}
                  </span>
                  {i < 2 && <ChevronDown size={10} className="rotate-[-90deg] text-[var(--color-muted)]" />}
                </span>
              ))}
            </div>

            {/* STEP 1 — Information */}
            {step === "information" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className={LABEL_CLS}>Email</label>
                    <input id="checkout-email" type="email" className={INPUT_CLS} placeholder="agent@example.com"
                      value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLS}>First Name</label>
                      <input id="checkout-firstname" type="text" className={INPUT_CLS} placeholder="John"
                        value={info.firstName} onChange={e => setInfo({ ...info, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Last Name</label>
                      <input id="checkout-lastname" type="text" className={INPUT_CLS} placeholder="Doe"
                        value={info.lastName} onChange={e => setInfo({ ...info, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phone</label>
                    <input id="checkout-phone" type="tel" className={INPUT_CLS} placeholder="+91 98765 43210"
                      value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} />
                  </div>
                </div>
                <button
                  id="checkout-continue-to-shipping"
                  disabled={!info.email || !info.firstName || !info.lastName}
                  onClick={() => setStep("shipping")}
                  className="w-full bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-4 text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* STEP 2 — Shipping */}
            {step === "shipping" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep("information")} className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors text-xs font-bold uppercase tracking-widest underline underline-offset-4">← Back</button>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={LABEL_CLS}>Address Line 1</label>
                    <input id="checkout-address1" type="text" className={INPUT_CLS} placeholder="123, Street Name"
                      value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Address Line 2 (Optional)</label>
                    <input id="checkout-address2" type="text" className={INPUT_CLS} placeholder="Apartment, Suite, etc."
                      value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLS}>City</label>
                      <input id="checkout-city" type="text" className={INPUT_CLS} placeholder="Mumbai"
                        value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>State</label>
                      <input id="checkout-state" type="text" className={INPUT_CLS} placeholder="Maharashtra"
                        value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>PIN Code</label>
                    <input id="checkout-pincode" type="text" className={INPUT_CLS} placeholder="400001" maxLength={6}
                      value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <label className={LABEL_CLS}>Shipping Method</label>
                  <div className="border border-[var(--foreground)] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Truck size={16} className="text-[var(--color-muted)]" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">Standard Delivery</p>
                        <p className="text-[10px] text-[var(--color-muted)]">3–5 business days</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-green-600">FREE</span>
                  </div>
                </div>

                <button
                  id="checkout-continue-to-payment"
                  disabled={!address.line1 || !address.city || !address.pincode}
                  onClick={() => setStep("payment")}
                  className="w-full bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest py-4 text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep("shipping")} className="text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors text-xs font-bold uppercase tracking-widest underline underline-offset-4">← Back</button>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Payment</h2>
                </div>

                <div className="border border-[var(--color-border)] p-4 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <Lock size={12} /> You will be redirected to PayPal to complete your payment securely.
                </div>

                {/* Order Review */}
                <div className="border border-[var(--color-border)] p-5 space-y-3 bg-[var(--color-secondary)]/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] mb-3">Review Your Order</p>
                  <div className="flex justify-between text-xs"><span className="text-[var(--color-muted)]">Name</span><span className="font-bold">{info.firstName} {info.lastName}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[var(--color-muted)]">Email</span><span className="font-bold">{info.email}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[var(--color-muted)]">Ship to</span><span className="font-bold text-right max-w-[60%]">{address.line1}, {address.city} - {address.pincode}</span></div>
                  <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-black text-sm">
                    <span>Total Due</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* PayPal Button */}
                {!paypalClicked ? (
                  <button
                    id="checkout-pay-paypal"
                    disabled={loading}
                    onClick={handlePayPal}
                    className="w-full bg-[#FFC439] hover:bg-[#f0b429] text-[#003087] font-black uppercase tracking-widest py-5 text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.99]"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-[#003087] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {/* PayPal Logo SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#003087">
                          <path d="M7.077 21.081l.295-1.868.016.01h-.013c.016-.002.016-.002 0 0zm11.717-14.26c.231-1.476-.004-2.48-.797-3.389C17.147 2.434 15.544 2 13.499 2H7.515a.9.9 0 00-.888.759L4.063 17.525a.54.54 0 00.533.624h3.88l-.245 1.556a.472.472 0 00.466.546h3.272c.39 0 .721-.284.783-.669l.032-.169.62-3.934.04-.218a.792.792 0 01.782-.669h.493c3.189 0 5.688-1.296 6.419-5.047.305-1.567.147-2.875-.658-3.794a3.158 3.158 0 00-.483-.431z"/>
                        </svg>
                        Pay with PayPal — ₹{total.toLocaleString()}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full border border-green-500/30 bg-green-500/10 text-green-600 font-black uppercase tracking-widest py-5 text-xs flex items-center justify-center gap-3">
                    <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    PayPal opened — confirming your order...
                  </div>
                )}

                <p className="text-[10px] text-center text-[var(--color-muted)]">
                  After paying on PayPal, your order will be confirmed automatically.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="lg:border-l lg:border-[var(--color-border)] lg:pl-10">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6">Order Summary</h3>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-[var(--color-secondary)] flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--foreground)] text-[var(--background)] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase leading-tight line-clamp-2">{item.title}</p>
                    <p className="text-[10px] text-[var(--color-muted)] mt-0.5">Size: {item.size}</p>
                  </div>
                  <p className="text-xs font-black">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input 
                  id="checkout-promo" 
                  type="text" 
                  className={INPUT_CLS + " flex-1"} 
                  placeholder="Gift card or promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button 
                  onClick={handleApplyPromo}
                  className="border border-[var(--color-border)] px-4 text-xs font-black uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest">{promoError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-2 bg-[var(--color-accent)]/10 p-2 border border-[var(--color-accent)]/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">Code {appliedCoupon.code} Applied</p>
                  <button onClick={removeCoupon} className="text-[10px] font-black uppercase text-red-500 hover:underline">Remove</button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
              <div className="flex justify-between text-xs text-[var(--color-muted)]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--color-muted)]">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--color-muted)]">
                <span>Tax (5% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-[var(--color-accent)] font-bold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base border-t border-[var(--color-border)] pt-3 mt-2">
                <span className="uppercase tracking-widest text-sm">Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
