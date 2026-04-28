"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createCheckoutSession } from "@/app/actions";
import { CART_KEY, type CartItem } from "@/lib/cart";
import { products } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeCart(next: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(next));
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const checkout = useAction(createCheckoutSession);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const adjustQuantity = useCallback((slug: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      writeCart(next);
      return next;
    });
  }, []);

  const removeLine = useCallback((slug: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.slug !== slug);
      writeCart(next);
      return next;
    });
  }, []);

  const detailed = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          if (!product) return null;
          return {
            ...item,
            product,
            total: item.quantity * product.price,
          };
        })
        .filter(Boolean),
    [cart],
  );

  const total = detailed.reduce((sum, item) => sum + (item?.total || 0), 0);

  return (
    <main className="container-shell py-14">
      <h1 className="text-4xl font-bold text-brand-green-dark">Cart & Checkout</h1>
      <p className="mt-2 text-brand-charcoal/80">
        Review items, apply a referral code, and complete your secure checkout.
      </p>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-bold">Items</h2>
          {detailed.length === 0 ? (
            <p className="mt-4 text-sm text-brand-charcoal/70">Your cart is empty.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {detailed.map((item) => (
                <li
                  key={item?.slug}
                  className="surface-card flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                      <Image
                        src={item!.product.images[0]}
                        alt={item!.product.shortTitle}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{item?.product.shortTitle}</p>
                      <p className="text-sm text-brand-charcoal/60">
                        {currencyFormatter.format(item!.product.price)} each
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                    <div className="flex items-center gap-1 rounded-lg border border-brand-green/20 bg-white p-0.5">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md text-brand-green-dark hover:bg-brand-cream disabled:opacity-40"
                        aria-label={`Decrease quantity of ${item?.product.shortTitle}`}
                        onClick={() => adjustQuantity(item!.slug, -1)}
                        disabled={checkout.status === "executing"}
                      >
                        <Minus className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
                        {item?.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md text-brand-green-dark hover:bg-brand-cream disabled:opacity-40"
                        aria-label={`Increase quantity of ${item?.product.shortTitle}`}
                        onClick={() => adjustQuantity(item!.slug, 1)}
                        disabled={checkout.status === "executing"}
                      >
                        <Plus className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex size-9 items-center justify-center rounded-md text-brand-charcoal/50 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item?.product.shortTitle} from cart`}
                      onClick={() => removeLine(item!.slug)}
                      disabled={checkout.status === "executing"}
                    >
                      <Trash2 className="size-4" strokeWidth={2} aria-hidden />
                    </button>
                    <p className="min-w-22 text-right text-base font-bold text-brand-green">
                      {currencyFormatter.format(item?.total || 0)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-lg font-bold">Total: {currencyFormatter.format(total)}</p>
        </div>

        <form
          className="surface-card rounded-2xl p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!detailed.length) {
              setMessage("Your cart is empty.");
              return;
            }
            const formData = new FormData(event.currentTarget);
            const result = await checkout.executeAsync({
              customerName: String(formData.get("customerName") || ""),
              customerEmail: String(formData.get("customerEmail") || ""),
              customerPhone: String(formData.get("customerPhone") || ""),
              distributorCode: String(formData.get("distributorCode") || ""),
              items: detailed.map((item) => ({
                itemSlug: item!.slug,
                quantity: item!.quantity,
              })),
            });
            if (result?.data?.checkoutUrl) {
              localStorage.removeItem(CART_KEY);
              setCart([]);
              window.location.href = result.data.checkoutUrl;
            } else {
              setMessage("Unable to initialize checkout.");
            }
          }}
        >
          <h2 className="text-xl font-bold">Customer Information</h2>
          <div className="mt-4 space-y-3">
            <input name="customerName" placeholder="Full name" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <input name="customerEmail" type="email" placeholder="Email" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <input name="customerPhone" placeholder="Phone" className="w-full rounded-lg border border-brand-green/20 p-3" required />
            <input name="distributorCode" placeholder="Distributor referral code (optional)" className="w-full rounded-lg border border-brand-green/20 p-3" />
            <button type="submit" className="btn-primary w-full justify-center rounded-lg px-4 py-3 font-semibold shadow-sm disabled:opacity-60" disabled={!detailed.length || checkout.status === "executing"}>
              {checkout.status === "executing" ? "Processing…" : "Proceed to Payment"}
            </button>
            {message ? <p className="text-sm text-red-600">{message}</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
}
