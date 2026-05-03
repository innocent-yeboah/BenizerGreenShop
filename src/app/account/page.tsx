import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AccountOverviewPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-brand-charcoal/80">
        Connect Supabase in your environment variables to unlock account features.
      </p>
    );
  }

  const current = await getCurrentUserWithRole();
  if (!current?.user) {
    redirect("/auth/sign-in?next=/account");
  }

  const displayName =
    current.fullName?.trim() ||
    current.user.email?.split("@")[0]?.replace(/\./g, " ") ||
    "there";

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">Signed in</p>
        <h2 className="mt-2 text-xl font-bold text-brand-green-dark">Welcome back, {displayName}</h2>
        <p className="mt-2 text-sm text-brand-charcoal/75">
          Use checkout with the email on this account (<span className="font-medium">{current.user.email}</span>) so
          your orders appear under{" "}
          <Link href="/account/orders" className="font-semibold text-brand-green underline-offset-4 hover:underline">
            Orders
          </Link>
          .
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="surface-card rounded-2xl p-5 lift-on-hover transition-transform hover:border-brand-green/25"
        >
          <p className="text-sm font-semibold text-brand-green-dark">Orders</p>
          <p className="mt-2 text-xs text-brand-charcoal/65">Purchases tied to your account.</p>
        </Link>
        <Link
          href="/account/profile"
          className="surface-card rounded-2xl p-5 lift-on-hover transition-transform hover:border-brand-green/25"
        >
          <p className="text-sm font-semibold text-brand-green-dark">Profile</p>
          <p className="mt-2 text-xs text-brand-charcoal/65">Update the name shown on greetings and receipts.</p>
        </Link>
      </div>
    </div>
  );
}
