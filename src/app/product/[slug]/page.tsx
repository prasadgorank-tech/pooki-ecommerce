import { fetchProduct, fetchProducts } from "@/lib/products";
import type { Metadata } from "next";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

// ── SEO Metadata (server-side, picked up by Google) ──────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Product Not Found | Pooki" };

  const title = product.seo_title || `${product.name} | Pooki`;
  const description = product.seo_description || product.description ||
    `Buy ${product.name} — ${product.fit} fit streetwear by Pooki. Free shipping India-wide.`;
  const url = `https://pooki.in/product/${product.seo_slug || product.id}`;
  const image = product.image_url?.startsWith("http")
    ? product.image_url
    : `https://pooki.in${product.image_url}`;

  return {
    title,
    description,
    keywords: product.seo_keywords || `${product.name}, ${product.fit} fit, streetwear india, pooki`,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image, width: 800, height: 1000, alt: product.name }],
      type: "website",
      siteName: "Pooki",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

// ── Static params for build-time generation ───────────────────────
export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map(p => ({ slug: p.seo_slug || p.id }));
}

// ── Page (server component shell) ────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  return <ProductClient initialProduct={product} slug={slug} />;
}
