import Link from "next/link";
import { categories } from "@/lib/site-data";

/** Shop-by-category entry points for the homepage. */
export function HomeCategoryStrip() {
  return (
    <section className="border-b border-brand-charcoal/6 bg-white py-12 md:py-14" aria-labelledby="home-categories-heading">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Shop by goal</p>
          <h2 id="home-categories-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
            Find the right supplement
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70 md:text-[15px]">
            Browse our catalog by category for men, women, cellular wellness, and more.
          </p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="flex min-h-14 items-center justify-center rounded-xl border border-brand-green/12 bg-brand-cream/40 px-4 py-3 text-center text-sm font-semibold text-brand-green-dark transition-colors hover:border-brand-green/30 hover:bg-white hover:shadow-[0_8px_24px_-16px_rgba(13,59,15,0.2)]"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-green underline-offset-4 hover:text-brand-green-dark hover:underline"
          >
            View full catalog
          </Link>
        </p>
      </div>
    </section>
  );
}
