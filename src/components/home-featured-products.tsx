import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";
import { ProductCard } from "@/components/product-card";

export function HomeFeaturedProducts() {
  const limit = siteConfig.homePage.featuredLimit;
  const featured = products.filter((p) => p.featured).slice(0, limit);
  const h = siteConfig.homePage;

  return (
    <section className="container-shell py-10 md:py-12" aria-labelledby="home-featured-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="home-featured-heading" className="font-heading text-xl font-bold text-brand-green-dark md:text-2xl">
          {h.featuredSectionTitle}
        </h2>
        <Link href="/products" className="text-sm font-semibold text-brand-green-dark underline-offset-4 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.slug} product={product} benefitLines={2} />
        ))}
      </div>
    </section>
  );
}
