import type { Metadata } from "next";
import Link from "next/link";
import { noIndexFollow } from "@/lib/seo";

export const metadata: Metadata = {
  title: "My account",
  robots: noIndexFollow(),
};

const navLink =
  "rounded-lg px-3 py-2 text-sm font-semibold text-brand-green-dark/80 transition-colors hover:bg-brand-charcoal/5 hover:text-brand-green-dark";

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container-shell pb-14 pt-8 md:pb-16 md:pt-10">
      <div className="border-b border-brand-green/10 pb-6">
        <h1 className="text-3xl font-bold text-brand-green-dark md:text-[2rem]">My account</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-charcoal/75">
          View purchases linked to your checkout email, refresh your profile, and track shipments.
        </p>
      </div>
      <nav
        aria-label="Account sections"
        className="-mx-1 mt-6 flex flex-wrap gap-2 border-b border-brand-green/8 pb-4"
      >
        <Link href="/account" prefetch={false} className={navLink}>
          Overview
        </Link>
        <Link href="/account/orders" prefetch={false} className={navLink}>
          Orders
        </Link>
        <Link href="/account/profile" prefetch={false} className={navLink}>
          Profile
        </Link>
        <Link href="/order-status" prefetch={false} className={navLink}>
          Track order
        </Link>
        <Link href="/products" prefetch={false} className={navLink}>
          Continue shopping
        </Link>
      </nav>
      <div className="mt-10 max-w-3xl">{children}</div>
    </main>
  );
}
