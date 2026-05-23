"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { signOutAction } from "@/app/auth/actions";
import { BrandSealMark } from "@/components/brand-seal";
import { siteConfig } from "@/lib/site-data";
import { CartNavLink } from "@/components/cart-nav-link";
import { WishlistNavLink } from "@/components/wishlist-nav-link";
import { InlineMobileProductSearch } from "@/components/mobile-search-toggle";
import type { getCurrentUserWithRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUserWithRole>>;

type Props = {
  currentUser: CurrentUser;
};

const supportLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/order-status", label: "Track order" },
  { href: "/about", label: "About" },
] as const;

export function MobileStoreToolbar({ currentUser }: Props) {
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

  const closeMenu = () => setMenuOpen(false);

  const drawer =
    menuOpen && portalTarget
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Dismiss menu"
              className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[1px]"
              onClick={closeMenu}
            />
            <aside
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-drawer-title"
              className="fixed left-0 top-0 z-[95] flex h-dvh max-h-dvh w-[min(18rem,calc(100vw-2.5rem))] flex-col border-r border-brand-green/12 bg-brand-cream shadow-2xl supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-brand-green/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <Link href="/" onClick={closeMenu} className="inline-flex min-w-0 items-center gap-2.5">
                  <BrandSealMark variant="nav" />
                  <span id="mobile-nav-drawer-title" className="truncate font-heading text-sm font-bold text-brand-green-dark">
                    {siteConfig.name}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand-green/14 bg-white text-brand-green-dark"
                  aria-label="Close menu"
                >
                  <X className="size-5" aria-hidden strokeWidth={2} />
                </button>
              </div>

              <nav
                aria-label="More pages"
                className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain py-2"
                onClick={closeMenu}
              >
                <DrawerLink href="/products" className="font-semibold">
                  Shop all products
                </DrawerLink>
                <DrawerLink href="/become-distributor">Partner program</DrawerLink>

                <DrawerSection label="Help">
                  {supportLinks.map((item) => (
                    <DrawerLink key={item.href} href={item.href}>
                      {item.label}
                    </DrawerLink>
                  ))}
                </DrawerSection>
              </nav>

              <div
                className="shrink-0 border-t border-brand-green/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
                onClick={closeMenu}
              >
                {currentUser?.role === "admin" ? (
                  <DrawerLink href="/admin" className="mb-2 rounded-lg bg-white px-3 py-2 ring-1 ring-brand-green/12">
                    Admin
                  </DrawerLink>
                ) : null}
                {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
                  <DrawerLink
                    href="/distributor"
                    className="mb-2 rounded-lg bg-white px-3 py-2 ring-1 ring-brand-green/12"
                  >
                    Partner hub
                  </DrawerLink>
                ) : null}

                {currentUser ? (
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-brand-green-dark/20 py-2.5 text-sm font-semibold text-brand-green-dark hover:bg-white"
                    >
                      Sign out
                    </button>
                  </form>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      prefetch={false}
                      className="block rounded-xl bg-brand-green py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-green-dark"
                    >
                      Sign in
                    </Link>
                    <p className="mt-2.5 text-center text-xs text-brand-charcoal/60">
                      New here?{" "}
                      <Link href="/auth/sign-up" prefetch={false} className="font-semibold text-brand-green-dark underline-offset-2 hover:underline">
                        Create account
                      </Link>
                    </p>
                  </>
                )}
              </div>
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
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>

          <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} — Home`}>
            <BrandSealMark variant="nav" priority className="size-11 sm:size-[2.75rem]" />
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

function DrawerSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 border-t border-brand-green/8 pt-3">
      <p className="px-4 pb-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green-dark/45">{label}</p>
      {children}
    </div>
  );
}

function DrawerLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "block px-4 py-2.5 text-[15px] text-brand-green-dark transition-colors hover:bg-white/80",
        className,
      )}
    >
      {children}
    </Link>
  );
}
