import { siteConfig } from "@/lib/site-data";

export function HomeSupplementDisclaimer() {
  return (
    <aside className="border-t border-brand-charcoal/8 bg-white py-8" aria-label="Supplement disclaimer">
      <div className="container-shell">
        <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-brand-charcoal/55 md:text-xs">
          {siteConfig.homePage.supplementDisclaimer}
        </p>
      </div>
    </aside>
  );
}
