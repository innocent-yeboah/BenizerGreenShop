import Link from "next/link";

export default async function CartSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <main className="container-shell py-16">
      <section className="surface-card mx-auto max-w-2xl rounded-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
          Payment Confirmed
        </p>
        <h1 className="text-3xl font-bold text-brand-green-dark">Order Received</h1>
        <p className="mt-3 text-brand-charcoal/85">
          Thank you for choosing Benizer Green Shop. Your reference is{" "}
          <span className="font-semibold">{reference || "BGS-PENDING"}</span>.
        </p>
        <p className="mt-4 text-sm text-brand-charcoal/70">
          Want updates? Track progress anytime with your reference — we&apos;ll also email you when your
          order is paid or out for delivery.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {reference ? (
            <Link
              href={`/order-status?reference=${encodeURIComponent(reference)}`}
              className="btn-primary"
            >
              Track this order
            </Link>
          ) : (
            <Link href="/order-status" className="btn-primary">
              Track an order
            </Link>
          )}
          <Link href="/products" className="btn-secondary">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-secondary">
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
