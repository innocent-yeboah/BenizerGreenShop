"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { readWishlistFromStorage, WISHLIST_UPDATED_EVENT } from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function WishlistNavLink({
  className,
  muted,
}: {
  className?: string;
  muted?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readWishlistFromStorage().length);
    sync();
    window.addEventListener(WISHLIST_UPDATED_EVENT, sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  return (
    <Link
      href="/wishlist"
      aria-label={count ? `Wishlist, ${count} items` : "Wishlist"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-green/8 hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        muted ? "text-brand-green-dark/70" : "text-brand-green-dark",
        className,
      )}
    >
      <Heart className="size-[22px]" strokeWidth={1.85} aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold-dark px-[3px] text-[0.6rem] font-bold leading-none text-white tabular-nums ring-2 ring-brand-cream">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
