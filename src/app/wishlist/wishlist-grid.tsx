"use client";

import Image from "next/image";
import Link from "next/link";
import { readWishlistFromStorage, writeWishlist, WISHLIST_UPDATED_EVENT } from "@/lib/wishlist";
import { products } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useEffect, useState } from "react";

export function WishlistGrid() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readWishlistFromStorage());
    sync();
    window.addEventListener(WISHLIST_UPDATED_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_UPDATED_EVENT, sync);
  }, []);

  const wished = products.filter((p) => slugs.includes(p.slug));

  if (!slugs.length) {
    return (
      <main className="container-shell pb-24 pt-10 md:pb-14 md:pt-14">
        <h1 className="text-3xl font-bold text-brand-green-dark md:text-4xl">Wishlist</h1>
        <p className="mt-3 max-w-md text-brand-charcoal/78">
          Save products while you browse. Open any product detail and tap <strong>Wishlist</strong> to add it here—your
          list stays only on this device.
        </p>
        <Link
          href="/products"
          className="btn-primary mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Browse shop
        </Link>
      </main>
    );
  }

  if (!wished.length) {
    return (
      <main className="container-shell pb-24 pt-10 md:pb-14 md:pt-14">
        <h1 className="text-3xl font-bold text-brand-green-dark md:text-4xl">Wishlist</h1>
        <p className="mt-3 text-brand-charcoal/78">
          We couldn&apos;t match any saved handles to active catalog releases. Refresh your picks below.
        </p>
        <button
          type="button"
          className="mt-6 rounded-lg border border-brand-green/35 px-4 py-2 text-sm font-semibold text-brand-green-dark hover:bg-brand-green/10"
          onClick={() => {
            writeWishlist([]);
            setSlugs([]);
          }}
        >
          Clear wishlist
        </button>
        <Link href="/products" className="btn-primary ml-4 mt-6 inline-flex">
          Explore products
        </Link>
      </main>
    );
  }

  return (
    <main className="container-shell pb-24 pt-10 md:pb-14 md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green-dark md:text-4xl">Wishlist</h1>
          <p className="mt-2 text-sm text-brand-charcoal/72">{wished.length} saved product{wished.length === 1 ? "" : "s"}.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            writeWishlist([]);
            setSlugs([]);
          }}
          className="text-sm font-semibold text-brand-green-dark underline underline-offset-4 hover:text-brand-green"
        >
          Clear all
        </button>
      </div>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wished.map((product) => (
          <article
            key={product.slug}
            className="surface-card flex flex-col overflow-hidden rounded-xl border-brand-gold/20 p-0"
          >
            <div className="relative aspect-4/3 w-full bg-brand-cream">
              <Image
                src={product.images[0]}
                alt={product.shortTitle}
                fill
                className="object-contain p-2 sm:p-3"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-green">{product.category}</p>
              <h2 className="mt-1 text-[0.9375rem] font-semibold leading-snug text-brand-green-dark">{product.shortTitle}</h2>
              <p className="mt-2 text-base font-bold text-brand-green">{currencyFormatter.format(product.price)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/products/${product.slug}`} className="btn-secondary min-h-9 px-3 py-2 text-xs font-semibold">
                  View
                </Link>
                <AddToCartButton slug={product.slug} className="min-h-9 px-3 py-2 text-xs font-semibold" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
