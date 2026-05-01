import { createClient } from "@/lib/supabase/server";
import { DistributorReferralShare } from "@/components/distributor-referral-share";
import { currencyFormatter } from "@/lib/utils";
import { getPublicAppUrl } from "@/lib/app-url";

export default async function DistributorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: distributor } = user
    ? await supabase
        .from("distributors")
        .select("referral_code,total_sales,commission_earned,approved")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: orders } = distributor?.referral_code
    ? await supabase
        .from("orders")
        .select("id")
        .eq("distributor_referral_code", distributor.referral_code)
    : { data: [] };

  const appUrl = getPublicAppUrl();
  const referralCode = (distributor?.referral_code ?? "").trim();
  const referralUrl =
    referralCode !== "" ? `${appUrl}/products?ref=${encodeURIComponent(referralCode)}` : "";

  return (
    <main className="container-shell py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Partner Workspace
      </p>
      <h1 className="text-4xl font-bold text-brand-green-dark">Distributor Dashboard</h1>
      <p className="mt-2 text-brand-charcoal/80">
        Track personal sales, monitor commissions, and use your referral tools.
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card title="Referral Code" value={distributor?.referral_code || "Not assigned"} />
        <Card title="Personal Sales" value={currencyFormatter.format(Number(distributor?.total_sales || 0))} />
        <Card title="Commission Earned" value={currencyFormatter.format(Number(distributor?.commission_earned || 0))} />
        <Card title="Referred Orders" value={String(orders?.length || 0)} />
        <Card title="Approval Status" value={distributor?.approved ? "Approved" : "Pending"} />
      </section>
      {referralUrl ? (
        <DistributorReferralShare referralUrl={referralUrl} referralCode={referralCode} />
      ) : (
        <div className="surface-card mt-8 rounded-xl p-5 text-sm text-brand-charcoal/75">
          <p className="font-semibold text-brand-green-dark">Referral link</p>
          <p className="mt-2">
            No referral code on your account yet. If you recently joined, your admin contact can finish
            setup.
          </p>
        </div>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <article className="surface-card lift-on-hover rounded-2xl p-5">
      <p className="text-sm text-brand-charcoal/70">{title}</p>
      <p className="mt-2 text-2xl font-bold text-brand-green-dark">{value}</p>
    </article>
  );
}
