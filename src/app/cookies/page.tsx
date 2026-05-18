import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { defaultSocialCardMetadata } from "@/lib/page-share-metadata";

export const metadata: Metadata = {
  title: "Cookies policy",
  description: clampMetaDescription(
    `How ${siteConfig.name} uses cookies and similar storage on this website.`,
  ),
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
  ...defaultSocialCardMetadata({
    path: "/cookies",
    title: "Cookies policy",
    description: clampMetaDescription(
      `How ${siteConfig.name} uses cookies and similar storage on this website.`,
    ),
  }),
};

export default function CookiesPolicyPage() {
  return (
    <main className="container-shell py-14 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
        Cookies policy
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        This page explains how {siteConfig.name} (&ldquo;we&rdquo;) uses cookies and similar
        technologies when you use our website.
      </p>

      <div className="mt-10 max-w-2xl space-y-8 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="text-base font-semibold text-neutral-900">What we use</h2>
          <p className="mt-3">
            <strong className="text-neutral-900">Strictly necessary cookies</strong> keep the site
            working. When you sign in to your account or admin area, our authentication provider
            (Supabase) sets session cookies so you stay logged in securely. These are essential for
            that feature and cannot be turned off without losing sign-in.
          </p>
          <p className="mt-3">
            <strong className="text-neutral-900">Local storage in your browser</strong> (similar to
            cookies) is used for things that stay on your device only: your shopping cart, your
            wishlist, and an optional referral code from partner links. This helps the storefront
            remember your choices between visits. You can clear them anytime via your browser
            settings.
          </p>
          <p className="mt-3">
            We do not use third-party advertising cookies on this site as part of the default storefront
            code. If we add analytics or marketing tools later, we will update this policy and, where
            required, ask for your consent before non-essential cookies run.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Managing preferences</h2>
          <p className="mt-3">
            You can block or delete cookies and site data through your browser. Note that blocking
            necessary auth cookies may prevent sign-in, and clearing storage will reset your cart and
            wishlist on this device.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900">Contact</h2>
          <p className="mt-3">
            Questions about this policy?{" "}
            <Link href="/contact" className="font-semibold text-brand-green-dark underline-offset-4 hover:underline">
              Contact us
            </Link>{" "}
            or email{" "}
            <a className="font-semibold text-brand-green-dark underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-neutral-500">
          We revise this policy when our use of cookies or storage changes materially.
        </p>
      </div>
    </main>
  );
}
