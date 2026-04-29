"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CART_UPDATED_EVENT,
  getCartTotalQuantity,
  readCartFromStorage,
} from "@/lib/cart";

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

  return (
    <Link href="/cart" className={className}>
      <span className="inline-flex items-center gap-1.5">
        <span>Cart</span>
        {count > 0 ? (
          <span
            className="inline-flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-green px-1 text-[0.65rem] font-bold leading-none text-white tabular-nums"
            aria-label={`${count} items in cart`}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
