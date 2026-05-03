import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { parseOrderItemsJson } from "@/lib/order-email-notify";
import { orderStatusBadgeClass, orderStatusLabel } from "@/lib/order-status-meta";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { currencyFormatter } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

type OrderRow = {
  id: string;
  created_at: string;
  payment_reference: string | null;
  status: string;
  total_amount: number | string | null;
  items: unknown;
};

export default async function AccountOverviewPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-brand-charcoal/80">
        Connect Supabase in your environment variables to unlock account features.
      </p>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/auth/sign-in?next=/account");
  }

  const { count: orderCountRaw, error: countError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const {
    data: recentRaw,
    error: recentError,
  } = await supabase
    .from("orders")
    .select("id,created_at,payment_reference,status,total_amount,items")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4);

  if (countError || recentError) {
    console.error("[account]", countError?.message || recentError?.message);
  }

  const orderCount = typeof orderCountRaw === "number" ? orderCountRaw : 0;
  const recentOrders = ((recentRaw || []) as OrderRow[]).slice(0, 3);

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brand-green-dark md:text-3xl">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-charcoal/70">
          Signed in as <span className="font-medium text-brand-charcoal">{user.email}</span>. Orders placed while
          signed in with this account appear below. Guests can always use{" "}
          <Link href="/order-status" className="font-semibold text-brand-green underline-offset-2 hover:underline">
            track order
          </Link>{" "}
          by reference.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-brand-green/10 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-charcoal/45">Orders</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-brand-green-dark">{orderCount}</p>
          <p className="mt-2 text-xs text-brand-charcoal/55">Recorded on this account.</p>
        </article>
        <article className="rounded-2xl border border-brand-green/10 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-charcoal/45">Member since</p>
          <p className="mt-2 text-xl font-bold text-brand-green-dark">{memberSince}</p>
          <p className="mt-2 text-xs text-brand-charcoal/55">Thank you for shopping with us.</p>
        </article>
        <Link
          href="/products"
          className="group rounded-2xl border border-brand-green/15 bg-linear-to-br from-brand-green-dark to-brand-green p-5 text-white shadow-[0_14px_40px_-26px_rgba(13,59,15,0.55)] transition-transform hover:-translate-y-px"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/75">Shopping</p>
          <p className="mt-3 flex items-center text-lg font-bold">
            Browse products
            <ChevronRight className="ml-1 size-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </p>
          <p className="mt-2 text-xs text-white/80">Organic wellness &amp; supplements.</p>
        </Link>
      </section>

      <section aria-labelledby="recent-orders-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-green/10 pb-4">
          <h2 id="recent-orders-heading" className="text-lg font-bold text-brand-green-dark md:text-xl">
            Recent orders
          </h2>
          <Link href="/account/orders" className="text-sm font-semibold text-brand-green hover:underline">
            View all orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-brand-green/20 bg-white/60 px-6 py-14 text-center">
            <p className="font-medium text-brand-charcoal/80">No orders yet.</p>
            <p className="mt-2 max-w-md mx-auto text-sm text-brand-charcoal/58">
              When you check out signed in as <strong className="text-brand-charcoal/80">{user.email}</strong>, your
              receipts will appear here.
            </p>
            <Link
              href="/products"
              className="btn-primary mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {recentOrders.map((order) => {
              const items = parseOrderItemsJson(order.items);
              const ref = order.payment_reference ?? order.id.slice(0, 8).toUpperCase();
              const total = Number(order.total_amount ?? 0);
              const statusClass = orderStatusBadgeClass(order.status);
              const statusText = orderStatusLabel(order.status);
              return (
                <li key={order.id}>
                  <div className="flex flex-col gap-3 rounded-xl border border-brand-green/12 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 gap-y-1">
                        <span className="font-mono text-sm font-semibold text-brand-green-dark">{ref}</span>
                        <span
                          className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-brand-charcoal/52">
                        {new Date(order.created_at).toLocaleString()} ·{" "}
                        <span className="font-semibold text-brand-charcoal/70">{items.length || "—"} line items</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-6 sm:flex-col sm:items-end sm:gap-2">
                      <p className="text-lg font-bold tabular-nums text-brand-green-dark">
                        {currencyFormatter.format(total)}
                      </p>
                      {order.payment_reference ? (
                        <Link
                          href={`/order-status?reference=${encodeURIComponent(order.payment_reference)}`}
                          className="text-sm font-semibold text-brand-green hover:underline"
                        >
                          Track
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
