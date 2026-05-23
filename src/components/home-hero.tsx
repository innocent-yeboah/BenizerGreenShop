import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/** Top homepage hero — focused headline and shop CTAs. */
export function HomeHero() {
  const h = siteConfig.homePage;
  const hasAccent = h.heroTitleAccent.trim().length > 0;
  const hasPoints = h.heroPoints.length > 0;

  return (
    <section className="relative flex flex-col overflow-hidden border-b border-brand-green/15 md:min-h-[min(72vh,48rem)]">
      <div className="relative h-[min(58vh,360px)] w-full shrink-0 sm:h-[min(62vh,400px)] md:absolute md:inset-0 md:h-full md:min-h-[min(72vh,48rem)]">
        <Image
          src="/images/hero-miiracare.png"
          alt="MiiraCare wellness products displayed in a warm, natural setting."
          fill
          className="object-cover object-[center_32%] md:object-[center_30%]"
          sizes="100vw"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col bg-brand-cream px-5 pb-10 pt-8 sm:px-6 md:absolute md:inset-0 md:min-h-[min(72vh,48rem)] md:justify-center md:bg-transparent md:pb-12 md:pt-14">
        <p className="sr-only">
          {siteConfig.name}. {siteConfig.description}
        </p>

        <div className="mx-auto w-full max-w-2xl text-center lg:max-w-3xl">
          {h.heroEyebrow.trim() ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green-dark/90 md:text-xs md:text-brand-gold-light md:[text-shadow:0_1px_3px_rgba(0,0,0,0.92)]">
              {h.heroEyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-accent text-[1.65rem] font-semibold leading-tight tracking-tight text-brand-green-dark sm:text-4xl md:text-5xl md:text-white md:[text-shadow:0_1px_4px_rgba(0,0,0,0.95)]",
              h.heroEyebrow.trim() ? "mt-3 md:mt-4" : "mt-0",
            )}
          >
            <span className="block">{h.heroTitle}</span>
            {hasAccent ? (
              <span className="mt-2 block text-brand-gold-dark md:text-brand-gold-light">{h.heroTitleAccent}</span>
            ) : null}
          </h1>

          {h.heroLead.trim() ? (
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-brand-charcoal/88 sm:text-base md:mt-5 md:text-lg md:text-white/92 md:[text-shadow:0_1px_3px_rgba(0,0,0,0.85)]">
              {h.heroLead}
            </p>
          ) : null}

          {hasPoints ? (
            <ul className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm md:mt-6 md:text-white/90">
              {h.heroPoints.map((line, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div
            className={cn(
              "mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center",
              !h.heroLead.trim() && !hasPoints && "md:mt-10",
            )}
          >
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-9 text-sm font-bold uppercase tracking-wider text-brand-green-dark shadow-md hover:bg-brand-gold-light md:shadow-lg"
            >
              {h.primaryCta}
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-green-dark/30 bg-white px-9 text-sm font-bold uppercase tracking-wider text-brand-green-dark hover:bg-brand-cream md:border-white/50 md:bg-black/45 md:text-white md:hover:bg-black/55"
            >
              {h.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
