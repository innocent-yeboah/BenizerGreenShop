import Link from "next/link";
import { Star } from "lucide-react";
import type { SiteTestimonial } from "@/lib/site-data";

function StarRow() {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-500" aria-hidden />
      ))}
    </div>
  );
}

export function TestimonialsSection({ items }: { items: SiteTestimonial[] }) {
  return (
    <section className="bg-white py-14">
      <div className="container-shell">
        <h2 className="text-3xl font-bold capitalize text-brand-green-dark md:text-4xl">Customers reviews</h2>
        <p className="mt-3 max-w-2xl text-sm text-brand-charcoal/75 md:text-[15px]">
          Rated 5 out of 5 from shoppers and distributors who love the Benizer lineup.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <blockquote
              key={t.name + t.initial}
              className="surface-card lift-on-hover flex flex-col rounded-2xl border border-brand-charcoal/8 bg-white p-6 shadow-[0_12px_40px_-28px_rgba(13,59,15,0.35)]"
            >
              <div className="flex gap-4">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-green/15 to-brand-green-light/30 text-sm font-bold text-brand-green-dark ring-2 ring-brand-green/10"
                  aria-hidden
                >
                  {t.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <StarRow />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-brand-charcoal/65">
                      Rated 5 out of 5
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/80">
                      Trusted
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-brand-charcoal/90">
                    <span className="text-brand-green/90">&ldquo;</span>
                    {t.quote}
                    <span className="text-brand-green/90">&rdquo;</span>
                  </p>
                </div>
              </div>
              <footer className="mt-5 border-t border-brand-charcoal/10 pt-4">
                <p className="font-semibold text-brand-green-dark">{t.name}</p>
                <p className="mt-0.5 text-sm text-brand-charcoal/65">
                  {t.tagline}
                  {t.href && t.linkLabel ? (
                    <>
                      {" · "}
                      <Link
                        href={t.href}
                        className="font-medium text-brand-green underline-offset-2 hover:text-brand-green-dark hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.linkLabel}
                      </Link>
                    </>
                  ) : null}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
