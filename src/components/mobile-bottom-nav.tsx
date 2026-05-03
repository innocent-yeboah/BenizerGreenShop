"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Home,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCartTotalQuantity, readCartFromStorage } from "@/lib/cart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [cartQty, setCartQty] = useState(0);

  useEffect(() => {
    const sync = () => setCartQty(getCartTotalQuantity(readCartFromStorage()));
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  const path = pathname ?? "";

  if (
    path.startsWith("/admin") ||
    path.startsWith("/distributor") ||
    path.startsWith("/auth") ||
    path.startsWith("/become-distributor")
  ) {
    return null;
  }

  const navItem = ({
    href,
    label,
    icon: Icon,
    active,
    badge,
  }: {
    href: string;
    label: string;
    icon: typeof Home;
    active: boolean;
    badge?: number;
  }) => (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.62rem] font-semibold tracking-wide transition-colors",
        active ? "text-brand-green-dark" : "text-brand-charcoal/45 hover:text-brand-green-dark/85",
      )}
    >
      <span className="relative inline-flex items-center justify-center">
        <Icon
          strokeWidth={active ? 2.4 : 2}
          className={cn("size-[22px]", active && "text-brand-green")}
          aria-hidden
        />
        {badge !== undefined && badge > 0 ? (
          <span className="absolute -right-1.5 -top-1 inline-flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full bg-brand-green px-[3px] text-[9px] font-bold leading-none text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Store navigation"
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-[60] border-t border-brand-green/15 bg-white/92 pb-[calc(6px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_-6px_rgba(13,59,15,0.15)] backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/82 md:hidden"
    >
      <div className="mx-auto flex max-w-lg px-2">
        {navItem({
          href: "/",
          label: "Home",
          icon: Home,
          active: path === "/",
        })}
        {navItem({
          href: "/products",
          label: "Shop",
          icon: ShoppingBag,
          active: path === "/products" || path.startsWith("/products/"),
        })}
        {navItem({
          href: "/cart",
          label: "Cart",
          icon: ShoppingCart,
          active: path === "/cart",
          badge: cartQty,
        })}
        {navItem({
          href: "/wishlist",
          label: "Wishlist",
          icon: Heart,
          active: path === "/wishlist",
        })}
        {navItem({
          href: "/account",
          label: "Account",
          icon: User,
          active: path.startsWith("/account"),
        })}
      </div>
    </nav>
  );
}
