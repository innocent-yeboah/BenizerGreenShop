import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Softens external 404s (old campaign links): clear paths + reinforces internal linking for crawlers */
export default function NotFound() {
  return (
    <main className="container-shell flex flex-1 flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-green-dark md:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-lg text-brand-charcoal/75">
        The link may be outdated or typed incorrectly. Use the storefront below — or WhatsApp{" "}
        {siteConfig.whatsappDirect} for help tracking an order or product question.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-secondary px-6 py-2.5 text-sm font-bold">
          Home
        </Link>
        <Link href="/products" className="btn-primary px-6 py-2.5 text-sm font-bold">
          Shop products
        </Link>
        <Link href="/contact" className="btn-secondary px-6 py-2.5 text-sm font-bold">
          Contact us
        </Link>
      </div>
      <div className="mt-14 text-xs text-brand-charcoal/48">
        <Link href="/privacy" className="underline-offset-4 hover:text-brand-green hover:underline">
          Privacy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/cookies" className="underline-offset-4 hover:text-brand-green hover:underline">
          Cookies
        </Link>
      </div>
    </main>
  );
}
