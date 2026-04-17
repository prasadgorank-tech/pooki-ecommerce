import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import AIStylistChat from "@/components/AIStylistChat";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pooki | Agent-First Streetwear",
  description: "High-conversion, AI-driven premium streetwear e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
          <Suspense fallback={null}>
            <CategoryNav />
          </Suspense>
          <CartDrawer />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <AIStylistChat />
        </CartProvider>
      </AuthProvider>
    </body>
  </html>
  );
}
