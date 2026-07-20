import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";
import { homeMetaDescription, OG_SHARE_SIZE } from "@/lib/seo";
import { HomeHeroSlider } from "@/components/home-hero-slider";
import { HomeFeaturedProducts } from "@/components/home-featured-products";
import { HomeMadeInGhana } from "@/components/home-made-in-ghana";
import { HomeCustomerVoices } from "@/components/home-customer-voices";
import { HomePartnerInvite } from "@/components/home-partner-invite";
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
  return (
    <main className="flex-1">
      <HomeHeroSlider />
      <HomeFeaturedProducts />
      <HomeMadeInGhana />
      <HomeCustomerVoices />
      <HomePartnerInvite />
      <HomeSupplementDisclaimer />
    </main>
  );
}
