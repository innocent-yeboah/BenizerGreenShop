import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { ProductCard } from "@/components/product-card";

/** Curated featured grid — compact tiles, no fabricated review scores. */
export function HomeFeaturedProducts() {
  const limit = siteConfig.homePage.featuredLimit;
  const featured = products.filter((p) => p.featured).slice(0, limit);
  const h = siteConfig.homePage;

  return (
    <section className="container-shell py-14 md:py-16" aria-labelledby="home-featured-heading">
      <div className="mb-8 flex flex-col items-center text-center md:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Catalog</p>
        <h2 id="home-featured-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
          {h.featuredSectionTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-charcoal/70 md:text-[15px]">{h.featuredSectionSubtitle}</p>
        <Link href="/products" className="btn-ghost mt-5 text-sm font-bold">
          View all products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-3.5">
        {featured.map((product) => (
          <ProductCard key={product.slug} product={product} benefitLines={2} />
        ))}
      </div>
    </section>
  );
}
