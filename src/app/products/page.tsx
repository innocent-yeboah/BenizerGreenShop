import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";

export const metadata: Metadata = {
  title: "Wellness shop",
  description: clampMetaDescription(
    `Browse trusted organic supplements and daily wellness formulas from ${siteConfig.name}. Natural vitality, cellular support, and premium quality — ship-ready in Ghana and beyond.`,
  ),
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <main className="container-shell py-14">
      <h1 className="text-4xl font-bold text-brand-green-dark">Best Selling Products</h1>
      <p className="mt-2 max-w-2xl text-brand-charcoal/80">
        Discover premium formulations designed to support daily wellness,
        natural balance, and measurable health outcomes.
      </p>
      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.slug}
            className="surface-card lift-on-hover flex flex-col overflow-hidden rounded-2xl border-brand-gold/30 p-0 hover:border-brand-gold"
          >
            <div className="relative aspect-square w-full bg-brand-cream">
              <Image
                src={product.images[0]}
                alt={product.shortTitle}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-semibold uppercase text-brand-green">{product.category}</p>
            <h2 className="mt-2 text-xl font-bold">{product.shortTitle}</h2>
            <p className="mt-1 text-sm text-brand-charcoal/70">{product.shortBenefit}</p>
            <p className="mt-4 text-lg font-bold text-brand-green">{currencyFormatter.format(product.price)}</p>
            <div className="mt-5 flex gap-3">
              <Link href={`/products/${product.slug}`} className="btn-primary px-4 py-2">
                View Details
              </Link>
              <AddToCartButton slug={product.slug} />
            </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
