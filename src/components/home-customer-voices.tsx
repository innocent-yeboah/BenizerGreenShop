import { Quote, Star } from "lucide-react";
import { siteConfig, siteTestimonials } from "@/lib/site-data";

/**
 * Premium-grade testimonials block. One featured pull-quote anchors the
 * section; supporting voices flow to its right. Restraint over volume —
 * three voices at most.
 */
export function HomeCustomerVoices() {
  const h = siteConfig.homePage;
  const [featured, ...rest] = siteTestimonials.slice(0, 3);

  if (!featured) return null;

  return (
    <section
      aria-labelledby="home-voices-heading"
      className="bg-brand-green-dark text-white"
    >
      <div className="container-shell py-16 md:py-24">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
              {h.voicesEyebrow}
            </p>
            <h2
              id="home-voices-heading"
              className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.5rem]"
            >
              {h.voicesTitle}
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/75 md:text-base">
              {h.voicesLead}
            </p>
          </div>
          <div
            aria-hidden
            className="flex items-center gap-1 text-brand-gold"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-4 fill-brand-gold"
                strokeWidth={0}
              />
            ))}
            <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              Verified customers
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <figure className="relative overflow-hidden rounded-3xl bg-white/6 p-8 ring-1 ring-white/10 backdrop-blur-sm md:p-10 lg:col-span-3">
            <Quote
              aria-hidden
              className="absolute right-8 top-8 size-16 text-brand-gold/15"
              strokeWidth={1.5}
            />
            <blockquote className="relative font-heading text-2xl font-medium leading-snug tracking-tight md:text-3xl lg:text-[1.9rem]">
              <span className="text-brand-gold">&ldquo;</span>
              {featured.quote}
              <span className="text-brand-gold">&rdquo;</span>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <div
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 font-heading text-base font-bold text-brand-gold"
              >
                {featured.initial}
              </div>
              <div>
                <p className="font-heading text-base font-bold">
                  {featured.name}
                </p>
                {featured.tagline ? (
                  <p className="mt-0.5 text-sm text-white/65">
                    {featured.tagline}
                  </p>
                ) : null}
              </div>
            </figcaption>
          </figure>

          <div className="grid gap-6 lg:col-span-2">
            {rest.map((t) => (
              <figure
                key={t.name + t.initial}
                className="flex h-full flex-col rounded-3xl bg-white/4 p-6 ring-1 ring-white/10 md:p-7"
              >
                <blockquote className="text-[15px] leading-relaxed text-white/90">
                  <span className="text-brand-gold">&ldquo;</span>
                  {t.quote}
                  <span className="text-brand-gold">&rdquo;</span>
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white"
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    {t.tagline ? (
                      <p className="mt-0.5 text-xs text-white/60">
                        {t.tagline}
                      </p>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
