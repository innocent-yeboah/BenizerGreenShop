import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { currencyFormatter } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const { data: orders } = supabase
    ? await supabase.from("orders").select("total_amount")
    : { data: [] };
  const { data: leads } = supabase
    ? await supabase.from("leads").select("id")
    : { data: [] };
  const { data: products } = supabase
    ? await supabase
        .from("products")
        .select("id,title,stock")
        .order("stock", { ascending: true })
        .limit(5)
    : { data: [] };
  const { data: distributors } = supabase
    ? await supabase.from("distributors").select("id")
    : { data: [] };

  const totalSales = (orders || []).reduce(
    (sum, order) => sum + Number(order.total_amount),
    0,
  );

  return (
    <main className="container-shell py-14">
      <h1 className="text-4xl font-bold text-brand-green-dark">Admin Dashboard</h1>
      <p className="mt-2 text-brand-charcoal/80">Manage products, orders, leads, and distributor performance.</p>
      <a
        href="/api/admin/leads/export"
        className="btn-primary mt-4"
      >
        Export Leads CSV
      </a>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Card title="Total Sales (GHS)" value={currencyFormatter.format(totalSales)} />
        <Card title="Total Leads" value={String(leads?.length || 0)} />
        <Card title="Low Stock Products" value={String(products?.length || 0)} />
        <Card title="Distributors" value={String(distributors?.length || 0)} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-bold">Management Areas</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="surface-card rounded-lg p-3"><Link href="/admin/profile">Profile & sign-in</Link></li>
            <li className="surface-card rounded-lg p-3"><Link href="/admin/products">Products CRUD</Link></li>
            <li className="surface-card rounded-lg p-3"><Link href="/admin/orders">Orders Management</Link></li>
            <li className="surface-card rounded-lg p-3"><Link href="/admin/leads">Leads Pipeline</Link></li>
            <li className="surface-card rounded-lg p-3"><Link href="/admin/distributors">Distributors</Link></li>
          </ul>
        </div>
        <div className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-bold">Low Stock Alerts</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(products || []).map((product) => (
              <li key={product.id} className="flex items-center justify-between surface-card rounded-lg p-3">
                <span>{product.title}</span>
                <span className="font-semibold">{product.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
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
