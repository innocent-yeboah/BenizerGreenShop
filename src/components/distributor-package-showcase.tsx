import Link from "next/link";
import { distributorPackages, siteConfig, type DistributorPackageTier } from "@/lib/site-data";
import { cn, currencyFormatter } from "@/lib/utils";

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
  promo: {
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

type Props = {
  shareEarnHref: string;
  showShareEarn?: boolean;
};

export function DistributorPackageShowcase({ shareEarnHref, showShareEarn = true }: Props) {
  return (
    <section className="container-shell py-14 md:py-16">
      <div className="flex flex-col gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold capitalize text-brand-green-dark md:text-4xl">
            {siteConfig.homePage.packagesIntroTitle}
          </h2>
          <p className="mt-4 text-base font-medium leading-snug text-brand-charcoal/80 md:text-lg">
            {siteConfig.homePage.packagesIntroSubtitle}
          </p>
        </div>
        {showShareEarn ? (
          <Link
            href={shareEarnHref}
            className="btn-ghost mx-auto inline-flex shrink-0 items-center justify-center whitespace-nowrap px-8 py-3.5 text-center text-sm font-bold shadow-md ring-1 ring-brand-charcoal/10 lg:mx-0"
          >
            Share &amp; earn
          </Link>
        ) : null}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {distributorPackages.map((pkg) => {
          const v = tierVisual[pkg.tier];
          return (
            <article
              key={pkg.tier}
              className={cn("lift-on-hover relative overflow-hidden rounded-2xl p-5 pt-6", v.card)}
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
              <div className={cn("absolute inset-x-0 top-0 h-1.5", v.bar)} aria-hidden />
              <p className={cn("text-xs font-bold uppercase tracking-wider", v.blurb)}>{pkg.blurb}</p>
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
                  {pkg.quantityNote ?? `${pkg.boxes} ${pkg.boxes === 1 ? "box" : "boxes"} of product`}
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
  );
}
