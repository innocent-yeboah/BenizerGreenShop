"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { readWishlistFromStorage, WISHLIST_UPDATED_EVENT } from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function WishlistNavLink({
  className,
  muted,
  variant = "default",
}: {
  className?: string;
  muted?: boolean;
  variant?: "default" | "minimal";
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
        "relative inline-flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        variant === "minimal"
          ? "rounded-full text-neutral-800 transition-opacity hover:opacity-65 focus-visible:outline-neutral-900"
          : cn(
              "rounded-lg text-brand-green-dark hover:bg-brand-green/8 hover:text-brand-green",
              muted && "text-brand-green-dark/70",
            ),
        className,
      )}
    >
      <Heart className="size-[22px]" strokeWidth={variant === "minimal" ? 1.5 : 1.85} aria-hidden />
      {count > 0 ? (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full px-[3px] text-[0.6rem] font-bold leading-none text-white tabular-nums ring-2",
            variant === "minimal" ? "bg-neutral-900 ring-white" : "bg-brand-gold-dark ring-brand-cream",
          )}
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
