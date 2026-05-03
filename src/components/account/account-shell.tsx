"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: "/account" as const },
  { href: "/account/orders", label: "Orders", icon: Package, prefix: "/account/orders" as const },
  { href: "/wishlist", label: "Wishlist", icon: Heart, prefix: "/wishlist" as const },
  { href: "/account/profile", label: "Profile", icon: UserRound, prefix: "/account/profile" as const },
  { href: "/order-status", label: "Track order", icon: Truck, prefix: "/order-status" as const },
  { href: "/products", label: "Shop", icon: ShoppingBag, shop: true as const },
] as const;

type Props = {
  displayName: string;
  email: string;
  children: React.ReactNode;
};

function initials(name: string, email: string) {
  const n = name.trim();
  if (n.length >= 2) return n.slice(0, 2).toUpperCase();
  const pre = email.split("@")[0]?.replace(/\./g, " ") ?? "";
  const parts = pre.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (email[0] ?? "?").toUpperCase() + (email[1] ?? "").toUpperCase();
}

export function AccountShell({ displayName, email, children }: Props) {
  const pathname = usePathname() ?? "";

  function navItemActive(item: (typeof links)[number]) {
    if ("exact" in item) return pathname === item.exact;
    if ("prefix" in item)
      return pathname === item.prefix || pathname.startsWith(`${item.prefix}/`);
    if ("shop" in item && item.shop)
      return pathname === "/products" || pathname.startsWith("/products/");
    return pathname.startsWith(item.href);
  }

  const mark = initials(displayName, email);

  return (
    <div className="px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:mx-auto md:max-w-6xl md:px-6 md:pb-16 xl:max-w-[1152px]">
      <nav
        aria-label="Account shortcuts"
        className="-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain border-b border-brand-green/10 bg-brand-cream/95 px-4 py-3 pb-4 md:mx-0 md:hidden md:border-0 md:bg-transparent md:px-0 md:pb-0"
      >
        {links.map((item) => {
          const active = navItemActive(item);
          const { href, label, icon: Icon } = item;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                active
                  ? "bg-brand-green-dark text-white shadow-sm"
                  : "bg-white/90 text-brand-green-dark/85 ring-1 ring-brand-green/12 hover:bg-white",
              )}
            >
              <Icon className="size-3.5 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-10 md:mt-0 md:flex-row md:gap-10 lg:gap-12">
        <aside className="hidden w-56 shrink-0 md:block lg:w-64">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-2xl border border-brand-green/12 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(13,59,15,0.28)]">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-green-dark text-sm font-bold text-white shadow-inner"
                  aria-hidden
                >
                  {mark}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-green-dark">{displayName}</p>
                  <p className="truncate text-xs text-brand-charcoal/55" title={email}>
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <nav aria-label="Account" className="space-y-0.5">
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">
                Your account
              </p>
              {links.map((item) => {
                const active = navItemActive(item);
                const { href, label, icon: Icon } = item;
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-brand-green/12 text-brand-green-dark"
                        : "text-brand-charcoal/75 hover:bg-brand-charcoal/5 hover:text-brand-green-dark",
                    )}
                  >
                    <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-green-dark/18 bg-white px-4 py-3 text-sm font-semibold text-brand-green-dark transition-colors hover:border-brand-green/35 hover:bg-brand-cream/50"
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1 md:pt-2">{children}</div>
      </div>
    </div>
  );
}
