import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { homeMetaDescription, OG_SHARE_SIZE } from "@/lib/seo";
import { HomeHeroSlider } from "@/components/home-hero-slider";
import { HomeCategoryStrip } from "@/components/home-category-strip";
import { HomeFeaturedProducts } from "@/components/home-featured-products";
import { HomeVisitStrip } from "@/components/home-visit-strip";
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
      <HomeHeroSlider />
      <HomeFeaturedProducts />
      <HomeCategoryStrip />
      <HomeVisitStrip />

      <section
        className="border-t border-brand-green/15 bg-brand-green-dark px-6 py-10 text-white md:py-12"
        aria-labelledby="home-partner-heading"
      >
        <div className="container-shell flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="max-w-lg">
            <h2 id="home-partner-heading" className="font-heading text-xl font-bold md:text-2xl">
              {h.discountBandTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{h.discountBandSubtitle}</p>
          </div>
          <Link
            href="/become-distributor"
            className="btn-secondary shrink-0 border-brand-gold bg-brand-gold px-8 py-3 text-sm font-bold text-brand-green-dark hover:bg-brand-gold-light"
          >
            {h.discountBandCta}
          </Link>
        </div>
      </section>

      <HomeSupplementDisclaimer />
    </main>
  );
}
