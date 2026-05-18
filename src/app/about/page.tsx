import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HeartHandshake, Landmark, ShieldCheck, Users } from "lucide-react";
import { BrandSealMark } from "@/components/brand-seal";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";

export const metadata: Metadata = {
  title: "About Us",
  description: clampMetaDescription(
    `${siteConfig.name} — wellness and wealth together. Trusted organic supplements, partner development, and distributor success.`,
  ),
  alternates: { canonical: "/about" },
  ...defaultSocialCardMetadata({
    path: "/about",
    title: "About us",
    description: clampMetaDescription(
      `${siteConfig.name} — wellness and wealth together. Trusted organic supplements, partner development, and distributor success.`,
    ),
  }),
};

const values = [
  {
    n: "01",
    title: "Integrity",
    icon: ShieldCheck,
    body:
      "We honor every commitment. We trade only in authentic, properly sealed products and counsel you with transparency. If our team would not use it in our own homes, it does not reach our shelves. Trust is the standard we measure first.",
  },
  {
    n: "02",
    title: "Service",
    icon: HeartHandshake,
    body:
      "Clients lead every decision. We respond with urgency, fulfill orders reliably, and remain available after delivery—whether you need product guidance or business support. Consistent care is how we earn long-term relationships.",
  },
  {
    n: "03",
    title: "People development",
    icon: Users,
    body:
      "Capacity-building comes before short-term wins. From onboarding new partners to individualized coaching, we invest in skills and confidence. When our people grow, the whole organization advances.",
  },
  {
    n: "04",
    title: "Financial freedom",
    icon: Landmark,
    body:
      "We design straightforward paths to supplemental and scalable income for partners, affiliates, and distributors. Clear systems and fair structures help you take greater control of your financial future.",
  },
  {
    n: "05",
    title: "Training & skills",
    icon: BookOpen,
    body:
      "Practical education in health literacy and commercial fundamentals equips you for life. Our training is structured so you can apply it immediately—and teach others with clarity and professionalism.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-brand-green/15 bg-linear-to-br from-brand-green-dark via-brand-green to-[#153018] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_-20%,rgba(255,236,179,0.14),transparent_50%)]" />
        <div className="container-shell relative py-14 md:py-20">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-gold-light/90">
            About us
          </p>
          <div className="mt-6 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 md:mt-8">
            <BrandSealMark variant="aboutHero" />
            <div className="min-w-0">
              <p className="font-accent text-[1.85rem] font-semibold leading-tight tracking-tight text-white sm:text-[2rem] md:text-[2.25rem]">
                Benizer Green Shop
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-gold-light/88">
                {siteConfig.brandLockupSubtitle}
              </p>
              <p className="mt-6 text-lg font-medium leading-relaxed text-white/92 md:text-xl">
                Wellness and wealth, together. We supply trusted organic food supplements and develop partners, affiliates,
                and distributors to succeed—with discipline, training, and a long-term view.
              </p>
            </div>
          </div>
          <blockquote className="mt-10 max-w-xl border-l-4 border-brand-gold-light bg-white/5 px-6 py-5 backdrop-blur-sm md:px-8 md:py-6">
            <p className="font-accent text-xl italic text-white/95 md:text-2xl">
              Your Health Our Priority.
            </p>
          </blockquote>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-green-dark shadow-lg transition hover:bg-brand-cream"
            >
              Shop products
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/35 bg-transparent px-7 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-green/10 bg-white">
        <div className="container-shell py-14 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-green-dark md:text-3xl">
              Who we are
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-charcoal/85 md:text-lg">
              At <span className="font-semibold text-brand-green-dark">{siteConfig.name}</span>, we believe that better
              health and stronger livelihoods should reinforce each other. We curate original, trusted organic supplements,
              then back every relationship with education and operational support. Our aim is straightforward: help you
              improve your health, earn with integrity, and extend that impact to the people you serve.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-brand-cream/40 via-white to-brand-cream/25">
        <div className="container-shell py-14 md:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">Core values</p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-brand-green-dark md:text-3xl">
              How we operate, every day
            </h2>
            <p className="mt-3 text-sm text-brand-charcoal/75 md:text-base">
              Five principles shape decisions across product, service, and partner experience.
            </p>
          </div>
          <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <li
                  key={v.n}
                  className="surface-card flex gap-5 rounded-2xl p-6 md:p-7 lg:gap-6"
                >
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <span className="font-heading text-xs font-bold tabular-nums text-brand-green/50">{v.n}</span>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green-dark">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-bold text-brand-green-dark">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/80 md:text-[0.9375rem]">{v.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-brand-green/10 bg-brand-green-dark py-12 text-center text-white md:py-14">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-light">Next step</p>
          <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-white/90">
            Join us to improve health, build income, and help others—with products and a platform you can stand behind.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-ghost px-8 py-3 font-bold">
              Browse catalog
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-8 py-3 text-sm font-bold text-white hover:border-white hover:bg-white/10"
            >
              Become a distributor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
