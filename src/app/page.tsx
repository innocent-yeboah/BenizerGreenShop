import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  distributorPackages,
  type DistributorPackageTier,
  products,
  siteTestimonials,
} from "@/lib/site-data";
import { cn, currencyFormatter } from "@/lib/utils";
import { getCurrentUserWithRole } from "@/lib/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { HomeHero } from "@/components/home-hero";
import { HeroSlider } from "@/components/hero-slider";
import { HomeHighlightStats } from "@/components/home-highlight-stats";
import { TestimonialsSection } from "@/components/testimonials-section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const featured = products.filter((product) => product.featured);
  const heroProduct = featured[0];

  let shareEarnHref: string = "/become-distributor";
  const userCtx = await getCurrentUserWithRole();
  if (userCtx?.role === "admin") {
    shareEarnHref = "/distributor";
  } else if (userCtx?.role === "distributor" && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: distributor } = await supabase
      .from("distributors")
      .select("approved")
      .eq("user_id", userCtx.user.id)
      .maybeSingle();
    if (distributor?.approved) {
      shareEarnHref = "/distributor";
    }
  }

  const tierVisual: Record<
    DistributorPackageTier,
    { card: string; bar: string; label: string; price: string; blurb: string }
  > = {
    starter: {
      card: "border-2 border-emerald-500/45 bg-linear-to-br from-emerald-50 via-white to-emerald-50/50 shadow-[0_12px_36px_-16px_rgba(6,78,59,0.35)]",
      bar: "bg-emerald-600",
      label: "text-emerald-900",
      price: "text-emerald-950",
      blurb: "text-emerald-800/80",
    },
    revocare: {
      card: "border-2 border-teal-500/55 bg-linear-to-br from-teal-50 via-cyan-50/90 to-teal-100/70 shadow-[0_12px_36px_-16px_rgba(13,148,136,0.35)] ring-1 ring-teal-400/30",
      bar: "bg-linear-to-r from-teal-500 to-cyan-600",
      label: "text-teal-950",
      price: "text-teal-950",
      blurb: "text-teal-900/85",
    },
    bronze: {
      card: "border-2 border-amber-800/55 bg-linear-to-br from-amber-200/95 via-orange-100 to-amber-100 shadow-[0_12px_36px_-16px_rgba(120,53,15,0.35)]",
      bar: "bg-linear-to-r from-amber-800 to-orange-700",
      label: "text-amber-950",
      price: "text-[#5c2d0a]",
      blurb: "text-amber-900/85",
    },
    silver: {
      card: "border-2 border-slate-400/70 bg-linear-to-br from-slate-100 via-slate-50 to-slate-200/80 shadow-[0_12px_36px_-16px_rgba(51,65,85,0.3)]",
      bar: "bg-linear-to-r from-slate-400 via-slate-300 to-slate-500",
      label: "text-slate-900",
      price: "text-slate-950",
      blurb: "text-slate-700",
    },
    gold: {
      card: "border-2 border-amber-500/80 bg-linear-to-br from-yellow-200/90 via-amber-100 to-yellow-50 ring-2 ring-amber-400/45 shadow-[0_14px_40px_-14px_rgba(180,83,9,0.45)]",
      bar: "bg-linear-to-r from-yellow-500 via-amber-500 to-yellow-600",
      label: "text-amber-950",
      price: "text-[#713f12]",
      blurb: "text-amber-900/85",
    },
  };
  return (
    <main className="flex-1">
      <HomeHero heroProduct={heroProduct} />

      <HeroSlider />

      <HomeHighlightStats />

      <section className="container-shell pb-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-brand-green-dark">
            Best Selling Products
          </h2>
          <Link href="/products" className="font-semibold text-brand-green">
            View all products
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <article
              key={product.slug}
              className="surface-card lift-on-hover flex flex-col overflow-hidden rounded-2xl p-0"
            >
              <div className="relative aspect-square w-full bg-brand-cream">
                <Image
                  src={product.images[0]}
                  alt={product.shortTitle}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-brand-green">{product.category}</p>
                <h3 className="mt-2 text-xl font-bold">{product.shortTitle}</h3>
                <p className="mt-1 text-sm text-brand-charcoal/70">{product.shortBenefit}</p>
                <p className="mt-4 text-lg font-bold text-brand-green">{currencyFormatter.format(product.price)}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/products/${product.slug}`} className="btn-primary px-4 py-2">
                    View Details
                  </Link>
                  <AddToCartButton slug={product.slug} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-green px-6 py-14 text-white">
        <div className="container-shell rounded-3xl border border-white/20 bg-brand-green-dark/35 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">
            Get More For Less
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Get 40% Distributor Pricing On Product Bundles
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Become a registered Benizer distributor to unlock lower package rates
            and recurring earnings.
          </p>
          <Link
            href="/become-distributor"
            className="btn-secondary mt-6 bg-white text-brand-green border-white hover:bg-brand-cream hover:text-brand-green-dark hover:border-brand-cream"
          >
            Join The Distributor Program
          </Link>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-brand-green-dark">Distributor Packages</h2>
            <p className="mt-4 text-base font-semibold leading-snug text-brand-charcoal md:text-lg">
              Pick the tier that fits you—earn more on every sale, with training, tools, and support included.
            </p>
          </div>
          <Link
            href={shareEarnHref}
            className="btn-ghost inline-flex shrink-0 items-center justify-center px-8 py-3.5 text-center text-sm font-bold shadow-md ring-1 ring-brand-charcoal/10 whitespace-nowrap"
          >
            Share &amp; earn
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {distributorPackages.map((pkg) => {
            const v = tierVisual[pkg.tier];
            return (
              <article
                key={pkg.tier}
                className={cn(
                  "lift-on-hover relative overflow-hidden rounded-2xl p-5 pt-6",
                  v.card,
                )}
              >
                {pkg.bestValue ? (
                  <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm">
                    Best value
                  </span>
                ) : pkg.promo ? (
                  <span className="absolute right-3 top-3 rounded-full bg-teal-600 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm">
                    Promo
                  </span>
                ) : null}
                <div
                  className={cn("absolute inset-x-0 top-0 h-1.5", v.bar)}
                  aria-hidden
                />
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    v.blurb,
                  )}
                >
                  {pkg.blurb}
                </p>
                <p className={cn("mt-2 text-sm font-semibold", v.label)}>
                  {pkg.subtitle ?? `${pkg.name} membership`}
                </p>
                <p className={cn("mt-3 text-2xl font-bold tabular-nums", v.price)}>
                  {currencyFormatter.format(pkg.price)}
                </p>
                <p className={cn("mt-1 text-sm tabular-nums opacity-90", v.blurb)}>
                  ~${pkg.usdApprox.toLocaleString()} USD
                </p>
                <ul className={cn("mt-4 space-y-1.5 text-sm", v.blurb)}>
                  <li className="font-semibold">
                    {pkg.quantityNote ??
                      `${pkg.boxes} ${pkg.boxes === 1 ? "box" : "boxes"} of product`}
                  </li>
                  <li>
                    <span className="font-semibold">{pkg.pv}</span> PV
                  </li>
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <TestimonialsSection items={siteTestimonials} />
    </main>
  );
}
