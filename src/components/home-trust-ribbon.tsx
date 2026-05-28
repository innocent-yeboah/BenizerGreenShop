import { BadgeCheck, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

const ICONS = [ShieldCheck, BadgeCheck, Sparkles, Leaf, Truck] as const;

/**
 * Slim certification ribbon under the hero — the quiet trust signals
 * a Fortune-500-grade homepage carries above the fold without shouting.
 */
export function HomeTrustRibbon() {
  const items = siteConfig.homePage.trustRibbon;

  return (
    <section
      aria-label="Trust signals"
      className="border-y border-brand-green/10 bg-white"
    >
      <div className="container-shell">
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 text-center sm:grid-cols-3 sm:py-4 md:grid-cols-5"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={item.short}
                className="flex items-center justify-center gap-2 text-brand-green-dark/90"
              >
                <Icon
                  aria-hidden
                  className="size-4 shrink-0 text-brand-green"
                  strokeWidth={2.2}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs">
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
