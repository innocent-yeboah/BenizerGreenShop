import { updateOrderStatusAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { currencyFormatter } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders } = supabase
    ? await supabase
        .from("orders")
        .select("id,created_at,customer_name,total_amount,status,payment_reference")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="container-shell py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Sales Operations
      </p>
      <h1 className="text-3xl font-bold text-brand-green-dark">Admin Orders</h1>
      <p className="mt-2 text-sm text-brand-charcoal/70">
        Track payments and move orders through fulfillment.
      </p>
      <ul className="mt-6 space-y-3">
        {(orders || []).map((order) => (
          <li key={order.id} className="surface-card rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-xs text-brand-charcoal/70">{order.payment_reference || order.id}</p>
              </div>
              <p className="font-bold">{currencyFormatter.format(Number(order.total_amount))}</p>
            </div>
            <form action={updateOrderStatusAction} className="mt-3 flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select name="status" defaultValue={order.status} className="rounded border border-brand-green/20 p-2">
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="paid">paid</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="failed">failed</option>
              </select>
              <button className="btn-primary rounded px-4 py-2">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
