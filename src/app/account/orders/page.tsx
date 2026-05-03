import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { parseOrderItemsJson } from "@/lib/order-email-notify";
import { orderStatusBadgeClass, orderStatusLabel } from "@/lib/order-status-meta";
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
    .limit(100);

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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brand-green-dark md:text-3xl">Order history</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-charcoal/70">
          Receipts for purchases made while signed in as <span className="font-medium">{user.email}</span>. Use the
          payment reference on your bank or SMS when you need support.
        </p>
      </header>

      {!orders.length ? (
        <div className="rounded-2xl border border-dashed border-brand-green/20 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-brand-charcoal/85">No orders yet</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-charcoal/60">
            Checkout while signed in so your history stays in one place—or open{" "}
            <Link href="/order-status" className="font-semibold text-brand-green underline-offset-2 hover:underline">
              track order
            </Link>{" "}
            with the email we sent you.
          </p>
          <Link
            href="/products"
            className="btn-primary mt-8 inline-flex rounded-full px-8 py-3 text-sm font-semibold"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => {
            const items = parseOrderItemsJson(order.items);
            const ref = order.payment_reference ?? `Order ${order.id.slice(0, 8)}`;
            const total = Number(order.total_amount ?? 0);
            const badge = orderStatusBadgeClass(order.status);
            const label = orderStatusLabel(order.status);
            const placed = new Date(order.created_at);
            return (
              <li key={order.id}>
                <article className="overflow-hidden rounded-2xl border border-brand-green/10 bg-white shadow-[0_18px_42px_-38px_rgba(13,59,15,0.45)]">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-green/10 bg-brand-cream/30 px-5 py-4 sm:px-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-charcoal/45">
                          Reference
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${badge}`}
                        >
                          {label}
                        </span>
                      </div>
                      <p className="font-mono text-sm font-bold text-brand-green-dark sm:text-base">{ref}</p>
                      <p className="text-xs text-brand-charcoal/55">
                        Placed{" "}
                        <time dateTime={placed.toISOString()}>
                          {placed.toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          · {placed.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        </time>
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-charcoal/45">Total</p>
                        <p className="text-right text-xl font-bold tabular-nums text-brand-green-dark sm:text-2xl">
                          {currencyFormatter.format(total)}
                        </p>
                      </div>
                      {order.payment_reference ? (
                        <Link
                          href={`/order-status?reference=${encodeURIComponent(order.payment_reference)}`}
                          className="text-sm font-semibold text-brand-green hover:underline"
                        >
                          Track shipment
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="px-5 py-4 sm:px-6">
                    {items.length ? (
                      <ul className="divide-y divide-brand-green/8">
                        {items.map((row) => (
                          <li key={`${order.id}-${row.title}-${row.quantity}`} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <span className="min-w-0 text-sm text-brand-charcoal/90">
                              <span className="font-medium">{row.title}</span>{" "}
                              <span className="tabular-nums text-brand-charcoal/50">× {row.quantity}</span>
                            </span>
                            <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-charcoal">
                              {currencyFormatter.format(row.total)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-brand-charcoal/55">
                        Line-item detail isn&apos;t stored for this legacy order. Use your reference above for support.
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
