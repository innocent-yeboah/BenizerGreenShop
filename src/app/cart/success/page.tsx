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
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/products" className="btn-primary">
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
