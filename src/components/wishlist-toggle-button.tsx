"use client";

import { Heart } from "lucide-react";
import {
  dispatchWishlistUpdated,
  readWishlistFromStorage,
  writeWishlist,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type Props = {
  slug: string;
  className?: string;
  variant?: "ghost" | "outline" | "icon";
};

export function WishlistToggleButton({ slug, className, variant = "outline" }: Props) {
  const [saved, setSaved] = useState(false);

  const sync = useCallback(() => {
    setSaved(readWishlistFromStorage().includes(slug));
  }, [slug]);

  useEffect(() => {
    queueMicrotask(() => sync());
    window.addEventListener(WISHLIST_UPDATED_EVENT, sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, [slug, sync]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${slug} from wishlist` : `Save ${slug} to wishlist`}
      onClick={() => {
        const next = readWishlistFromStorage();
        if (next.includes(slug)) {
          writeWishlist(next.filter((s) => s !== slug));
        } else {
          writeWishlist([...next, slug]);
        }
        dispatchWishlistUpdated();
      }}
      className={cn(
        "inline-flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        variant === "icon"
          ? cn(
              "size-8 rounded-full border border-white/80 bg-white/95 text-brand-green-dark shadow-sm backdrop-blur-sm hover:bg-white",
              saved && "border-brand-green bg-brand-green/10 text-brand-green",
            )
          : cn(
              "gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
              variant === "outline"
                ? "border border-brand-green-dark/35 bg-white text-brand-green-dark hover:border-brand-green hover:bg-brand-green/6"
                : "border border-transparent bg-brand-charcoal/5 text-brand-green-dark hover:bg-brand-charcoal/10",
              saved && "border-brand-green bg-brand-green/12 text-brand-green-dark",
            ),
        className,
      )}
    >
      <Heart
        className={cn(variant === "icon" ? "size-4" : "size-[1.125rem]", saved ? "fill-current" : "")}
        strokeWidth={2}
        aria-hidden
      />
      {variant === "icon" ? (
        <span className="sr-only">{saved ? "Saved to wishlist" : "Add to wishlist"}</span>
      ) : saved ? (
        "Saved"
      ) : (
        "Wishlist"
      )}
    </button>
  );
}
