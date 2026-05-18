import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, siteConfig, siteTestimonials } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { homeMetaDescription, OG_SHARE_SIZE } from "@/lib/seo";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { HomeHero } from "@/components/home-hero";
import { HeroSlider } from "@/components/hero-slider";
import { HomeHighlightStats } from "@/components/home-highlight-stats";
import { TestimonialsSection } from "@/components/testimonials-section";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Organic supplements & trusted distributor fulfilment`,
  },
  description: homeMetaDescription(siteConfig.name),
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    type: "website",
    title: `${siteConfig.name} — Trusted wellness & distributors`,
    description: homeMetaDescription(siteConfig.name),
    siteName: siteConfig.name,
    locale: "en_GH",
    countryName: "Ghana",
    images: [
      {
        url: "/opengraph-image",
        width: OG_SHARE_SIZE.width,
        height: OG_SHARE_SIZE.height,
        alt: `${siteConfig.name} storefront preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Trusted wellness & distributors`,
    description: homeMetaDescription(siteConfig.name),
    images: ["/twitter-image"],
  },
};

export default function Home() {
  const featured = products.filter((product) => product.featured);

  return (
    <main className="flex-1">
      <HomeHero />

      <HeroSlider />

      <HomeHighlightStats />

      <section className="container-shell py-14 md:py-16">
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <h2 className="text-3xl font-bold capitalize text-brand-green-dark md:text-4xl">Best selling products</h2>
          <p className="mt-2 max-w-lg text-sm text-brand-charcoal/65">Customer favorites with fast delivery across Ghana.</p>
          <Link href="/products" className="btn-ghost mt-4 text-sm font-bold">
            View all products
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <article
              key={product.slug}
              className="surface-card lift-on-hover flex flex-col overflow-hidden rounded-xl border border-brand-charcoal/[0.06] p-0 shadow-[0_4px_20px_-8px_rgba(13,59,15,0.2)]"
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
                <h3 className="text-[0.9375rem] font-semibold leading-snug text-brand-green-dark md:text-base">
                  {product.shortTitle}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <div className="flex gap-0.5 text-amber-400" aria-label="Rated 5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="size-3 shrink-0 fill-amber-400"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-charcoal/50">
                    Rated 5.00 out of 5
                  </span>
                </div>
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
          ))}
        </div>
      </section>

      <section className="bg-brand-green px-6 py-14 text-white">
        <div className="container-shell rounded-3xl border border-white/20 bg-brand-green-dark/35 p-8 text-center md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold-light">
            {siteConfig.homePage.discountBandEyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-bold capitalize leading-tight md:text-3xl lg:text-4xl">
            {siteConfig.homePage.discountBandTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88">
            {siteConfig.homePage.discountBandSubtitle}
          </p>
          <Link
            href="/become-distributor"
            className="btn-secondary mt-8 bg-brand-gold px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-green-dark border-brand-gold hover:bg-brand-gold-light hover:text-brand-green-dark hover:border-brand-gold-light"
          >
            {siteConfig.homePage.discountBandCta}
          </Link>
        </div>
      </section>

      <TestimonialsSection items={siteTestimonials} />
    </main>
  );
}
