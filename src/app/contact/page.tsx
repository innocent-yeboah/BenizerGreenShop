import type { Metadata } from "next";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { StoreLocationSection } from "@/components/store-location-section";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";

const contactDescription = clampMetaDescription(
  `Visit ${siteConfig.name} at Accra Mall — map, directions, WhatsApp, email, and distributor enquiries.`,
);

export const metadata: Metadata = {
  title: "Contact",
  description: contactDescription,
  alternates: { canonical: "/contact" },
  ...defaultSocialCardMetadata({
    path: "/contact",
    title: "Contact",
    description: contactDescription,
  }),
};

export default function ContactPage() {
  const wa = siteConfig.whatsappAi.replace("+", "");
  const loc = siteConfig.location;

  return (
    <main className="flex-1">
      <div className="border-b border-brand-green/10 bg-brand-green-dark px-6 py-10 text-white md:py-12">
        <div className="container-shell">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold-light">Contact & visit</p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            We&apos;re at {loc.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/88">
            Walk in at the mall or reach us online for orders, product advice, and partner support.
          </p>
        </div>
      </div>

      <StoreLocationSection id="visit" featured className="border-b-0" />

      <div className="container-shell py-14 md:py-16">
        <h2 className="font-heading text-xl font-bold text-brand-green-dark md:text-2xl">Other ways to reach us</h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <li className="surface-card rounded-2xl border border-brand-charcoal/6 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">WhatsApp</p>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-lg font-semibold text-brand-green-dark underline-offset-4 hover:underline"
            >
              {siteConfig.whatsappDirect}
            </a>
          </li>
          <li className="surface-card rounded-2xl border border-brand-charcoal/6 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Email</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 inline-block break-all text-lg font-semibold text-brand-green-dark underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
          </li>
          <li className="surface-card rounded-2xl border border-brand-charcoal/6 bg-white p-6 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Social</p>
            <div className="mt-3">
              <SocialLinks variant="inline" />
            </div>
          </li>
        </ul>

        <p className="mt-10 text-sm text-neutral-600">
          Browse the catalog anytime —{" "}
          <Link
            href="/products"
            className="font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            Shop products
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
