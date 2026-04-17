"use client";

import Link from "next/link";
import { ShoppingBag, Search, X, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";


const NAV_LINKS = [
  { label: "New Drops", href: "/drops" },
  { label: "Collections", href: "/collections/all" },
  { label: "Offers", href: "/offers" },
  { label: "Baggy Fits", href: "/collections/baggy" },
  { label: "Tees", href: "/collections/tees" },
];

export default function Navbar() {
  const { items, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--background)]/95 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Hamburger + Desktop Nav */}
            <div className="flex items-center gap-6 flex-1">
              <button
                id="navbar-mobile-menu-btn"
                aria-label="Open mobile menu"
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2 text-[var(--foreground)] hover:opacity-60 transition-opacity md:hidden"
              >
                <Menu size={22} />
              </button>
              <div className="hidden md:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--color-muted)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                id="navbar-logo"
                className="font-mono font-black text-2xl tracking-tighter uppercase hover:opacity-70 transition-opacity"
              >
                POOKI
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-1 sm:gap-3 flex-1">
              <button
                id="navbar-search-btn"
                aria-label="Search"
                className="flex flex-col items-center gap-0.5 px-2 text-[var(--foreground)] hover:opacity-70 transition-opacity hidden sm:flex"
              >
                <Search size={20} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Search</span>
              </button>
              <div className="relative">
                <button
                  id="navbar-profile-btn"
                  aria-label="Profile"
                  onClick={() => user ? setShowProfileMenu(!showProfileMenu) : setAuthOpen(true)}
                  className="flex flex-col items-center gap-0.5 px-2 text-[var(--foreground)] hover:opacity-70 transition-opacity"
                >
                  <UserIcon size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Profile</span>
                </button>

                {user && showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] py-5 px-6 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                    <div className="mb-4">
                      <p className="text-[13px] font-black text-gray-900 mb-0.5">Hello {user.identifier.split('@')[0]}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{user.identifier}</p>
                    </div>

                    <div className="h-[1px] bg-gray-100 my-4" />

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Link href="/orders" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Orders</Link>
                        <Link href="/wishlist" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Wishlist</Link>
                        <Link href="/offers" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Gift Cards</Link>
                        <Link href="/contact" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Contact Us</Link>
                        <div className="flex items-center gap-2">
                          <Link href="/elite" className="text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Pooki Elite</Link>
                          <span className="bg-[var(--color-accent)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter italic">New</span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-gray-100 my-4" />

                      <div className="space-y-3">
                        <Link href="/profile/credits" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Pooki Credit</Link>
                        <Link href="/offers" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Coupons</Link>
                        <Link href="/profile/cards" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Saved Cards</Link>
                        <Link href="/profile/address" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Saved Addresses</Link>
                      </div>

                      <div className="h-[1px] bg-gray-100 my-4" />

                      <div className="space-y-3">
                        <Link href="/profile/edit" className="block text-[13px] font-medium text-gray-700 hover:font-bold transition-all">Edit Profile</Link>
                        <button 
                          onClick={() => { logout(); setShowProfileMenu(false); }}
                          className="w-full text-left text-[13px] font-black text-red-500 hover:opacity-70 transition-opacity"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                id="navbar-cart-btn"
                aria-label="Open cart"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center gap-0.5 px-2 relative text-[var(--foreground)] hover:opacity-70 transition-opacity"
              >
                <div className="relative">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[var(--color-accent)] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight">Bag</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-72 bg-[var(--background)] border-r border-[var(--color-border)] z-50 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
              <span className="font-mono font-black text-xl tracking-tighter uppercase">POOKI</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 hover:opacity-60 transition-opacity"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-6 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--color-muted)] transition-colors border-b border-[var(--color-border)] pb-4"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--color-muted)] transition-colors flex items-center gap-3 mt-auto w-full text-left"
              >
                <UserIcon size={18} /> My Account
              </button>
            </nav>
            <div className="p-6 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest">Agent-First Streetwear</p>
            </div>
          </div>
        </>
      )}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
