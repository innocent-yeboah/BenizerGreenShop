import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist-toggle-button";

export const metadata: Metadata = {
  title: "Wellness shop",
  description: clampMetaDescription(
    `Browse trusted organic supplements and daily wellness formulas from ${siteConfig.name}. Natural vitality, cellular support, and premium quality — ship-ready in Ghana and beyond.`,
  ),
  alternates: { canonical: "/products" },
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const displayQ = (sp?.q ?? "").trim();
  const q = displayQ.toLowerCase();

  const list = q.length
    ? products.filter((p) => {
        const blob = `${p.shortTitle} ${p.title} ${p.category} ${p.slug}`.toLowerCase();
        return blob.includes(q);
      })
    : products;

  return (
    <main className="container-shell pb-24 pt-10 md:pb-14 md:pt-14">
      <h1 className="text-4xl font-bold text-brand-green-dark">Best Selling Products</h1>
      <p className="mt-2 max-w-2xl text-brand-charcoal/80">
        Discover premium formulations designed to support daily wellness, natural balance, and measurable health outcomes.
      </p>

      {q ? (
        <p className="mt-6 text-sm text-brand-charcoal/70">
          {list.length === 0 ? (
            <>
              Nothing matched <span className="font-semibold text-brand-green-dark">{`"${displayQ}"`}</span>.
            </>
          ) : (
            <>
              Showing {list.length} result{list.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-brand-green-dark">{`"${displayQ}"`}</span>.
            </>
          )}
        </p>
      ) : null}

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
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
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/products/${product.slug}`} className="btn-primary px-4 py-2">
                  View Details
                </Link>
                <AddToCartButton slug={product.slug} />
                <WishlistToggleButton slug={product.slug} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {q.length > 0 && list.length === 0 ? (
        <div className="mt-10">
          <Link href="/products" className="font-semibold text-brand-green hover:text-brand-green-dark">
            ← View entire catalog
          </Link>
        </div>
      ) : null}
    </main>
  );
}
