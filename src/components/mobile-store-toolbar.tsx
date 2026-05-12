"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    queueMicrotask(() => setPortalTarget(document.body));
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (hide) return null;

  const drawer =
    menuOpen && portalTarget
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Dismiss menu backdrop"
              className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[1px]"
              onClick={() => setMenuOpen(false)}
            />
            <aside
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-drawer-title"
              className="fixed left-0 top-0 z-[95] flex h-dvh max-h-dvh w-[min(20rem,calc(100vw-3rem))] max-w-[100vw] flex-col border-r border-brand-green/12 bg-brand-cream shadow-2xl supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh]"
            >
              <div className="flex items-center justify-between border-b border-brand-green/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <p
                  id="mobile-nav-drawer-title"
                  className="font-heading text-sm font-bold uppercase tracking-wider text-brand-green-dark"
                >
                  Menu
                </p>
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
                className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overscroll-contain pb-[max(2.75rem,env(safe-area-inset-bottom))] pt-4"
                onClick={() => setMenuOpen(false)}
              >
                <DrawerLinkRow href="/">Home</DrawerLinkRow>
                <DrawerLinkRow href="/products">Shop</DrawerLinkRow>
                <DrawerLinkRow href="/cart">Cart</DrawerLinkRow>
                <DrawerLinkRow href="/wishlist">Wishlist</DrawerLinkRow>
                <DrawerLinkRow href="/about">About</DrawerLinkRow>
                <DrawerLinkRow href="/contact">Contact</DrawerLinkRow>
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
          </>,
          portalTarget,
        )
      : null;

  return (
    <div className="border-b border-neutral-200 bg-white md:hidden">
      <div className="relative mx-auto flex w-full max-w-7xl items-center gap-2 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => {
              setMenuOpen((v) => !v);
              setSearchOpen(false);
            }}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-neutral-900"
          >
            {menuOpen ? (
              <X className="size-[22px]" aria-hidden strokeWidth={2} />
            ) : (
              <Menu className="size-[22px]" aria-hidden strokeWidth={2} />
            )}
            <span className="sr-only">{menuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
          </button>

          <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} — Home`}>
            <span className="relative isolate flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-50 ring-1 ring-neutral-200">
              <Image
                src="/benizer-logo.svg"
                alt=""
                width={72}
                height={72}
                className="h-full w-full scale-[1.02] object-contain mix-blend-multiply"
                priority
              />
            </span>
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="inline-flex size-11 items-center justify-center rounded-xl text-neutral-800 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <Search className="size-[22px]" aria-hidden strokeWidth={2} />
            <span className="sr-only">{searchOpen ? "Close search" : "Search products"}</span>
          </button>
          <WishlistNavLink />
          <CartNavLink variant="accent" />
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-neutral-200 bg-neutral-50/90 px-3 py-3">
          <InlineMobileProductSearch />
        </div>
      ) : null}

      {drawer}
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
