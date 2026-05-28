import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

/**
 * Elegant gold-on-cream band inviting partner sign-ups.
 * Designed to act as the homepage's closing call to action — restrained,
 * confident, no urgency tricks.
 */
export function HomePartnerInvite() {
  const h = siteConfig.homePage;

  return (
    <section
      aria-labelledby="home-partner-heading"
      className="bg-brand-cream py-16 md:py-20"
    >
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-brand-green/15 shadow-[0_28px_64px_-32px_rgba(13,59,15,0.35)] md:p-12 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 size-[360px] rounded-full bg-brand-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 size-[320px] rounded-full bg-brand-green/10 blur-3xl"
          />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
                {h.discountBandEyebrow}
              </p>
              <h2
                id="home-partner-heading"
                className="mt-3 max-w-xl font-heading text-2xl font-bold leading-tight tracking-tight text-brand-green-dark md:text-3xl lg:text-[2.1rem]"
              >
                {h.discountBandTitle}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-charcoal/75 md:text-base">
                {h.discountBandSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <Link
                href="/become-distributor"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-7 text-sm font-bold uppercase tracking-wider text-brand-green-dark shadow-[0_12px_28px_-12px_rgba(204,160,0,0.55)] transition-all hover:-translate-y-0.5 hover:bg-brand-gold-light"
              >
                {h.discountBandCta}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-brand-green-dark/80 underline-offset-4 hover:text-brand-green-dark hover:underline"
              >
                Talk to our team first
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
