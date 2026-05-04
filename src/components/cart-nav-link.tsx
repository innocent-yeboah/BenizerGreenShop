"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CART_UPDATED_EVENT,
  getCartTotalQuantity,
  readCartFromStorage,
} from "@/lib/cart";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "icon" | "accent" | "minimal";
};

export function CartNavLink({ className, variant = "icon" }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getCartTotalQuantity(readCartFromStorage()));
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

  const ariaLabel =
    count > 0
      ? `Shopping cart, ${count} item${count === 1 ? "" : "s"}`
      : "Shopping cart";

  return (
    <Link
      href="/cart"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "relative shrink-0 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        variant === "accent"
          ? "inline-flex h-11 w-11 rounded-full bg-brand-green-dark text-white shadow-md ring-1 ring-black/10 hover:bg-brand-green hover:text-white"
          : variant === "minimal"
            ? "inline-flex h-10 w-10 rounded-full text-neutral-800 transition-opacity hover:opacity-65 focus-visible:outline-neutral-900"
            : "inline-flex h-10 w-10 rounded-lg text-brand-green-dark ring-1 ring-transparent hover:bg-brand-green/8 hover:text-brand-green hover:ring-brand-green/12",
        className,
      )}
    >
      <ShoppingCart
        className="h-[22px] w-[22px]"
        strokeWidth={variant === "accent" ? 2.2 : variant === "minimal" ? 1.5 : 2}
        aria-hidden
      />
      {count > 0 ? (
        <span
          className={cn(
            "absolute inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.65rem] font-bold leading-none text-white tabular-nums ring-2",
            variant === "accent"
              ? "-right-0.5 -top-0.5 bg-brand-gold-dark ring-brand-green-dark"
              : variant === "minimal"
                ? "-right-0.5 -top-0.5 bg-neutral-900 ring-white"
                : "-right-0.5 -top-0.5 bg-brand-green ring-brand-cream",
          )}
          aria-hidden
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
