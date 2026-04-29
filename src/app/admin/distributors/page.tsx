import {
  approveDistributorAction,
  createDistributorAccountAction,
} from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { currencyFormatter } from "@/lib/utils";

type SearchProps = {
  searchParams?: Promise<{ created?: string; error?: string }>;
};

async function resolveEmailsForUserIds(userIds: string[]): Promise<Map<string, string>> {
  const admin = createAdminClient();
  const map = new Map<string, string>();
  if (!admin || userIds.length === 0) return map;

  await Promise.all(
    userIds.map(async (id) => {
      const { data, error } = await admin.auth.admin.getUserById(id);
      if (!error && data.user?.email) map.set(id, data.user.email);
    }),
  );
  return map;
}

export default async function AdminDistributorsPage(props: SearchProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const created = searchParams.created === "1";
  const errorMsg = searchParams.error ? decodeURIComponent(searchParams.error) : "";

  const supabase = createAdminClient();
  const { data: distributors } = supabase
    ? await supabase
        .from("distributors")
        .select("id,user_id,referral_code,total_sales,commission_earned,approved,created_at")
        .order("created_at", { ascending: false })
    : { data: [] };

  const userIds = [...new Set((distributors || []).map((d) => d.user_id).filter(Boolean))] as string[];
  const emailByUserId = await resolveEmailsForUserIds(userIds);

  const { data: distributorLeads } = supabase
    ? await supabase
        .from("leads")
        .select("id,name,email,created_at,status")
        .eq("type", "distributor")
        .neq("status", "converted_distributor")
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };

  return (
    <main className="container-shell py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Partner Network
      </p>
      <h1 className="text-3xl font-bold text-brand-green-dark">Admin Distributors</h1>
      <p className="mt-2 text-sm text-brand-charcoal/70">
        Create sign-in credentials for approved partners, approve accounts, and monitor referral performance.
      </p>

      {created ? (
        <p className="mt-4 rounded-lg border border-brand-green/25 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green-dark">
          Distributor account created. They can sign in at{" "}
          <strong>/auth/sign-in</strong> with the email and password you set—ask them to change the password after first login.
        </p>
      ) : null}
      {errorMsg ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMsg}</p>
      ) : null}

      <section className="surface-card mt-8 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand-green-dark">Create distributor login</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Registers a Supabase user with role <strong>distributor</strong>, approves them, and assigns a referral code.
          Leave referral blank to auto-generate (e.g. BGSXXXXX).
        </p>
        <form action={createDistributorAccountAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="ccd-email" className="block text-sm font-medium text-brand-charcoal">
              Email (sign-in)
            </label>
            <input
              id="ccd-email"
              name="email"
              type="email"
              required
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-brand-green/20 p-3"
              placeholder="partner@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ccd-password" className="block text-sm font-medium text-brand-charcoal">
              Temporary password
            </label>
            <input
              id="ccd-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-brand-green/20 p-3"
              placeholder="Min. 8 characters"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ccd-fullname" className="block text-sm font-medium text-brand-charcoal">
              Full name
            </label>
            <input
              id="ccd-fullname"
              name="fullName"
              type="text"
              className="mt-1 w-full rounded-lg border border-brand-green/20 p-3"
              placeholder="As registered"
            />
          </div>
          <div>
            <label htmlFor="ccd-ref" className="block text-sm font-medium text-brand-charcoal">
              Referral code (optional)
            </label>
            <input
              id="ccd-ref"
              name="referralCode"
              type="text"
              className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-mono uppercase"
              placeholder="Auto if empty"
            />
          </div>
          <div>
            <label htmlFor="ccd-lead" className="block text-sm font-medium text-brand-charcoal">
              Link application (optional)
            </label>
            <select
              id="ccd-lead"
              name="leadId"
              className="mt-1 w-full rounded-lg border border-brand-green/20 bg-white p-3 text-sm"
              defaultValue=""
            >
              <option value="">None</option>
              {(distributorLeads || []).map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} · {lead.email} ({lead.status})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary rounded-lg px-6 py-3 font-semibold">
              Create credentials & approve
            </button>
          </div>
        </form>
      </section>

      <h2 className="mt-10 text-lg font-bold text-brand-green-dark">Existing distributors</h2>
      <ul className="mt-4 space-y-3">
        {(distributors || []).map((distributor) => (
          <li key={distributor.id} className="surface-card rounded-xl p-4">
            <p className="font-semibold">{distributor.referral_code}</p>
            <p className="text-xs text-brand-charcoal/70">
              Email: {emailByUserId.get(distributor.user_id) || "—"}
            </p>
            <p className="mt-1 text-xs text-brand-charcoal/70">
              Sales: {currencyFormatter.format(Number(distributor.total_sales))} | Commission:{" "}
              {currencyFormatter.format(Number(distributor.commission_earned))}
            </p>
            <form action={approveDistributorAction} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="distributorId" value={distributor.id} />
              <select
                name="approved"
                defaultValue={String(distributor.approved)}
                className="rounded border border-brand-green/20 p-2 text-sm"
              >
                <option value="false">Pending</option>
                <option value="true">Approved</option>
              </select>
              <button className="btn-primary rounded px-4 py-2 text-sm">Update status</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
