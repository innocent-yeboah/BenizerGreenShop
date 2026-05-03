import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/site-data";
import { siteConfig } from "@/lib/site-data";
import { BrandWordmark } from "@/components/brand-wordmark";

type Props = {
  /** First featured product drives the right-hand visual; optional. */
  heroProduct?: Product;
};

export function HomeHero({ heroProduct }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-brand-green/10">
      <div className="absolute inset-0 bg-[#f3f1eb]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_100%_-10%,rgba(13,59,15,0.09),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_100%,rgba(196,184,150,0.12),transparent_50%)]"
        aria-hidden
      />

      <div className="container-shell relative py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          <header className="lg:col-span-7">
            <h1 className="sr-only">
              {siteConfig.name} — {siteConfig.description}
            </h1>

            <div className="flex items-center gap-3 sm:gap-4">
              <span
                className="h-10 w-px shrink-0 bg-linear-to-b from-transparent via-[#a8956a]/65 to-transparent sm:h-11"
                aria-hidden
              />
              <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-brand-charcoal/38 sm:text-[11px]">
                {siteConfig.tagline}
              </p>
            </div>

            <div className="mt-8 max-w-xl">
              <div aria-hidden>
                <BrandWordmark variant="editorial" className="[&_span]:leading-tight" />
              </div>

              <div className="mt-6 h-px max-w-[4.5rem] bg-linear-to-r from-[#8a7b5c]/70 to-transparent" aria-hidden />

              <p className="mt-7 text-base font-normal leading-relaxed text-brand-charcoal/65 md:text-[1.05rem] md:leading-relaxed">
                {siteConfig.description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-x-4 sm:gap-y-3">
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-green-dark px-8 text-sm font-semibold tracking-wide text-white shadow-[0_18px_42px_-22px_rgba(13,59,15,0.55)] transition-colors hover:bg-brand-green"
                >
                  Explore the collection
                </Link>
                <Link
                  href="/become-distributor"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-brand-green-dark/25 bg-white/70 px-7 text-sm font-semibold text-brand-green-dark shadow-sm backdrop-blur-sm transition-colors hover:border-brand-green-dark/45 hover:bg-white"
                >
                  Partner program
                </Link>
              </div>

              <div className="mt-10 border-t border-brand-green-dark/[0.08] pt-8">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-charcoal/38 transition-colors hover:text-brand-green-dark"
                >
                  <span
                    className="inline-flex size-8 items-center justify-center rounded-full border border-brand-green-dark/12 bg-white/80"
                    aria-hidden
                  >
                    <Image
                      src="/icons/social/instagram.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="opacity-65"
                    />
                  </span>
                  {siteConfig.social.instagramHandle}
                </a>
              </div>
            </div>
          </header>

          <div className="lg:col-span-5">
            {heroProduct ? (
              <Link href={`/products/${heroProduct.slug}`} prefetch={false} className="group mx-auto block max-w-md lg:mr-0 lg:ml-auto lg:max-w-none">
                <div className="relative overflow-hidden rounded-[1.625rem] bg-linear-to-br from-white to-brand-cream/40 p-6 shadow-[0_28px_64px_-36px_rgba(13,59,15,0.55)] ring-1 ring-black/[0.04] transition-[box-shadow] duration-500 hover:shadow-[0_36px_72px_-32px_rgba(13,59,15,0.45)] sm:p-8">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={heroProduct.images[0]}
                      alt={heroProduct.shortTitle}
                      fill
                      priority
                      className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 92vw, 38vw"
                    />
                  </div>
                  <p className="mt-5 border-t border-brand-green/10 pt-4 text-center font-heading text-[10px] font-bold uppercase tracking-[0.35em] text-brand-charcoal/35">
                    Signature selection
                  </p>
                  <p className="mt-2 text-center text-sm font-semibold text-brand-green-dark">{heroProduct.shortTitle}</p>
                </div>
              </Link>
            ) : (
              <div
                className="mx-auto aspect-[4/5] max-w-md rounded-[1.625rem] bg-linear-to-br from-brand-green/7 via-transparent to-brand-cream/35 ring-1 ring-brand-green/10 lg:ml-auto lg:mr-0"
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
