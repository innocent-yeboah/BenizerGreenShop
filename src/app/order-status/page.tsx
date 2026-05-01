import Link from "next/link";
import { Suspense } from "react";
import { OrderStatusForm } from "@/app/order-status/order-status-form";

export default function OrderStatusPage() {
  return (
    <main className="container-shell py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Order tracking
      </p>
      <h1 className="mt-2 text-4xl font-bold text-brand-green-dark">Track your order</h1>
      <p className="mt-3 max-w-2xl text-brand-charcoal/85">
        Enter the order reference sent to your email plus the checkout email — we&apos;ll show
        your current fulfillment status without signing in.
      </p>

      <Suspense fallback={<div className="mt-10 h-40 animate-pulse rounded-2xl bg-brand-green/10" aria-hidden />}>
        <OrderStatusForm />
      </Suspense>

      <p className="mx-auto mt-12 max-w-xl text-center text-sm text-brand-charcoal/65">
        Need help?{" "}
        <Link href="/cart" className="font-semibold text-brand-green-dark underline underline-offset-2">
          Return to checkout
        </Link>{" "}
        or message us from the site footer.
      </p>
    </main>
  );
}
