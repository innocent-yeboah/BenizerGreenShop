import { siteConfig } from "@/lib/site-data";

/** Calm, static trust strip — replaces scrolling promo marquee. */
export function HeaderUtilityBar() {
  const items = siteConfig.utilityBar;

  return (
    <div className="border-t border-brand-green/20 bg-brand-green-dark">
      <div className="container-shell py-2">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] font-medium text-white/88 sm:gap-x-5 sm:text-xs">
          {items.map((item, index) => (
            <li key={item} className="inline-flex items-center gap-3 sm:gap-5">
              {index > 0 ? (
                <span className="hidden text-white/35 sm:inline" aria-hidden>
                  ·
                </span>
              ) : null}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
