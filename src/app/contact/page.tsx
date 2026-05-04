import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: clampMetaDescription(
    `Reach ${siteConfig.name} — WhatsApp, email, and distributor enquiries.`,
  ),
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = siteConfig.whatsappAi.replace("+", "");

  return (
    <main className="container-shell py-14 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
        Contact
      </h1>
      <p className="mt-3 max-w-xl text-neutral-600">
        Questions about products, orders, or the distributor program — reach our team directly.
      </p>

      <ul className="mt-10 space-y-8 text-sm md:text-base">
        <li>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            WhatsApp
          </p>
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            {siteConfig.whatsappDirect}
          </a>
        </li>
        <li>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Email
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-2 inline-block font-semibold text-brand-green-dark underline-offset-4 hover:underline"
          >
            {siteConfig.email}
          </a>
        </li>
        <li>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Shopping
          </p>
          <p className="mt-2 text-neutral-700">
            Browse the catalogue anytime —{" "}
            <Link href="/products" className="font-semibold text-brand-green-dark underline-offset-4 hover:underline">
              Shop products
            </Link>
            .
          </p>
        </li>
      </ul>
    </main>
  );
}
