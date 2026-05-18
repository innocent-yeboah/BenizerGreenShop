import Link from "next/link";
import { DistributorPackageShowcase } from "@/components/distributor-package-showcase";
import { getCurrentUserWithRole } from "@/lib/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-data";
import { BecomeDistributorForm } from "./become-distributor-form";

export default async function BecomeDistributorPage() {
  let shareEarnHref: string = "/become-distributor";
  const userCtx = await getCurrentUserWithRole();
  if (userCtx?.role === "admin") {
    shareEarnHref = "/distributor";
  } else if (userCtx?.role === "distributor" && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: distributor } = await supabase
      .from("distributors")
      .select("approved")
      .eq("user_id", userCtx.user.id)
      .maybeSingle();
    if (distributor?.approved) {
      shareEarnHref = "/distributor";
    }
  }

  return (
    <main className="flex-1 bg-brand-cream/40">
      <DistributorPackageShowcase shareEarnHref={shareEarnHref} />
      <div className="container-shell pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-2xl border border-brand-green/10 bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
                Transform Your Future
              </p>
              <h1 className="mt-2 text-3xl font-bold text-brand-green-dark md:text-4xl">
                Become A Registered Distributor
              </h1>
              <p className="mt-3 text-brand-charcoal/80">
                Build recurring income with premium wellness products, flexible sales channels, and structured training
                support through {siteConfig.name}.
              </p>
              <ul className="mt-6 space-y-2 rounded-2xl border border-brand-green/15 bg-brand-cream/30 p-5 text-sm">
                <li>— Earn commissions on personal sales</li>
                <li>— Get a unique referral code and link</li>
                <li>— Access ready-to-use marketing resources</li>
              </ul>
              <p className="mt-6 text-sm text-brand-charcoal/65">
                Compare packages above, then complete the application form — or{" "}
                <Link href="/" className="font-semibold text-brand-green underline-offset-2 hover:underline">
                  continue shopping
                </Link>
                .
              </p>
            </div>
            <BecomeDistributorForm />
          </div>
        </div>
      </div>
    </main>
  );
}
