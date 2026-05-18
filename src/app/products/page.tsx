import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist-toggle-button";
import { CatalogJsonLd } from "@/components/catalog-json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";

const productsDescription = clampMetaDescription(
  `Browse trusted organic supplements and daily wellness formulas from ${siteConfig.name}. Natural vitality, cellular support, and premium quality — ship-ready in Ghana and beyond.`,
);

export const metadata: Metadata = {
  title: "Wellness shop",
  description: productsDescription,
  alternates: { canonical: "/products" },
  ...defaultSocialCardMetadata({
    path: "/products",
    title: "Wellness shop",
    description: productsDescription,
  }),
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
      <CatalogJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
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

      <section id="categories" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((product) => (
          <article
            key={product.slug}
            className="surface-card lift-on-hover flex flex-col overflow-hidden rounded-xl border-brand-gold/25 p-0 hover:border-brand-gold"
          >
            <div className="relative aspect-4/3 w-full bg-brand-cream">
              <Image
                src={product.images[0]}
                alt={product.shortTitle}
                fill
                className="object-contain p-2 sm:p-3"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-green">{product.category}</p>
              <h2 className="mt-1 text-[0.9375rem] font-semibold leading-snug text-brand-green-dark">{product.shortTitle}</h2>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-brand-charcoal/70">{product.shortBenefit}</p>
              <p className="mt-2.5 text-base font-bold text-brand-green">{currencyFormatter.format(product.price)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="btn-primary min-h-9 shrink-0 px-3 py-2 text-xs font-semibold"
                >
                  View Details
                </Link>
                <AddToCartButton slug={product.slug} className="min-h-9 px-3 py-2 text-xs font-semibold" />
                <WishlistToggleButton
                  slug={product.slug}
                  variant="outline"
                  className="rounded-full px-2.5 py-1 text-xs [&_svg]:size-4"
                />
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
