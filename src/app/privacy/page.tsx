import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";

const privacyDescription = clampMetaDescription(
  `${siteConfig.name} privacy overview: how we use account, order, referral, contact, and device data.`,
);

export const metadata: Metadata = {
  title: "Privacy policy",
  description: privacyDescription,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  ...defaultSocialCardMetadata({
    path: "/privacy",
    title: "Privacy policy",
    description: privacyDescription,
    imageAlt: `${siteConfig.name} privacy policy`,
  }),
};

export default function PrivacyPolicyPage() {
  const wa = siteConfig.whatsappAi.replace("+", "");

  return (
    <main className="container-shell py-14 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">Privacy policy</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        This overview explains how {siteConfig.name} (&ldquo;we&rdquo;) handles personal data when you browse
        the site, create an account, place an order, or contact us.
      </p>

      <div className="mt-10 max-w-2xl space-y-8 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="text-base font-semibold text-neutral-900">Who we are</h2>
          <p className="mt-3">{siteConfig.name} operates this website and retail wellness catalogue at our public domain.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Data we may collect</h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>
              <strong className="text-neutral-900">Account data</strong> — name and email address when you register or sign in via our
              authentication provider.
            </li>
            <li>
              <strong className="text-neutral-900">Order & billing data</strong> — contact details used for checkout (name, phone, email),
              items purchased, totals, delivery notes, and payment references provided by trusted payment gateways.
            </li>
            <li>
              <strong className="text-neutral-900">Distributor enquiries</strong> — information submitted on the distributor application form.
            </li>
            <li>
              <strong className="text-neutral-900">Device storage</strong> — cart contents, wishlist, and referral codes stored locally in your
              browser (see also our{" "}
              <Link href="/cookies" className="font-semibold text-brand-green-dark underline-offset-4 hover:underline">
                cookies policy
              </Link>
              ).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Purposes</h2>
          <p className="mt-3">
            We process this data only to fulfil orders, respond to support requests, run the storefront and partner workflows, comply with
            law, improve service quality, and send operational messages related to purchases or enquiries.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Retention & sharing</h2>
          <p className="mt-3">
            We retain data as long as needed for these purposes unless a shorter period applies by law or contract. Operational access is limited
            to service providers strictly required to run hosting, authentication, payments, and email notifications; they may only process
            data on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Rights & contact</h2>
          <p className="mt-3">
            To ask about copies, corrections, deletes, or other concerns regarding your personal data: email{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-semibold text-brand-green-dark underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
            {" · "}
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-green-dark underline-offset-4 hover:underline">
              WhatsApp
            </a>
            {" · "}
            <Link href="/contact" className="font-semibold text-brand-green-dark underline-offset-4 hover:underline">
              Contact page
            </Link>
            .
          </p>
        </section>

        <p className="text-xs text-neutral-500">
          Last reviewed May 2026. We revise this overview when handling practices change meaningfully.
        </p>
      </div>
    </main>
  );
}
