"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Zap, Lock } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";

// Drop countdown target — set this to your actual drop date
const DROP_DATE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 23 * 60 * 1000);

const DROP_ITEMS = [
  products[4], // Nylon Track Jacket
  products[9], // Cropped Puffer
  products[13], // Coach Jacket
];

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
          <span className="text-3xl md:text-5xl font-black text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{label}</span>
    </div>
  );
}

export default function DropsPage() {
  const { addToCart } = useCart();
  const timeLeft = useCountdown(DROP_DATE);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through drop items
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveItem(prev => (prev + 1) % DROP_ITEMS.length);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/drop-hero.png"
            alt="Pooki Drop SS26"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          {/* Animated glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[180px] opacity-10 animate-pulse" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[var(--color-accent)] text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 mb-8">
            <Zap size={10} fill="currentColor" />
            Exclusive Drop — SS26 Collection
            <Zap size={10} fill="currentColor" />
          </div>

          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-none mb-4">
            DROP<br />
            <span className="text-[var(--color-accent)] [text-shadow:0_0_60px_rgba(255,51,102,0.5)]">001</span>
          </h1>
          <p className="text-white/60 text-base md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Three silhouettes. Zero compromises. Only 50 units each. Once it&apos;s gone — it&apos;s gone forever.
          </p>

          {/* Countdown */}
          <div className="flex justify-center items-center gap-4 md:gap-6 mb-12">
            <TimeBlock value={timeLeft.days} label="Days" />
            <span className="text-white/30 text-3xl font-black pb-6">:</span>
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <span className="text-white/30 text-3xl font-black pb-6">:</span>
            <TimeBlock value={timeLeft.minutes} label="Mins" />
            <span className="text-white/30 text-3xl font-black pb-6">:</span>
            <TimeBlock value={timeLeft.seconds} label="Secs" />
          </div>

          {/* Email capture */}
          {!submitted ? (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                id="drop-notify-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/5 border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-white/30"
              />
              <button
                type="submit"
                id="drop-notify-btn"
                className="bg-[var(--color-accent)] text-white font-black uppercase tracking-widest text-xs px-6 py-3 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Bell size={12} /> Notify Me
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-green-400 font-black uppercase tracking-widest text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              You&apos;re on the list! We&apos;ll alert you the moment it drops.
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest animate-bounce">
          <span>Preview Items</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      {/* ── DROP ITEMS SHOWCASE ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.4em] mb-3">What&apos;s Dropping</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">The Three Pieces</h2>
        </div>

        {/* Featured Item */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
            <Image
              src={DROP_ITEMS[activeItem].image}
              alt={DROP_ITEMS[activeItem].name}
              fill
              className="object-cover opacity-90 transition-opacity duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[var(--color-accent)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
                Limited — 50 Units Only
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              {DROP_ITEMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveItem(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeItem ? "bg-white scale-125" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
              <span className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.3em]">
                Item {activeItem + 1} of {DROP_ITEMS.length}
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              {DROP_ITEMS[activeItem].name}
            </h3>
            <p className="text-white/50 mb-6 leading-relaxed text-sm">
              A statement piece for agents who operate in the shadows. Premium construction. Zero compromises. Built for the ones who don&apos;t follow — they lead.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black">₹{DROP_ITEMS[activeItem].price.toLocaleString()}</span>
              <span className="line-through text-white/30 text-lg">₹{Math.round(DROP_ITEMS[activeItem].price * 1.3).toLocaleString()}</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-black px-2 py-1 uppercase tracking-wider">Drop Price</span>
            </div>

            {/* Lock icon - available at drop time */}
            <div className="flex flex-col gap-3">
              <button
                id={`drop-add-cart-${DROP_ITEMS[activeItem].id}`}
                onClick={() => addToCart({ id: DROP_ITEMS[activeItem].id, title: DROP_ITEMS[activeItem].name, price: DROP_ITEMS[activeItem].price, quantity: 1, size: "M", image: DROP_ITEMS[activeItem].image })}
                className="flex items-center justify-center gap-3 bg-[var(--color-accent)] text-white font-black uppercase tracking-widest text-sm px-8 py-5 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Zap size={16} fill="currentColor" /> Add to Cart — ₹{DROP_ITEMS[activeItem].price.toLocaleString()}
              </button>
              <Link
                href={`/product/${DROP_ITEMS[activeItem].id}`}
                className="flex items-center justify-center gap-2 border border-white/20 text-white/60 font-black uppercase tracking-widest text-xs px-8 py-4 hover:border-white hover:text-white transition-all duration-300"
              >
                View Full Details <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* All 3 items grid */}
        <div className="grid grid-cols-3 gap-4">
          {DROP_ITEMS.map((item, i) => (
            <button
              key={item.id}
              id={`drop-item-thumb-${i}`}
              onClick={() => setActiveItem(i)}
              className={`group relative aspect-[3/4] overflow-hidden border-2 transition-all duration-300 ${
                activeItem === i ? "border-[var(--color-accent)]" : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image src={item.image} alt={item.name} fill className="object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-[10px] font-black uppercase tracking-tight line-clamp-2 text-left">{item.name}</p>
                <p className="text-[var(--color-accent)] text-xs font-black mt-1 text-left">₹{item.price.toLocaleString()}</p>
              </div>
              {activeItem === i && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── SCARCITY STRIP ── */}
      <div className="border-t border-b border-white/10 py-6 px-4 text-center bg-white/5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs font-black uppercase tracking-widest text-white/60">
          <span className="flex items-center gap-2"><Lock size={12} /> Exclusive to Pooki Members</span>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="flex items-center gap-2"><Zap size={12} fill="currentColor" className="text-[var(--color-accent)]" /> 50 Units Per Piece</span>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="flex items-center gap-2">🇮🇳 Ships India-Wide in 24h</span>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-4 text-center">
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-4">Don&apos;t Miss Out</p>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
          The Drop is<br />
          <span className="text-[var(--color-accent)]">Coming.</span>
        </h2>
        <p className="text-white/50 text-sm max-w-sm mx-auto mb-10">
          Join thousands of agents already waiting. When the timer hits zero, it&apos;s game time.
        </p>
        {!submitted ? (
          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Drop your email..."
              required
              className="flex-1 bg-white/5 border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-white/30"
            />
            <button type="submit" className="bg-white text-black font-black uppercase tracking-widest text-xs px-6 py-3 hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 whitespace-nowrap">
              Lock In →
            </button>
          </form>
        ) : (
          <p className="text-green-400 font-black uppercase tracking-widest text-sm">✓ You&apos;re locked in.</p>
        )}
      </section>
    </div>
  );
}
