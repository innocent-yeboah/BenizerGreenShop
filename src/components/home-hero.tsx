import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";

/** Top homepage hero — mobile: photo first, copy on cream; desktop: full-bleed image + overlay copy. */
export function HomeHero() {
  const h = siteConfig.homePage;

  return (
    <section className="relative flex flex-col overflow-hidden border-b border-brand-green/15 md:min-h-[min(82vh,56rem)]">
      {/* Photo: fixed height on mobile so the products read clearly; full-bleed on md+ */}
      <div className="relative h-[min(66vh,400px)] w-full shrink-0 sm:h-[min(70vh,440px)] md:absolute md:inset-0 md:h-full md:max-h-none md:min-h-[min(82vh,56rem)]">
        <Image
          src="/images/hero-miiracare.png"
          alt="MiiraCare wellness products including Miira Cell Plus, Miira Life, Miira Curve, and related supplements displayed in a warm, natural setting."
          fill
          className="object-cover object-[center_32%] sm:object-[center_30%] md:object-[center_30%]"
          sizes="100vw"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col bg-brand-cream px-5 pb-11 pt-9 sm:px-6 sm:pb-12 sm:pt-10 md:absolute md:inset-0 md:min-h-[min(82vh,56rem)] md:justify-center md:bg-transparent md:pb-14 md:pt-16 lg:pt-20">
        <p className="sr-only">
          {siteConfig.name}. {siteConfig.description}
        </p>

        <div className="mx-auto w-full max-w-3xl text-center lg:max-w-[52rem]">
          <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.28em] text-brand-green-dark/90 sm:text-[11px] sm:tracking-[0.32em] md:text-xs md:text-brand-gold-light md:[text-shadow:0_1px_3px_rgba(0,0,0,0.92)]">
            {h.heroEyebrow}
          </p>

          <h1 className="font-accent mt-4 text-[1.55rem] font-semibold leading-[1.2] tracking-tight text-brand-green-dark sm:mt-5 sm:text-[1.85rem] md:mt-5 md:text-5xl md:leading-[1.1] md:text-white md:[text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_5px_32px_rgba(0,0,0,0.42)] lg:text-[3.35rem] lg:leading-[1.08]">
            <span className="block">{h.heroTitle}</span>
            <span className="mt-1.5 block text-brand-gold-dark sm:mt-2 md:mt-2.5 md:text-brand-gold-light md:[text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
              {h.heroTitleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-relaxed text-brand-charcoal/90 sm:text-base md:mt-7 md:text-xl md:leading-snug md:text-white/95 md:[text-shadow:0_1px_4px_rgba(0,0,0,0.82)]">
            {h.heroLead}
          </p>

          <ul className="mx-auto mt-6 max-w-xl space-y-3 text-left sm:mt-7 sm:space-y-3.5 md:mt-8 md:max-w-2xl md:space-y-4">
            {h.heroPoints.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 text-[13px] leading-relaxed text-brand-charcoal/88 sm:text-sm md:text-[15px] md:leading-relaxed md:text-white/93 md:[text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
              >
                <span
                  className="mt-[0.35rem] h-2 w-2 shrink-0 rounded-full bg-brand-gold shadow-[0_0_0_2px_rgba(255,250,245,0.9)] sm:mt-[0.45rem] md:bg-brand-gold md:shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 md:mt-11 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/products"
              className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-brand-gold px-10 text-sm font-bold uppercase tracking-[0.18em] text-brand-green-dark shadow-md shadow-black/15 transition-colors hover:bg-brand-gold-light sm:w-auto sm:tracking-wider md:shadow-lg md:shadow-black/30"
            >
              {h.primaryCta}
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full border-2 border-brand-green-dark/35 bg-white px-10 text-sm font-bold uppercase tracking-[0.18em] text-brand-green-dark transition-colors hover:border-brand-green-dark hover:bg-brand-cream sm:w-auto sm:tracking-wider md:border-white/55 md:bg-black/50 md:text-white md:hover:border-white/75 md:hover:bg-black/60"
            >
              {h.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
