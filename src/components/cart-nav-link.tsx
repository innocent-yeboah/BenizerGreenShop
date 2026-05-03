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
};

export function CartNavLink({ className }: Props) {
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
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-brand-green-dark ring-1 ring-transparent transition-colors hover:bg-brand-green/8 hover:text-brand-green hover:ring-brand-green/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        className,
      )}
    >
      <ShoppingCart className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
      {count > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-green px-1 text-[0.65rem] font-bold leading-none text-white tabular-nums ring-2 ring-brand-cream"
          aria-hidden
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
