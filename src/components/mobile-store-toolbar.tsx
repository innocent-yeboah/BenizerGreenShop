"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-data";
import { CartNavLink } from "@/components/cart-nav-link";
import { WishlistNavLink } from "@/components/wishlist-nav-link";
import { InlineMobileProductSearch } from "@/components/mobile-search-toggle";

type Props = {
  /** Extra links / auth actions appended in the drawer. */
  children?: ReactNode;
};

export function MobileStoreToolbar({ children }: Props) {
  const path = usePathname() ?? "";
  const hide =
    path.startsWith("/admin") ||
    path.startsWith("/distributor") ||
    path.startsWith("/auth");

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (hide) return null;

  return (
    <div className="border-b border-brand-green/10 md:hidden">
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-3 sm:px-4">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => {
            setMenuOpen((v) => !v);
            setSearchOpen(false);
          }}
          className="inline-flex size-11 items-center justify-center rounded-xl border border-brand-green/14 bg-white/85 text-brand-green-dark shadow-sm hover:bg-brand-cream/80 focus-visible:outline-2 focus-visible:outline-brand-green"
        >
          {menuOpen ? (
            <X className="size-[22px]" aria-hidden strokeWidth={2} />
          ) : (
            <Menu className="size-[22px]" aria-hidden strokeWidth={2} />
          )}
          <span className="sr-only">{menuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
        </button>

        <Link href="/" className="justify-self-center" aria-label={`${siteConfig.name} — Home`}>
          <span className="relative isolate flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-cream ring-1 ring-brand-green/10">
            <Image
              src="/benizer-logo.png"
              alt=""
              width={72}
              height={72}
              className="h-full w-full scale-[1.02] object-contain mix-blend-darken"
              priority
            />
          </span>
        </Link>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="inline-flex size-11 items-center justify-center rounded-xl text-brand-green-dark hover:bg-brand-green/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <Search className="size-[22px]" aria-hidden strokeWidth={2} />
            <span className="sr-only">{searchOpen ? "Close search" : "Search products"}</span>
          </button>
          <WishlistNavLink />
          <CartNavLink variant="accent" />
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-brand-green/10 bg-brand-cream/55 px-3 py-3">
          <InlineMobileProductSearch />
        </div>
      ) : null}

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Dismiss menu backdrop"
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="mobile-nav-drawer"
            className="fixed left-0 top-0 z-[80] flex h-full w-[min(20rem,calc(100vw-4rem))] max-w-[100vw] flex-col border-r border-brand-green/12 bg-brand-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brand-green/10 px-4 py-4">
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-brand-green-dark">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-brand-green/14 bg-white text-brand-green-dark hover:bg-brand-green/10"
              >
                <X className="size-5" aria-hidden strokeWidth={2} />
              </button>
            </div>
            <nav
              aria-label="Site menu"
              className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overscroll-contain pb-12 pt-4"
              onClick={() => setMenuOpen(false)}
            >
              <DrawerLinkRow href="/">Home</DrawerLinkRow>
              <DrawerLinkRow href="/products">Shop</DrawerLinkRow>
              <DrawerLinkRow href="/cart">Cart</DrawerLinkRow>
              <DrawerLinkRow href="/wishlist">Wishlist</DrawerLinkRow>
              <DrawerLinkRow href="/about">Our story</DrawerLinkRow>
              <DrawerLinkRow href="/order-status">Track order</DrawerLinkRow>
              <DrawerLinkRow href="/become-distributor">Become a distributor</DrawerLinkRow>
              <DrawerLinkRow href="/account">Account</DrawerLinkRow>
              {children ? (
                <div className="mt-6 border-t border-brand-green/10 px-5 pt-4 text-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-green-dark/55">
                    More
                  </p>
                  <div className="flex flex-col gap-3">{children}</div>
                </div>
              ) : null}
            </nav>
          </aside>
        </>
      ) : null}
    </div>
  );
}

function DrawerLinkRow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="flex items-center justify-between border-b border-brand-green/10 px-5 py-3.5 text-sm font-semibold text-brand-green-dark hover:bg-white/70"
    >
      {children}
      <ChevronDown className="size-4 -rotate-90 text-brand-green/55" aria-hidden />
    </Link>
  );
}
