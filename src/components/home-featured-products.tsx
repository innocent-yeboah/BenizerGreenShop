import Image from "next/image";
import Link from "next/link";
import { products, siteConfig, type Product } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";

function FeaturedCard({ product }: { product: Product }) {
  return (
    <article className="surface-card lift-on-hover flex flex-col overflow-hidden rounded-xl border border-brand-charcoal/[0.06] shadow-[0_4px_20px_-8px_rgba(13,59,15,0.2)]">
      <div className="relative aspect-4/3 w-full bg-brand-cream">
        <Image
          src={product.images[0]}
          alt={product.shortTitle}
          fill
          className="object-contain p-2 sm:p-3"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-green/80">{product.category}</p>
        <h3 className="mt-1 text-[0.9375rem] font-semibold leading-snug text-brand-green-dark md:text-base">
          {product.shortTitle}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-brand-charcoal/70">{product.shortBenefit}</p>
        <p className="mt-3 text-base font-bold tabular-nums text-brand-green">{currencyFormatter.format(product.price)}</p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="btn-primary min-h-9 flex-[1_1_auto] shrink-0 px-3 py-2 text-center text-xs font-semibold sm:flex-1"
          >
            View details
          </Link>
          <AddToCartButton slug={product.slug} className="min-h-9 shrink-0 px-3 py-2 text-xs font-semibold" />
        </div>
      </div>
    </article>
  );
}

/** Curated featured grid — no fabricated review scores. */
export function HomeFeaturedProducts() {
  const limit = siteConfig.homePage.featuredLimit;
  const featured = products.filter((p) => p.featured).slice(0, limit);
  const h = siteConfig.homePage;

  return (
    <section className="container-shell py-14 md:py-16" aria-labelledby="home-featured-heading">
      <div className="mb-10 flex flex-col items-center text-center md:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Catalog</p>
        <h2 id="home-featured-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
          {h.featuredSectionTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-charcoal/70 md:text-[15px]">{h.featuredSectionSubtitle}</p>
        <Link href="/products" className="btn-ghost mt-5 text-sm font-bold">
          View all products
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <FeaturedCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
