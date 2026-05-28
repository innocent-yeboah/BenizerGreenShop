import Link from "next/link";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

/**
 * Editorial split section that pairs the Benizer brand pillars with a
 * live Accra Mall map. Replaces three older homepage blocks (brand story,
 * visit location, distributor teaser) with a single composed moment.
 */
export function HomeMadeInGhana() {
  const h = siteConfig.homePage;
  const loc = siteConfig.location;

  return (
    <section
      id="visit"
      aria-labelledby="home-made-heading"
      className="relative overflow-hidden bg-white py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 z-0 size-[480px] rounded-full bg-brand-gold/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 z-0 size-[520px] rounded-full bg-brand-green/8 blur-3xl"
      />

      <div className="container-shell relative grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
            {h.madeEyebrow}
          </p>
          <h2
            id="home-made-heading"
            className="mt-3 max-w-xl font-heading text-3xl font-bold leading-[1.1] tracking-tight text-brand-green-dark md:text-4xl lg:text-[2.6rem]"
          >
            {h.madeTitle}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-brand-charcoal/80 md:text-base">
            {h.madeLead}
          </p>

          <ol
            role="list"
            className="mt-10 space-y-7 border-l border-brand-green/15 pl-6"
          >
            {h.madePillars.map((pillar, i) => (
              <li key={pillar.title} className="relative">
                <span
                  aria-hidden
                  className="absolute left-[-31px] top-1 inline-flex size-6 items-center justify-center rounded-full bg-brand-green-dark font-heading text-[11px] font-bold text-white"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-bold tracking-tight text-brand-green-dark md:text-lg">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-brand-charcoal/75 md:text-[15px]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green-dark px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-12px_rgba(13,59,15,0.55)] transition-colors hover:bg-brand-green"
            >
              About Benizer
            </Link>
            <Link
              href="/contact#visit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-brand-green-dark/20 bg-white px-7 text-sm font-bold uppercase tracking-wider text-brand-green-dark transition-colors hover:border-brand-green-dark/45"
            >
              <Compass aria-hidden className="size-4" />
              Plan a visit
            </Link>
          </div>
        </div>

        <aside className="relative">
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-brand-green/15 shadow-[0_28px_70px_-30px_rgba(13,59,15,0.45)]">
            <div className="flex items-start justify-between gap-4 border-b border-brand-green/10 bg-brand-cream/50 px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
                  {loc.visitEyebrow}
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-brand-green-dark">
                  {loc.name}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-brand-charcoal/70">
                  {loc.streetAddress} · {loc.locality}, {loc.region}
                </p>
              </div>
              <Link
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Accra Mall in Google Maps"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green-dark text-white transition-colors hover:bg-brand-green"
              >
                <ArrowUpRight aria-hidden className="size-5" />
              </Link>
            </div>

            <div className="bg-neutral-100">
              <iframe
                title={`Google Map — ${loc.name}, ${loc.locality}`}
                src={loc.embedUrl}
                className="aspect-4/3 w-full border-0 md:aspect-video"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-charcoal/65">
                <MapPin aria-hidden className="size-4 text-brand-green" />
                Easy parking · Mall hours
              </span>
              <Link
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green-dark underline-offset-4 hover:underline"
              >
                Get directions
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
