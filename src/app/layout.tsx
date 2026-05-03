import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ReferralLinkCapture } from "@/components/referral-link-capture";
import { ReferralShoppingBanner } from "@/components/referral-shopping-banner";
import { BrandWordmark } from "@/components/brand-wordmark";
import { CartNavLink } from "@/components/cart-nav-link";
import { SocialLinks } from "@/components/social-links";
import { TrustIndicatorGrid } from "@/components/trust-indicator-grid";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { siteConfig } from "@/lib/site-data";
import { getPublicAppUrl } from "@/lib/app-url";
import { clampMetaDescription, seoKeywords } from "@/lib/seo";
import { getCurrentUserWithRole } from "@/lib/auth";
import { signOutAction } from "@/app/auth/actions";

const siteUrl = getPublicAppUrl();
const metaDescription = clampMetaDescription(siteConfig.description);
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: metaDescription,
  applicationName: siteConfig.name,
  keywords: seoKeywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: true, telephone: true },
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal">
        <SeoJsonLd />
        <div className="relative overflow-hidden border-b border-white/15 bg-brand-green py-2.5 shadow-sm">
          <p className="sr-only">{siteConfig.promoMarquee}</p>
          <div className="promo-marquee-track" aria-hidden>
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="inline-flex shrink-0 items-center whitespace-nowrap px-10 text-xs font-semibold tracking-wide text-white sm:text-sm"
              >
                {promoBeforeWealth}
                <strong className="px-0.5 font-bold text-brand-gold-light">
                  Wealth!
                </strong>
                {promoAfterWealth}
                <span className="pl-10 text-brand-gold-light/95" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
        <header className="sticky top-0 z-50 border-b border-brand-green/15 bg-brand-cream/92 shadow-[inset_0_-1px_0_rgba(13,59,15,0.06)] backdrop-blur-md backdrop-saturate-150">
          <div className="h-1 shrink-0 bg-brand-green-dark" aria-hidden />
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 sm:py-4 md:gap-12">
            <Link
              href="/"
              className="flex min-w-0 flex-wrap items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
            >
              <span
                className="relative isolate flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-cream ring-1 ring-brand-green/8 md:size-14 lg:size-[60px]"
                aria-hidden
              >
                <Image
                  src="/benizer-logo.png"
                  alt=""
                  width={84}
                  height={84}
                  className="h-full w-full scale-[1.02] object-contain mix-blend-darken"
                  priority
                />
              </span>
              <BrandWordmark className="min-w-0 leading-tight tracking-tight" />
            </Link>
            <nav
              className="hidden h-11 shrink-0 items-center gap-0 md:flex lg:gap-1"
              aria-label="Primary"
            >
              <div className="flex items-center lg:gap-0.5">
                <Link
                  href="/products"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-dark/88 transition-colors hover:bg-brand-charcoal/4 hover:text-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-dark/88 transition-colors hover:bg-brand-charcoal/4 hover:text-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  About Us
                </Link>
                {currentUser?.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-dark/88 transition-colors hover:bg-brand-charcoal/4 hover:text-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    Admin
                  </Link>
                ) : null}
                {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
                  <Link
                    href="/distributor"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-brand-green-dark/88 transition-colors hover:bg-brand-charcoal/4 hover:text-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    Partner
                  </Link>
                ) : null}
              </div>
              <span
                className="mx-2 hidden h-6 w-px shrink-0 bg-brand-green-dark/14 sm:block lg:mx-3"
                aria-hidden
              />
              <CartNavLink className="-mx-0.5" />
              <span
                className="mx-2 hidden h-6 w-px shrink-0 bg-brand-green-dark/14 sm:block lg:mx-3"
                aria-hidden
              />
              <div className="flex items-center gap-2 pl-0.5 sm:gap-3">
                <Link
                  href="/become-distributor"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-brand-green-dark/10 transition-colors hover:bg-brand-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  Become a Distributor
                </Link>
                {currentUser ? (
                  <form action={signOutAction} className="shrink-0">
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-brand-green-dark/25 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-green-dark shadow-sm transition-colors hover:border-brand-green hover:bg-brand-green/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                    >
                      Sign Out
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/auth/sign-in"
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-brand-green-dark/25 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-green-dark shadow-sm transition-colors hover:border-brand-green hover:bg-brand-green/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
          <nav
            className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto border-t border-brand-green/10 bg-brand-cream/70 px-4 py-2.5 text-xs font-semibold backdrop-blur-sm sm:px-6 md:hidden"
            aria-label="Primary mobile"
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <Link
                href="/products"
                className="shrink-0 rounded-md px-2.5 py-1.5 font-medium text-brand-green-dark/90 hover:bg-brand-charcoal/5"
              >
                Products
              </Link>
              <span className="text-brand-green-dark/25" aria-hidden>
                |
              </span>
              <Link
                href="/about"
                className="shrink-0 rounded-md px-2.5 py-1.5 font-medium text-brand-green-dark/90 hover:bg-brand-charcoal/5"
              >
                About
              </Link>
              {currentUser?.role === "admin" ? (
                <>
                  <span className="text-brand-green-dark/25" aria-hidden>
                    |
                  </span>
                  <Link
                    href="/admin"
                    className="shrink-0 rounded-md px-2.5 py-1.5 font-medium text-brand-green-dark/90 hover:bg-brand-charcoal/5"
                  >
                    Admin
                  </Link>
                </>
              ) : null}
              {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
                <>
                  <span className="text-brand-green-dark/25" aria-hidden>
                    |
                  </span>
                  <Link
                    href="/distributor"
                    className="shrink-0 rounded-md px-2.5 py-1.5 font-medium text-brand-green-dark/90 hover:bg-brand-charcoal/5"
                  >
                    Partner
                  </Link>
                </>
              ) : null}
            </div>
            <span className="text-brand-green-dark/25" aria-hidden>
              |
            </span>
            <CartNavLink className="shrink-0" />
            <span className="text-brand-green-dark/25" aria-hidden>
              |
            </span>
            <Link
              href="/become-distributor"
              className="shrink-0 whitespace-nowrap rounded-md bg-brand-green px-3 py-1.5 text-white hover:bg-brand-green-dark"
            >
              Join program
            </Link>
            {currentUser ? (
              <form action={signOutAction} className="shrink-0">
                <button
                  type="submit"
                  className="cursor-pointer whitespace-nowrap rounded-md border border-brand-green-dark/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-green-dark hover:border-brand-green sm:text-xs"
                >
                  Sign Out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/sign-in"
                className="shrink-0 rounded-md border border-brand-green-dark/30 bg-white px-3 py-1.5 font-semibold text-brand-green-dark hover:border-brand-green"
              >
                Sign In
              </Link>
            )}
          </nav>
        </header>
        <Suspense fallback={null}>
          <ReferralLinkCapture />
        </Suspense>
        <ReferralShoppingBanner />
        {children}
        <section className="border-t border-brand-green/10 bg-white py-8">
          <TrustIndicatorGrid />
        </section>
        <footer className="bg-brand-green-dark py-10 text-white">
          <div className="container-shell grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                {siteConfig.name}
              </p>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                Premium organic wellness products with trusted support and a
                high-impact distributor opportunity.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                Quick Links
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <Link href="/products" className="hover:text-brand-gold-light">
                  Shop Products
                </Link>
                <Link href="/about" className="hover:text-brand-gold-light">
                  About Us
                </Link>
                <Link href="/become-distributor" className="hover:text-brand-gold-light">
                  Become A Distributor
                </Link>
                <Link href="/cart" className="hover:text-brand-gold-light">
                  Cart & Checkout
                </Link>
                <Link href="/order-status" className="hover:text-brand-gold-light">
                  Track order
                </Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                Contact
              </p>
              <div className="mt-3 space-y-2 text-sm text-white/85">
                <p>WhatsApp: {siteConfig.whatsappDirect}</p>
                <p>Email: {siteConfig.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
                Social
              </p>
              <div className="mt-3">
                <SocialLinks variant="footer" />
              </div>
            </div>
          </div>

          <div className="container-shell mt-10 border-t border-white/15 pt-8">
            <p className="text-center text-xs font-semibold tracking-wide text-white/80">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-center text-[11px] leading-relaxed text-white/55 md:text-xs">
              The information on this site is provided for general wellness and product awareness only.
              It is not medical advice and does not replace consultation with a qualified healthcare
              professional. Dietary supplements are not intended to diagnose, treat, cure, or prevent any
              disease. Use products as directed and read labels carefully before purchase.
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-center text-[11px] leading-relaxed text-white/55 md:text-xs">
              Product availability, formulations, and prices may change without notice. Distributor
              incentives apply only according to program rules shared with enrolled partners.
            </p>
          </div>
        </footer>
        <a
          href={`https://wa.me/${siteConfig.whatsappAi.replace("+", "")}?text=${encodeURIComponent("Hello! I'm interested in your products.")}`}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition-colors hover:bg-[#20BA5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp Us
        </a>
      </body>
    </html>
  );
}
