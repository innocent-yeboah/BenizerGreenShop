import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";

/** Top homepage hero — full-bleed lifestyle photo with headline + CTAs (no frosted chrome). */
export function HomeHero() {
  const h = siteConfig.homePage;

  return (
    <section className="relative min-h-[min(78vh,52rem)] overflow-hidden border-b border-brand-green/15 md:min-h-[min(82vh,56rem)]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/images/hero-miiracare.png"
          alt="MiiraCare wellness products including Miira Cell Plus, Miira Life, Miira Curve, and related supplements displayed in a warm, natural setting."
          fill
          className="object-cover object-[center_30%]"
          sizes="100vw"
          priority
        />
      </div>

      <div className="container-shell relative z-10 flex min-h-[min(78vh,52rem)] flex-col justify-center pb-12 pt-12 md:min-h-[min(82vh,56rem)] md:pb-14 md:pt-16 lg:pt-20">
        <p className="sr-only">
          {siteConfig.name}. {siteConfig.description}
        </p>

        <div className="mx-auto w-full max-w-3xl text-center lg:max-w-[52rem]">
          <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.28em] text-brand-gold-light [text-shadow:0_1px_3px_rgba(0,0,0,0.92)] sm:text-[11px] sm:tracking-[0.32em] md:text-xs">
            {h.heroEyebrow}
          </p>

          <h1 className="font-accent mt-5 text-[1.65rem] font-semibold leading-[1.18] tracking-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_5px_32px_rgba(0,0,0,0.42)] sm:mt-6 sm:text-4xl sm:leading-[1.14] md:text-5xl md:leading-[1.1] lg:text-[3.35rem] lg:leading-[1.08]">
            <span className="block">{h.heroTitle}</span>
            <span className="mt-2 block text-brand-gold-light [text-shadow:0_1px_4px_rgba(0,0,0,0.95)] sm:mt-2.5">
              {h.heroTitleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] font-medium leading-relaxed text-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.82)] sm:text-lg md:mt-7 md:text-xl md:leading-snug">
            {h.heroLead}
          </p>

          <ul className="mx-auto mt-8 max-w-xl space-y-3.5 text-left sm:mt-9 md:max-w-2xl md:space-y-4">
            {h.heroPoints.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 text-[13px] leading-relaxed text-white/93 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] sm:text-sm md:text-[15px] md:leading-relaxed"
              >
                <span
                  className="mt-[0.35rem] h-2 w-2 shrink-0 rounded-full bg-brand-gold shadow-[0_0_0_2px_rgba(0,0,0,0.35)] sm:mt-[0.45rem]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-11 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/products"
              className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-brand-gold px-10 text-sm font-bold uppercase tracking-[0.18em] text-brand-green-dark shadow-lg shadow-black/30 transition-colors hover:bg-brand-gold-light sm:w-auto sm:tracking-wider"
            >
              {h.primaryCta}
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full border-2 border-white/55 bg-black/50 px-10 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/75 hover:bg-black/60 sm:w-auto sm:tracking-wider"
            >
              {h.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
