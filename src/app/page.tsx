import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, siteTestimonials } from "@/lib/site-data";
import { homeMetaDescription, OG_SHARE_SIZE } from "@/lib/seo";
import { HomeHero } from "@/components/home-hero";
import { HomeHighlightStats } from "@/components/home-highlight-stats";
import { HomeCategoryStrip } from "@/components/home-category-strip";
import { HomeFeaturedProducts } from "@/components/home-featured-products";
import { HomeBrandStory } from "@/components/home-brand-story";
import { HomeHowItWorks } from "@/components/home-how-it-works";
import { HomeDistributorTeaser } from "@/components/home-distributor-teaser";
import { TestimonialsSection } from "@/components/testimonials-section";
import { HomeSupplementDisclaimer } from "@/components/home-supplement-disclaimer";

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
  const h = siteConfig.homePage;

  return (
    <main className="flex-1">
      <HomeHero />
      <HomeHighlightStats />
      <HomeCategoryStrip />
      <HomeFeaturedProducts />
      <HomeBrandStory />
      <HomeHowItWorks />
      <HomeDistributorTeaser />

      <section className="bg-brand-green px-6 py-14 text-white md:py-16" aria-labelledby="home-cta-heading">
        <div className="container-shell rounded-2xl border border-white/20 bg-brand-green-dark/35 p-8 text-center md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold-light">{h.discountBandEyebrow}</p>
          <h2 id="home-cta-heading" className="mt-4 font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            {h.discountBandTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/88 md:text-base">{h.discountBandSubtitle}</p>
          <Link
            href="/become-distributor"
            className="btn-secondary mt-8 inline-flex border-brand-gold bg-brand-gold px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-green-dark hover:border-brand-gold-light hover:bg-brand-gold-light hover:text-brand-green-dark"
          >
            {h.discountBandCta}
          </Link>
        </div>
      </section>

      <TestimonialsSection items={siteTestimonials} />
      <HomeSupplementDisclaimer />
    </main>
  );
}
