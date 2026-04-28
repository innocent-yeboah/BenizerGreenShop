import { updateLeadStatusAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();
  const { data: leads } = supabase
    ? await supabase
        .from("leads")
        .select("id,created_at,name,email,phone,type,status,product_interest")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="container-shell py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Growth Pipeline
      </p>
      <h1 className="text-3xl font-bold text-brand-green-dark">Admin Leads</h1>
      <p className="mt-2 text-sm text-brand-charcoal/70">
        Manage customer and distributor lead conversion stages.
      </p>
      <ul className="mt-6 space-y-3">
        {(leads || []).map((lead) => (
          <li key={lead.id} className="surface-card rounded-xl p-4">
            <p className="font-semibold">{lead.name}</p>
            <p className="text-xs text-brand-charcoal/70">
              {lead.email} | {lead.phone} | {lead.type} {lead.product_interest ? `| ${lead.product_interest}` : ""}
            </p>
            <form action={updateLeadStatusAction} className="mt-3 flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <select name="status" defaultValue={lead.status} className="rounded border border-brand-green/20 p-2">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="converted_customer">converted_customer</option>
                <option value="converted_distributor">converted_distributor</option>
                <option value="lost">lost</option>
              </select>
              <button className="btn-primary rounded px-4 py-2">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
