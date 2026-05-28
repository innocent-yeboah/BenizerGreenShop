import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products, siteConfig } from "@/lib/site-data";
import { ProductCard } from "@/components/product-card";

export function HomeFeaturedProducts() {
  const limit = siteConfig.homePage.featuredLimit;
  const featured = products.filter((p) => p.featured).slice(0, limit);
  const h = siteConfig.homePage;

  return (
    <section
      className="bg-white py-16 md:py-20"
      aria-labelledby="home-featured-heading"
    >
      <div className="container-shell">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
              This season
            </p>
            <h2
              id="home-featured-heading"
              className="mt-2 font-heading text-2xl font-bold leading-tight text-brand-green-dark md:text-3xl lg:text-4xl"
            >
              {h.featuredSectionTitle}
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-green-dark md:self-end"
          >
            View all
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-4 md:gap-5">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} benefitLines={2} />
          ))}
        </div>
      </div>
    </section>
  );
}
