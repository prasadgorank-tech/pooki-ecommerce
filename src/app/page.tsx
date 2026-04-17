"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";

const MARQUEE_ITEMS = [
  "🚨 NEW DROP AVAILABLE",
  "//",
  "FREE SHIPPING OVER ₹2999",
  "//",
  "LIMITED STOCK",
  "//",
  "AGENT-FIRST FITS",
  "//",
  "🚨 NEW DROP AVAILABLE",
  "//",
  "FREE SHIPPING OVER ₹2999",
  "//",
  "LIMITED STOCK",
  "//",
  "AGENT-FIRST FITS",
  "//",
];

export default function Home() {
  const { addToCart } = useCart();
  const bestSellers = products.slice(0, 3);
  const featuredDrop = products[4];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="Pooki – Agent-First Streetwear"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.4em] mb-4 animate-pulse">
            ⚡ New Drop — SS26 Collection
          </p>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none mb-6 drop-shadow-2xl">
            Agent-First<br />Form & Flow
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-10 max-w-lg mx-auto font-medium tracking-wide">
            Next-generation fits computed for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/collections/all"
              id="hero-shop-now-btn"
              className="bg-white text-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Shop Now
            </Link>
            <Link
              href="/drops"
              id="hero-view-drops-btn"
              className="bg-transparent border-2 border-white text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              View Drops
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest animate-bounce">
          <span>Scroll</span>
          <div className="w-px h-8 bg-white/40" />
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────── */}
      <div className="bg-[var(--color-accent)] text-white py-3 overflow-hidden flex whitespace-nowrap select-none">
        <div className="animate-[marquee_25s_linear_infinite] inline-flex items-center gap-8 font-black tracking-widest uppercase text-xs pr-8">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className={item === "//" ? "opacity-40" : ""}>{item}</span>
          ))}
        </div>
        <div className="animate-[marquee_25s_linear_infinite] inline-flex items-center gap-8 font-black tracking-widest uppercase text-xs pr-8" aria-hidden>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className={item === "//" ? "opacity-40" : ""}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── BEST SELLERS ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.3em] mb-2">Trending Now</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Best Sellers</h2>
          </div>
          <Link
            href="/collections/all"
            id="best-sellers-view-all"
            className="text-xs font-bold flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors uppercase tracking-widest group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bestSellers.map((product, idx) => (
            <div key={product.id} id={`product-card-${product.id}`} className="group relative">
              <Link href={`/product/${product.id}`} className="block">
                <div className="aspect-[4/5] relative bg-[var(--color-secondary)] overflow-hidden mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  {/* Badge */}
                  {idx === 0 && (
                    <span className="absolute top-3 left-3 bg-[var(--color-accent)] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">
                      Best Seller
                    </span>
                  )}
                  {/* Quick add */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      id={`quick-add-${product.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({ id: product.id, title: product.name, price: product.price, quantity: 1, size: "M", image: product.image });
                      }}
                      className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-3 hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                    >
                      Quick Add — M
                    </button>
                  </div>
                </div>
              </Link>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-tight">{product.name}</h3>
                  <p className="text-[var(--color-muted)] text-xs mt-0.5">{product.fit} Fit</p>
                </div>
                <span className="font-black text-sm">₹{product.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED DROP BANNER ─────────────────── */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-24 max-w-7xl lg:mx-auto">
        <div className="relative overflow-hidden bg-black aspect-[21/9] min-h-[300px] flex items-center">
          <Image
            src={featuredDrop.image}
            alt={featuredDrop.name}
            fill
            className="object-cover opacity-50"
          />
          <div className="relative z-10 p-8 md:p-16">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-[var(--color-accent)]" fill="currentColor" />
              <span className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.3em]">Limited Drop</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
              {featuredDrop.name}
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-xs">Only a few units left. Once it&apos;s gone, it&apos;s gone.</p>
            <Link
              href={`/product/${featuredDrop.id}`}
              id="featured-drop-cta"
              className="inline-flex items-center gap-3 bg-[var(--color-accent)] text-white font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
            >
              Shop the Drop <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MATCH THE MOOD ───────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.4em] mb-2">Curated For You</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Match The Mood</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {
              label: "Street",
              sub: "Core",
              href: "/collections/all",
              img: "/images/mood-street.png",
              id: "mood-street",
            },
            {
              label: "Baggy",
              sub: "Era",
              href: "/collections/all",
              img: "/images/mood-baggy.png",
              id: "mood-baggy",
            },
            {
              label: "Slim",
              sub: "Mode",
              href: "/collections/all",
              img: "/images/mood-slim.png",
              id: "mood-slim",
            },
            {
              label: "Drop",
              sub: "Zone",
              href: "/drops",
              img: "/images/mood-drops.png",
              id: "mood-drops",
            },
            {
              label: "Layer",
              sub: "Up",
              href: "/collections/all",
              img: "/images/mood-outerwear.png",
              id: "mood-outerwear",
            },
          ].map((mood) => (
            <Link
              key={mood.id}
              href={mood.href}
              id={mood.id}
              className="group relative overflow-hidden bg-black block"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background image */}
              <Image
                src={mood.img}
                alt={`${mood.label} ${mood.sub}`}
                fill
                className="object-cover object-top opacity-75 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Dark gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none">
                  {mood.label}
                </h3>
                <p className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.3em] mt-0.5">
                  {mood.sub}
                </p>
                {/* Arrow on hover */}
                <div className="flex items-center gap-1.5 mt-3 text-white/80 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
