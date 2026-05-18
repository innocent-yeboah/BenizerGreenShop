"use client";

import { useState } from "react";
import { CART_KEY, dispatchCartUpdated, type CartItem } from "@/lib/cart";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  quantity?: number;
  className?: string;
};

export function AddToCartButton({ slug, quantity = 1, className }: Props) {
  const [label, setLabel] = useState("Add to Cart");

  return (
    <button
      className={cn("btn-ghost", className)}
      onClick={() => {
        const raw = localStorage.getItem(CART_KEY);
        const existing: CartItem[] = raw ? JSON.parse(raw) : [];
        const idx = existing.findIndex((item) => item.slug === slug);

        if (idx >= 0) {
          existing[idx].quantity += quantity;
        } else {
          existing.push({ slug, quantity });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(existing));
        dispatchCartUpdated();
        setLabel("Added");
        setTimeout(() => setLabel("Add to Cart"), 1200);
      }}
      type="button"
    >
      {label}
    </button>
  );
}
