import { approveDistributorAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { currencyFormatter } from "@/lib/utils";

export default async function AdminDistributorsPage() {
  const supabase = createAdminClient();
  const { data: distributors } = supabase
    ? await supabase
        .from("distributors")
        .select("id,referral_code,total_sales,commission_earned,approved,created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="container-shell py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Partner Network
      </p>
      <h1 className="text-3xl font-bold text-brand-green-dark">Admin Distributors</h1>
      <p className="mt-2 text-sm text-brand-charcoal/70">
        Approve partners and monitor referral sales performance.
      </p>
      <ul className="mt-6 space-y-3">
        {(distributors || []).map((distributor) => (
          <li key={distributor.id} className="surface-card rounded-xl p-4">
            <p className="font-semibold">{distributor.referral_code}</p>
            <p className="text-xs text-brand-charcoal/70">
              Sales: {currencyFormatter.format(Number(distributor.total_sales))} | Commission:{" "}
              {currencyFormatter.format(Number(distributor.commission_earned))}
            </p>
            <form action={approveDistributorAction} className="mt-3 flex gap-2">
              <input type="hidden" name="distributorId" value={distributor.id} />
              <select name="approved" defaultValue={String(distributor.approved)} className="rounded border border-brand-green/20 p-2">
                <option value="false">Pending</option>
                <option value="true">Approved</option>
              </select>
              <button className="btn-primary rounded px-4 py-2">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
