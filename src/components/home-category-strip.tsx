import Link from "next/link";
import { categories } from "@/lib/site-data";

export function HomeCategoryStrip() {
  return (
    <section className="border-t border-brand-charcoal/6 bg-white py-8 md:py-10" aria-labelledby="home-categories-heading">
      <div className="container-shell">
        <h2 id="home-categories-heading" className="font-heading text-lg font-bold text-brand-green-dark md:text-xl">
          Shop by category
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="inline-flex rounded-full border border-brand-green/15 bg-brand-cream/50 px-4 py-2 text-sm font-semibold text-brand-green-dark transition-colors hover:border-brand-green/35 hover:bg-white"
              >
                {cat}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-brand-green/25 bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
            >
              All products
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
