import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { getCurrentUserWithRole } from "@/lib/auth";
import { noIndexFollow } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s · Account" },
  robots: noIndexFollow(),
};

export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="container-shell flex-1 pb-24 pt-8 md:pb-16 md:pt-12">
        <p className="text-sm text-brand-charcoal/80">
          Connect Supabase in your environment variables to unlock your account dashboard.
        </p>
      </main>
    );
  }

  const current = await getCurrentUserWithRole();
  if (!current?.user?.email) {
    return (
      <main className="container-shell flex-1 pb-24 pt-8 md:pb-16 md:pt-12">
        <p className="text-sm text-brand-charcoal/80">Sign in again to view your account.</p>
      </main>
    );
  }

  const displayName =
    current.fullName?.trim() ||
    current.user.email.split("@")[0]?.replace(/\./g, " ") ||
    "Member";
  const email = current.user.email;

  return (
    <main className="relative flex-1 bg-linear-to-b from-brand-cream/30 via-transparent to-transparent pt-5 md:pt-10 lg:pb-8">
      <AccountShell displayName={displayName} email={email}>
        {children}
      </AccountShell>
    </main>
  );
}
