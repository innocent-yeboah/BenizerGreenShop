import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, siteConfig } from "@/lib/site-data";

/**
 * Premium "shop by goal" — keeps the lean pill-list pattern but lifts it
 * with an editorial section header and a clear primary CTA.
 */
export function HomeShopByGoal() {
  const h = siteConfig.homePage;

  return (
    <section
      className="bg-brand-cream/50 py-14 md:py-20"
      aria-labelledby="home-shop-by-goal-heading"
    >
      <div className="container-shell">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
              {h.shopByGoalEyebrow}
            </p>
            <h2
              id="home-shop-by-goal-heading"
              className="mt-2 font-heading text-2xl font-bold leading-tight text-brand-green-dark md:text-3xl lg:text-4xl"
            >
              {h.shopByGoalTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-charcoal/75 md:text-base">
              {h.shopByGoalLead}
            </p>
          </div>

          <Link
            href="/products"
            className="group hidden items-center gap-2 self-end text-sm font-bold uppercase tracking-wider text-brand-green-dark md:inline-flex"
          >
            View full catalog
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul role="list" className="mt-8 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="inline-flex items-center rounded-full border border-brand-green/15 bg-white px-5 py-2.5 text-sm font-semibold text-brand-green-dark shadow-[0_1px_0_rgba(13,59,15,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-[0_8px_24px_-16px_rgba(13,59,15,0.4)]"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-green-dark md:hidden"
        >
          View full catalog
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
