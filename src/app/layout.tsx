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
import { siteConfig } from "@/lib/site-data";
import { getCurrentUserWithRole } from "@/lib/auth";
import { signOutAction } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
        <header className="sticky top-0 z-50 border-b border-brand-green/10 bg-brand-cream/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Image
                src="/benizer-logo.png"
                alt=""
                width={84}
                height={84}
                className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
                priority
              />
              <BrandWordmark className="leading-none" />
            </Link>
            <nav className="hidden gap-6 text-sm font-semibold md:flex">
              <Link href="/products">Products</Link>
              <Link href="/about">About Us</Link>
              <CartNavLink />
              <Link href="/become-distributor">Become a Distributor</Link>
              {currentUser?.role === "admin" ? (
                <Link href="/admin">Admin</Link>
              ) : null}
              {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
                <Link href="/distributor">Distributor</Link>
              ) : null}
              {currentUser ? (
                <form action={signOutAction}>
                  <button type="submit" className="cursor-pointer">
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link href="/auth/sign-in">Sign In</Link>
              )}
            </nav>
          </div>
          <nav className="mx-auto flex w-full max-w-7xl gap-4 overflow-x-auto px-6 pb-3 text-xs font-semibold md:hidden">
            <Link href="/products" className="whitespace-nowrap">
              Products
            </Link>
            <Link href="/about" className="whitespace-nowrap">
              About
            </Link>
            <CartNavLink />
            <Link href="/become-distributor" className="whitespace-nowrap">
              Distributor
            </Link>
            {currentUser?.role === "admin" ? (
              <Link href="/admin" className="whitespace-nowrap">
                Admin
              </Link>
            ) : null}
            {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
              <Link href="/distributor" className="whitespace-nowrap">
                Distributor
              </Link>
            ) : null}
            {currentUser ? (
              <form action={signOutAction}>
                <button type="submit" className="cursor-pointer whitespace-nowrap">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link href="/auth/sign-in" className="whitespace-nowrap">
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
        </footer>
        <a
          href={`https://wa.me/${siteConfig.whatsappAi.replace("+", "")}?text=${encodeURIComponent("Hello! I'm interested in your products.")}`}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition-colors hover:bg-[#20BA5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp Us
        </a>
      </body>
    </html>
  );
}
