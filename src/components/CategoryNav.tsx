"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

export const CATEGORIES = [
  { label: "Discover",     slug: "all",          icon: "✦" },
  { label: "T-Shirts",     slug: "tees",         icon: null },
  { label: "Shirts",       slug: "shirts",       icon: null },
  { label: "Cargo Pants",  slug: "cargo-pants",  icon: null },
  { label: "Jeans",        slug: "jeans",        icon: null },
  { label: "Trousers",     slug: "trousers",     icon: null },
  { label: "Shorts",       slug: "shorts",       icon: null },
  { label: "Overshirt",    slug: "overshirt",    icon: null },
  { label: "Fleece",       slug: "fleece",       icon: null },
  { label: "Outerwear",    slug: "outerwear",    icon: null },
  { label: "Plus-Size",    slug: "plus-size",    icon: null },
  { label: "Sunglasses",   slug: "sunglasses",   icon: null },
  { label: "Perfumes",     slug: "perfumes",     icon: null },
];

export default function CategoryNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("cat") || "all";

  // Only show on shop/collection pages and home
  const showOn = ["/", "/collections/all"];
  const shouldShow = showOn.includes(pathname) || pathname.startsWith("/collections");
  if (!shouldShow) return null;

  return (
    <div className="bg-[var(--background)] border-b border-[var(--color-border)] sticky top-16 z-40 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar select-none">
          {CATEGORIES.map((cat, i) => {
            const isActive =
              cat.slug === activeCategory ||
              (cat.slug === "all" && !searchParams.get("cat") && pathname === "/collections/all");
            const href =
              cat.slug === "all"
                ? "/collections/all"
                : `/collections/all?cat=${cat.slug}`;

            return (
              <Link
                key={cat.slug}
                href={href}
                id={`catnav-${cat.slug}`}
                className={`
                  relative flex-shrink-0 flex items-center gap-1.5 px-4 py-4
                  text-xs font-black uppercase tracking-widest whitespace-nowrap
                  transition-colors duration-200 group
                  ${isActive
                    ? "text-[var(--foreground)] border-b-2 border-[var(--foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--foreground)] border-b-2 border-transparent"
                  }
                  ${i === 0 ? "text-[var(--color-accent)] border-b-[var(--color-accent)]" : ""}
                `}
              >
                {i === 0 && (
                  <Sparkles size={10} className="text-[var(--color-accent)]" />
                )}
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
