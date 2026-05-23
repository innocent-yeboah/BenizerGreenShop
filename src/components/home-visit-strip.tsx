import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

/** One-line Accra Mall cue — full map lives on /contact. */
export function HomeVisitStrip() {
  const loc = siteConfig.location;

  return (
    <section className="border-y border-brand-green/12 bg-brand-cream/60 py-5" aria-label="Store location">
      <div className="container-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="flex items-center gap-2 text-center text-sm font-medium text-brand-charcoal/85 sm:text-left">
          <MapPin className="size-4 shrink-0 text-brand-green-dark" aria-hidden />
          <span>
            Visit us at <span className="font-semibold text-brand-green-dark">{loc.name}</span>, {loc.locality}
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            <Navigation className="size-4 shrink-0" aria-hidden />
            Get directions
          </a>
          <span className="hidden text-brand-charcoal/30 sm:inline" aria-hidden>
            ·
          </span>
          <Link
            href="/contact#visit"
            className="text-sm font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
