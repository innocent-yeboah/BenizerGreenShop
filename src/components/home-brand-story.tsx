import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";

/** Editorial brand band — credibility without a second hero. */
export function HomeBrandStory() {
  const h = siteConfig.homePage;

  return (
    <section className="border-y border-brand-charcoal/6 bg-white py-14 md:py-16" aria-labelledby="home-brand-story-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-cream shadow-[0_16px_48px_-24px_rgba(13,59,15,0.35)] ring-1 ring-brand-green/10">
          <Image
            src="/images/hero-miiracare.png"
            alt="MiiraCare wellness products in a natural setting"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Why Benizer</p>
          <h2 id="home-brand-story-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
            {h.brandStoryTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-charcoal/85 md:text-lg">{h.brandStoryBody}</p>
          <ul className="mt-6 space-y-3 text-sm text-brand-charcoal/80">
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
              Original MiiraCare formulations with clear usage guidance
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
              Ghana-based customer and partner support
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
              Transparent GHS pricing on every product page
            </li>
          </ul>
          <Link href="/about" className="btn-primary mt-8 inline-flex px-8 py-3 text-sm font-bold">
            {h.brandStoryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
