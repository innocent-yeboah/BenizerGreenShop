import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Suspense } from "react";
import { ReferralLinkCapture } from "@/components/referral-link-capture";
import { ReferralShoppingBanner } from "@/components/referral-shopping-banner";
import { DesktopStoreHeader } from "@/components/desktop-store-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileStoreToolbar } from "@/components/mobile-store-toolbar";
import { SocialLinks } from "@/components/social-links";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { siteConfig } from "@/lib/site-data";
import { getPublicAppUrl } from "@/lib/app-url";
import { homeMetaDescription, OG_SHARE_SIZE, seoKeywords } from "@/lib/seo";
import { getCurrentUserWithRole } from "@/lib/auth";
import { signOutAction } from "@/app/auth/actions";

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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
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
  const [promoBeforeWealth, promoAfterWealth] =
    siteConfig.promoMarquee.split("Wealth!");

  const drawerExtras = (
    <>
      {currentUser?.role === "admin" ? (
        <Link
          href="/admin"
          prefetch={false}
          className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-brand-green-dark ring-1 ring-brand-green/18 hover:bg-brand-cream"
        >
          Admin dashboard
        </Link>
      ) : null}
      {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
        <Link
          href="/distributor"
          prefetch={false}
          className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-brand-green-dark ring-1 ring-brand-green/18 hover:bg-brand-cream"
        >
          Partner hub
        </Link>
      ) : null}
      {currentUser ? (
        <>
          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl border border-brand-green-dark/28 bg-brand-cream/50 px-4 py-3 text-sm font-semibold text-brand-green-dark hover:bg-brand-green/10"
            >
              Sign out
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/auth/sign-up"
            prefetch={false}
            className="rounded-xl bg-brand-green px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            Create shopper account
          </Link>
          <Link
            href="/auth/sign-in"
            prefetch={false}
            className="rounded-xl border border-brand-green-dark/30 bg-white px-4 py-3 text-center text-sm font-semibold text-brand-green-dark hover:bg-brand-cream"
          >
            Sign in
          </Link>
        </>
      )}
    </>
  );

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal">
        <SeoJsonLd />
        <header className="sticky top-0 z-50 border-b border-neutral-200/90 bg-white/95 backdrop-blur-sm backdrop-saturate-150">
          <MobileStoreToolbar>{drawerExtras}</MobileStoreToolbar>

          <DesktopStoreHeader currentUser={currentUser} />

          <div className="relative overflow-hidden border-t border-neutral-100 bg-brand-green py-2 shadow-inner">
            <p className="sr-only">{siteConfig.promoMarquee}</p>
            <div className="promo-marquee-track" aria-hidden>
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  className="inline-flex shrink-0 items-center whitespace-nowrap px-10 text-[0.7rem] font-semibold tracking-wide text-white sm:text-xs"
                >
                  {promoBeforeWealth}
                  <strong className="px-0.5 font-bold text-brand-gold-light">Wealth!</strong>
                  {promoAfterWealth}
                  <span className="pl-10 text-brand-gold-light/95" aria-hidden>
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        </header>
        <Suspense fallback={null}>
          <ReferralLinkCapture />
        </Suspense>
        <ReferralShoppingBanner />
        <div className="flex flex-1 flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
          <footer className="bg-brand-green-dark pt-12 pb-10 text-white md:pt-14">
            <div className="container-shell grid gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                  {siteConfig.name}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/78">
                  Premium organic wellness products with trusted support and a high-impact distributor
                  opportunity.
                </p>
              </div>

              <div className="lg:col-span-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                  Explore
                </p>
                <div className="mt-4 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/48">Shop</p>
                    <ul className="mt-2 flex flex-col gap-2 text-sm text-white/88">
                      <li>
                        <Link href="/products" className="transition-colors hover:text-brand-gold-light">
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link href="/wishlist" prefetch={false} className="transition-colors hover:text-brand-gold-light">
                          Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link href="/become-distributor" className="transition-colors hover:text-brand-gold-light">
                          Become a distributor
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/48">
                      Help & account
                    </p>
                    <ul className="mt-2 flex flex-col gap-2 text-sm text-white/88">
                      <li>
                        <Link href="/contact" className="transition-colors hover:text-brand-gold-light">
                          Contact us
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="transition-colors hover:text-brand-gold-light">
                          About
                        </Link>
                      </li>
                      <li>
                        <Link href="/order-status" className="transition-colors hover:text-brand-gold-light">
                          Track order
                        </Link>
                      </li>
                      <li>
                        <Link href="/account" prefetch={false} className="transition-colors hover:text-brand-gold-light">
                          My account
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-9 border-t border-white/10 pt-9 lg:col-span-3 lg:border-t-0 lg:pt-0">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                    Contact
                  </p>
                  <ul className="mt-3 flex flex-col gap-2.5 text-sm text-white/88">
                    <li>
                      <a
                        href={`https://wa.me/${siteConfig.whatsappAi.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-brand-gold-light"
                      >
                        WhatsApp · {siteConfig.whatsappDirect}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="break-all transition-colors hover:text-brand-gold-light"
                      >
                        {siteConfig.email}
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                    Follow us
                  </p>
                  <div className="mt-3">
                    <SocialLinks variant="footer" stack />
                  </div>
                </div>
              </div>
            </div>

            <div className="container-shell mt-12 border-t border-white/18 pt-8 md:mt-14 md:pt-10">
              <div className="flex flex-col items-center justify-center gap-3 text-center text-[11px] leading-snug text-white/58 sm:flex-row sm:flex-wrap sm:text-xs">
                <span className="text-white/80">
                  © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </span>
                <span className="hidden text-white/35 sm:inline" aria-hidden="true">
                  ·
                </span>
                <Link
                  href="/cookies"
                  className="text-white/75 underline decoration-white/28 underline-offset-[3px] transition-colors hover:text-brand-gold-light hover:decoration-brand-gold-light/60"
                >
                  Cookies policy
                </Link>
                <span className="hidden text-white/35 sm:inline" aria-hidden="true">
                  ·
                </span>
                <span>
                  Powered by{" "}
                  <a
                    href="https://buildwithinnocent.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white/78 underline decoration-white/28 underline-offset-2 transition-colors hover:text-brand-gold-light hover:decoration-brand-gold-light/60"
                  >
                    buildwithinnocent.com
                  </a>
                </span>
              </div>
            </div>
          </footer>
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
