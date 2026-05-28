import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { ReferralLinkCapture } from "@/components/referral-link-capture";
import { ReferralShoppingBanner } from "@/components/referral-shopping-banner";
import { DesktopStoreHeader } from "@/components/desktop-store-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileStoreToolbar } from "@/components/mobile-store-toolbar";
import { HeaderUtilityBar } from "@/components/header-utility-bar";
import { SiteFooter } from "@/components/site-footer";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { siteConfig } from "@/lib/site-data";
import { getPublicAppUrl } from "@/lib/app-url";
import { homeMetaDescription, OG_SHARE_SIZE, seoKeywords } from "@/lib/seo";
import { getCurrentUserWithRole } from "@/lib/auth";

const siteUrl = getPublicAppUrl();
const metaDescription = homeMetaDescription(siteConfig.name);
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();
const facebookVerification = process.env.FACEBOOK_DOMAIN_VERIFICATION?.trim();
const pinterestVerification = process.env.PINTEREST_SITE_VERIFICATION?.trim();
const twitterSite = process.env.NEXT_PUBLIC_TWITTER_SITE?.trim();
const twitterCreator = process.env.NEXT_PUBLIC_TWITTER_CREATOR?.trim();
const asTwitterHandle = (h: string) => (h.startsWith("@") ? h : `@${h}`);
const shareAlt = `${siteConfig.name} — organic wellness & distributors`;

export const viewport: Viewport = {
  themeColor: "#1B5E20",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: metaDescription,
  applicationName: siteConfig.name,
  keywords: seoKeywords,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: true, telephone: true },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-32.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  ...(googleVerification || bingVerification || facebookVerification || pinterestVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification || facebookVerification || pinterestVerification
            ? {
                other: {
                  ...(bingVerification ? { "msvalidate.01": bingVerification } : {}),
                  ...(facebookVerification ? { "facebook-domain-verification": facebookVerification } : {}),
                  ...(pinterestVerification ? { "p:domain_verify": pinterestVerification } : {}),
                },
              }
            : {}),
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: metaDescription,
    countryName: "Ghana",
    images: [
      {
        url: "/opengraph-image",
        width: OG_SHARE_SIZE.width,
        height: OG_SHARE_SIZE.height,
        alt: shareAlt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: metaDescription,
    ...(twitterSite ? { site: asTwitterHandle(twitterSite) } : {}),
    ...(twitterCreator ? { creator: asTwitterHandle(twitterCreator) } : {}),
    images: [
      {
        url: "/twitter-image",
        width: OG_SHARE_SIZE.width,
        height: OG_SHARE_SIZE.height,
        alt: shareAlt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUserWithRole();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal">
        <SeoJsonLd />
        <header className="sticky top-0 z-50 border-b border-neutral-200/90 bg-white/95 backdrop-blur-sm backdrop-saturate-150">
          <MobileStoreToolbar currentUser={currentUser} />

          <DesktopStoreHeader currentUser={currentUser} />

          <HeaderUtilityBar />
        </header>
        <Suspense fallback={null}>
          <ReferralLinkCapture />
        </Suspense>
        <ReferralShoppingBanner />
        <div className="flex flex-1 flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
          <SiteFooter />
        </div>
        <MobileBottomNav />
        <a
          href={`https://wa.me/${siteConfig.whatsappAi.replace("+", "")}?text=${encodeURIComponent("Hello! I'm interested in your products.")}`}
          className="fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] right-4 z-55 inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition-colors hover:bg-[#20BA5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:bottom-5 md:right-5"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp Us
        </a>
      </body>
    </html>
  );
}
