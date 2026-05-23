import type { SiteTestimonial } from "@/lib/site-data";

export function TestimonialsSection({ items }: { items: SiteTestimonial[] }) {
  return (
    <section className="bg-white py-14 md:py-16" aria-labelledby="home-reviews-heading">
      <div className="container-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Social proof</p>
        <h2 id="home-reviews-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
          Customer reviews
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-charcoal/75 md:text-[15px]">
          Feedback from shoppers and distributors across Ghana. Individual results may vary.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <blockquote
              key={t.name + t.initial}
              className="surface-card lift-on-hover flex flex-col rounded-2xl border border-brand-charcoal/8 bg-white p-6 shadow-[0_12px_40px_-28px_rgba(13,59,15,0.35)]"
            >
              <p className="text-[15px] leading-relaxed text-brand-charcoal/90">
                <span className="text-brand-green/90">&ldquo;</span>
                {t.quote}
                <span className="text-brand-green/90">&rdquo;</span>
              </p>
              <footer className="mt-5 border-t border-brand-charcoal/10 pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-sm font-bold text-brand-green-dark"
                    aria-hidden
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-green-dark">{t.name}</p>
                    {t.tagline ? <p className="mt-0.5 text-sm text-brand-charcoal/65">{t.tagline}</p> : null}
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
