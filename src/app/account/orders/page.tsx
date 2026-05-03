import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { parseOrderItemsJson } from "@/lib/order-email-notify";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { currencyFormatter } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
};

type OrderRow = {
  id: string;
  created_at: string;
  payment_reference: string | null;
  status: string;
  total_amount: number | string | null;
  items: unknown;
};

export default async function AccountOrdersPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-brand-charcoal/80">
        Supabase must be configured to load orders. After setup, ensure the database includes the orders{" "}
        <code className="rounded bg-brand-cream px-1">user_id</code> column and RLS policies from{" "}
        <code className="rounded bg-brand-cream px-1">supabase/schema.sql</code>.
      </p>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/account/orders");
  }

  const { data: ordersRaw, error } = await supabase
    .from("orders")
    .select("id,created_at,payment_reference,status,total_amount,items")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(75);

  if (error) {
    console.error("[account/orders]", error.message);
    return (
      <p className="text-sm text-red-700">
        We couldn&apos;t load orders. If your project predates shopper accounts, apply the migration in{" "}
        <span className="font-mono">supabase/schema.sql</span>, then reload.
      </p>
    );
  }

  const orders = (ordersRaw || []) as OrderRow[];

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-brand-green/15 bg-white/80 px-6 py-10 text-center">
        <p className="text-sm font-medium text-brand-charcoal/85">No orders linked to your account yet.</p>
        <p className="mt-3 text-xs text-brand-charcoal/65">
          Check out signed in using <span className="font-semibold">{user.email}</span> so purchases attach here—or use{" "}
          <Link href="/order-status" className="font-semibold text-brand-green underline-offset-2 hover:underline">
            Track order
          </Link>{" "}
          with your confirmation email anytime.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => {
        const items = parseOrderItemsJson(order.items);
        const ref = order.payment_reference || "(pending reference)";
        const total = Number(order.total_amount ?? 0);
        return (
          <li key={order.id} className="surface-card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-green/10 pb-3">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-charcoal/50">Reference</p>
                <p className="font-mono text-sm font-semibold text-brand-green-dark">{ref}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-charcoal/50">Total</p>
                <p className="text-base font-bold text-brand-green">{currencyFormatter.format(total)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-brand-charcoal/65">
              <span>
                <span className="font-semibold text-brand-charcoal/80">Placed:</span>{" "}
                {new Date(order.created_at).toLocaleString()}
              </span>
              <span className="inline-flex rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize text-brand-green-dark">
                {order.status.replace(/-/g, " ")}
              </span>
              {order.payment_reference ? (
                <Link
                  href={`/order-status?reference=${encodeURIComponent(order.payment_reference)}`}
                  className="font-semibold text-brand-green hover:underline"
                >
                  Track →
                </Link>
              ) : null}
            </div>
            {items.length ? (
              <ul className="mt-4 space-y-1.5 text-sm text-brand-charcoal/85">
                {items.map((row) => (
                  <li key={`${order.id}-${row.title}-${row.quantity}`} className="flex justify-between gap-3">
                    <span className="min-w-0">
                      {row.title}{" "}
                      <span className="tabular-nums text-brand-charcoal/55">×{row.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {currencyFormatter.format(row.total)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-brand-charcoal/55">Line items unavailable for this legacy order.</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
