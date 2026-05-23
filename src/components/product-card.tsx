import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/site-data";
import { currencyFormatter, cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist-toggle-button";

type Props = {
  product: Product;
  className?: string;
  /** Catalog grid uses icon wishlist + single-line copy; homepage can show 2-line benefit. */
  benefitLines?: 1 | 2;
};

/** Compact product tile — dense grid, image overlay wishlist, minimal actions. */
export function ProductCard({ product, className, benefitLines = 1 }: Props) {
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group surface-card flex flex-col overflow-hidden rounded-lg border border-brand-charcoal/[0.06] bg-white shadow-[0_2px_12px_-8px_rgba(13,59,15,0.18)] transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(13,59,15,0.28)]",
        className,
      )}
    >
      <div className="relative aspect-square w-full bg-brand-cream/80">
        <Link href={href} className="absolute inset-0 z-0 block" aria-label={`View ${product.shortTitle}`}>
          <Image
            src={product.images[0]}
            alt=""
            fill
            className="object-contain p-1.5 sm:p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
          />
        </Link>
        <WishlistToggleButton
          slug={product.slug}
          variant="icon"
          className="absolute right-1.5 top-1.5 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-green/85 sm:text-[10px]">
          {product.category}
        </p>
        <Link href={href} className="mt-0.5 block hover:text-brand-green">
          <h2 className="line-clamp-1 text-[13px] font-semibold leading-snug text-brand-green-dark sm:text-sm">
            {product.shortTitle}
          </h2>
        </Link>
        <p
          className={cn(
            "mt-0.5 text-[11px] leading-snug text-brand-charcoal/65",
            benefitLines === 2 ? "line-clamp-2" : "line-clamp-1",
          )}
        >
          {product.shortBenefit}
        </p>

        <div className="mt-auto pt-2">
          <p className="text-sm font-bold tabular-nums text-brand-green sm:text-[0.9375rem]">
            {currencyFormatter.format(product.price)}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <AddToCartButton
              slug={product.slug}
              className="min-h-8 flex-1 rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide sm:min-h-9 sm:text-xs"
            />
            <Link
              href={href}
              className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md border border-brand-green/20 px-2.5 text-[11px] font-semibold text-brand-green-dark transition-colors hover:border-brand-green/40 hover:bg-brand-green/5 sm:min-h-9 sm:px-3 sm:text-xs"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
