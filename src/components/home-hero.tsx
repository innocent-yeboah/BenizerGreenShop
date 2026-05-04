import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";

/** Top homepage hero — Revobit-style headline band + welcome bar (Benizer brand & copy). */
export function HomeHero() {
  const h = siteConfig.homePage;

  return (
    <section className="relative overflow-hidden border-b border-brand-green/15">
      <div className="absolute inset-0 bg-linear-to-b from-[#0d280f] via-brand-green-dark to-[#153a18]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-y-1/2 rounded-full bg-brand-gold/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden
      />

      <div className="container-shell relative z-10 pt-12 pb-0 md:pt-16 md:pb-0 lg:pt-20">
        <h1 className="sr-only">
          {siteConfig.name} — {siteConfig.description}
        </h1>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-12 xl:gap-14">
          <div className="flex flex-col text-center lg:text-left lg:items-start">
            <p className="w-full text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold-light/90 md:text-xs">
              {h.heroEyebrow}
            </p>

            <div className="mx-auto mt-6 max-w-4xl lg:mx-0 lg:max-w-none">
              <p className="font-accent text-3xl font-semibold leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                {h.heroTitle}{" "}
                <span className="text-brand-gold-light">{h.heroTitleAccent}</span>
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg lg:mx-0">
                {h.heroBody}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-brand-gold px-10 text-sm font-bold uppercase tracking-wider text-brand-green-dark shadow-lg shadow-black/20 transition-colors hover:bg-brand-gold-light sm:w-auto"
                >
                  {h.primaryCta}
                </Link>
                <Link
                  href="/become-distributor"
                  className="inline-flex min-h-12 w-full min-w-[200px] items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-10 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:border-white/55 hover:bg-white/10 sm:w-auto"
                >
                  {h.secondaryCta}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-16/10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-black/25 shadow-2xl shadow-black/45 ring-1 ring-white/10 sm:max-w-2xl lg:mx-0 lg:max-w-none">
            <Image
              src="/images/hero-miiracare.png"
              alt="MiiraCare wellness products including Miira Cell Plus, Miira Life, Miira Curve, and related supplements displayed in a warm, natural setting."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 flex justify-center md:mt-14">
          <div className="inline-flex max-w-full items-center gap-2 rounded-t-2xl border border-b-0 border-white/15 bg-white/10 px-6 py-3 backdrop-blur-md md:px-10 md:py-3.5">
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold sm:block" aria-hidden />
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/95 sm:text-sm">
              {h.welcomeBar}
            </p>
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold sm:block" aria-hidden />
          </div>
        </div>

        <div className="mt-6 flex justify-center border-t border-white/10 pt-6 pb-8 md:pb-10">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15"
          >
            <Image
              src="/icons/social/instagram.svg"
              alt=""
              width={16}
              height={16}
              className="opacity-95 brightness-0 invert"
            />
            {siteConfig.social.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
