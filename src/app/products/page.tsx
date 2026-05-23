import type { Metadata } from "next";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";
import { ProductCard } from "@/components/product-card";
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
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const displayQ = (sp?.q ?? "").trim();
  const q = displayQ.toLowerCase();
  const displayCategory = (sp?.category ?? "").trim();

  let list = products;

  if (displayCategory) {
    list = list.filter((p) => p.category.toLowerCase() === displayCategory.toLowerCase());
  }

  if (q.length) {
    list = list.filter((p) => {
      const blob = `${p.shortTitle} ${p.title} ${p.category} ${p.slug}`.toLowerCase();
      return blob.includes(q);
    });
  }

  return (
    <main className="container-shell pb-24 pt-10 md:pb-14 md:pt-14">
      <CatalogJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
      <h1 className="font-heading text-3xl font-bold text-brand-green-dark md:text-4xl">
        {displayCategory ? displayCategory : "Wellness catalog"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-charcoal/80 md:text-[15px]">
        Discover premium formulations designed to support daily wellness, natural balance, and measurable health
        outcomes.
      </p>

      {displayCategory && !q ? (
        <p className="mt-5 text-sm text-brand-charcoal/70">
          Showing {list.length} product{list.length === 1 ? "" : "s"} in{" "}
          <span className="font-semibold text-brand-green-dark">{displayCategory}</span>.{" "}
          <Link href="/products" className="font-medium text-brand-green hover:underline">
            View all categories
          </Link>
        </p>
      ) : null}

      {q ? (
        <p className="mt-5 text-sm text-brand-charcoal/70">
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

      <section
        id="categories"
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-3.5"
      >
        {list.map((product) => (
          <ProductCard key={product.slug} product={product} benefitLines={1} />
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
