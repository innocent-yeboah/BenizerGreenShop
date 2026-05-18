import Link from "next/link";
import { User } from "lucide-react";
import { BrandSealMark } from "@/components/brand-seal";
import { CartNavLink } from "@/components/cart-nav-link";
import { HeaderProductSearch } from "@/components/header-product-search";
import { WishlistNavLink } from "@/components/wishlist-nav-link";
import { siteConfig } from "@/lib/site-data";

type SessionUser = {
  role: string;
} | null;

const navLink =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-800 transition-opacity hover:opacity-65 xl:text-xs xl:tracking-[0.26em]";

export function DesktopStoreHeader({ currentUser }: { currentUser: SessionUser }) {
  return (
    <div className="relative mx-auto hidden h-[4.25rem] w-full max-w-7xl items-center px-6 lg:flex xl:h-[4.5rem] xl:px-8">
      <div className="flex min-w-0 flex-1 justify-start">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — Home`}
          className="group inline-flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
        >
          <BrandSealMark variant="nav" priority />
          <span className="hidden min-w-0 flex-col justify-center gap-0.5 lg:flex">
            <span className="truncate font-accent text-[1.0625rem] font-semibold tracking-[0.02em] text-neutral-900 xl:text-[1.125rem]">
              Benizer Green Shop
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              {siteConfig.brandLockupSubtitle}
            </span>
          </span>
        </Link>
      </div>

      <nav
        className="absolute left-1/2 top-1/2 flex max-w-[min(52rem,calc(100vw-22rem))] -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-center gap-x-7 gap-y-2 xl:gap-x-10"
        aria-label="Primary"
      >
        <Link href="/products" prefetch={false} className={navLink}>
          Shop
        </Link>
        <Link href="/products#categories" prefetch={false} className={navLink}>
          Categories
        </Link>
        <Link href="/about" prefetch={false} className={navLink}>
          About
        </Link>
        {currentUser && (currentUser.role === "distributor" || currentUser.role === "admin") ? (
          <Link href="/distributor" prefetch={false} className={navLink}>
            Partner
          </Link>
        ) : null}
        {currentUser?.role === "admin" ? (
          <Link href="/admin" prefetch={false} className={navLink}>
            Admin
          </Link>
        ) : null}
        <Link href="/contact" prefetch={false} className={navLink}>
          Contact
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
        <HeaderProductSearch />
        <WishlistNavLink variant="minimal" />
        <Link
          href={currentUser ? "/account" : "/auth/sign-in"}
          prefetch={false}
          aria-label={currentUser ? "My account" : "Sign in"}
          title={currentUser ? "My account" : "Sign in"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          <User className="size-[22px]" strokeWidth={1.5} aria-hidden />
        </Link>
        <CartNavLink variant="minimal" />
      </div>
    </div>
  );
}
