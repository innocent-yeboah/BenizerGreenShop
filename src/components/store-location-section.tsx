import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { StoreLocationMap } from "@/components/store-location-map";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  className?: string;
  /** Larger map and headline for homepage / contact hero. */
  featured?: boolean;
};

/** Prominent Accra Mall block — map, address, and direction CTAs. */
export function StoreLocationSection({ id = "visit", className, featured = false }: Props) {
  const loc = siteConfig.location;

  return (
    <section
      id={id}
      className={cn(
        featured
          ? "border-y border-brand-green/15 bg-gradient-to-b from-brand-cream via-white to-brand-cream/80 py-14 md:py-20"
          : "py-10",
        className,
      )}
      aria-labelledby={featured ? "store-location-heading" : undefined}
    >
      <div className="container-shell">
        {featured ? (
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {loc.visitEyebrow}
              </p>
              <h2
                id="store-location-heading"
                className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-green-dark md:text-4xl"
              >
                {loc.visitTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/85 md:text-lg">{loc.visitLead}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold"
              >
                <Navigation className="size-4 shrink-0" aria-hidden />
                {loc.visitCta}
              </a>
              <Link
                href="/contact#visit"
                className="btn-secondary inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold"
              >
                {loc.visitSecondaryCta}
              </Link>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-8",
            featured ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10 lg:items-start" : "lg:grid-cols-2",
          )}
        >
          <div
            className={cn(
              "order-2 lg:order-1",
              featured && "surface-card rounded-2xl border border-brand-green/12 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(13,59,15,0.4)] md:p-8",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Store address</p>
            <p className="mt-3 font-heading text-2xl font-bold text-brand-green-dark">{loc.name}</p>
            <p className="mt-2 text-base leading-relaxed text-neutral-700">
              {loc.streetAddress}
              <br />
              {loc.locality}, {loc.region}
              <br />
              {loc.country}
            </p>
            <p className="mt-4 text-sm text-neutral-600">
              Open the map for turn-by-turn directions from your location. Parking is available at the mall.
            </p>
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Navigation className="size-4 shrink-0" aria-hidden />
              {loc.visitCta}
            </a>
          </div>

          <div className={cn("order-1 lg:order-2", featured && "lg:sticky lg:top-24")}>
            <StoreLocationMap showAddress={false} size={featured ? "large" : "default"} />
          </div>
        </div>
      </div>
    </section>
  );
}
