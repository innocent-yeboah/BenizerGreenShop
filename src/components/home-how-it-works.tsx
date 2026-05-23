import { siteConfig } from "@/lib/site-data";

/** Three-step ordering clarity — enterprise-style service strip. */
export function HomeHowItWorks() {
  const h = siteConfig.homePage;

  return (
    <section className="bg-brand-cream/50 py-14 md:py-16" aria-labelledby="home-how-heading">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Simple process</p>
          <h2 id="home-how-heading" className="mt-2 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
            {h.howItWorksTitle}
          </h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {h.howItWorksSteps.map((step, index) => (
            <li
              key={step.title}
              className="surface-card rounded-2xl border border-brand-charcoal/6 bg-white p-6 md:p-7"
            >
              <span className="font-heading text-xs font-bold tabular-nums text-brand-green/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold text-brand-green-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
