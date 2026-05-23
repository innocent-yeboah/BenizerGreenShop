import Link from "next/link";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Show address block above the map. */
  showAddress?: boolean;
  size?: "default" | "large";
};

/** Google Maps embed for the Accra Mall store location. */
export function StoreLocationMap({ className, showAddress = true, size = "default" }: Props) {
  const loc = siteConfig.location;

  return (
    <div className={cn("flex flex-col", className)}>
      {showAddress ? (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Visit us</p>
          <p className="mt-2 font-heading text-lg font-bold text-brand-green-dark">{loc.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            {loc.streetAddress}
            <br />
            {loc.locality}, {loc.region}
            <br />
            {loc.country}
          </p>
          <Link
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            <MapPin className="size-4 shrink-0" aria-hidden />
            Open in Google Maps
          </Link>
        </div>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-neutral-100 ring-1 ring-neutral-200/80",
          size === "large"
            ? "border-brand-green/20 shadow-[0_20px_56px_-28px_rgba(13,59,15,0.45)]"
            : "border-brand-green/12 shadow-[0_8px_32px_-20px_rgba(13,59,15,0.35)]",
        )}
      >
        <iframe
          title={`Google Map — ${loc.name}, ${loc.locality}`}
          src={loc.embedUrl}
          className={cn(
            "w-full border-0",
            size === "large"
              ? "aspect-video min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px]"
              : "aspect-[4/3] min-h-[240px] sm:min-h-[280px] md:aspect-video md:min-h-[300px]",
          )}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
