import Link from "next/link";
import { distributorPackages, siteConfig } from "@/lib/site-data";
import { currencyFormatter } from "@/lib/utils";

/** Compact partner CTA — full tiers live on /become-distributor. */
export function HomeDistributorTeaser() {
  const h = siteConfig.homePage;
  const starter = distributorPackages.find((p) => p.tier === "starter");
  const gold = distributorPackages.find((p) => p.tier === "gold");

  return (
    <section className="container-shell py-14 md:py-16" aria-labelledby="home-partner-heading">
      <div className="rounded-2xl border border-brand-green/12 bg-linear-to-br from-brand-cream/80 via-white to-brand-green/5 p-8 md:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Partner program</p>
          <h2 id="home-partner-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
            {h.packagesIntroTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80 md:text-[15px]">{h.packagesIntroSubtitle}</p>
          {starter && gold ? (
            <p className="mt-4 text-sm text-brand-charcoal/65">
              Tiers from {currencyFormatter.format(starter.price)} to {currencyFormatter.format(gold.price)} — choose the
              level that fits your goals.
            </p>
          ) : null}
        </div>
        <div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col xl:flex-row">
          <Link href="/become-distributor" className="btn-primary px-8 py-3.5 text-center text-sm font-bold">
            {h.discountBandCta}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-brand-green/30 bg-white px-8 py-3.5 text-center text-sm font-semibold text-brand-green-dark hover:border-brand-green hover:bg-brand-cream"
          >
            Talk to our team
          </Link>
        </div>
      </div>
    </section>
  );
}
