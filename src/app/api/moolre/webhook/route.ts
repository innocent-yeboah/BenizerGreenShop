import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyCustomerOrderPaid } from "@/lib/order-email-notify";

/**
 * Moolre server-to-server callback (configure in Moolre dashboard as callbackUrl).
 * Payload shape may vary — we accept common reference + success fields.
 * Production: set MOOLRE_WEBHOOK_SECRET and configure Moolre to send the same value (header varies by integration).
 */
/** Require shared secret for webhooks on Vercel and when running `next start` in production. */
function mustVerifyMoolreWebhook(): boolean {
  if (process.env.MOOLRE_WEBHOOK_OPTIONAL === "true") return false;
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const secret = process.env.MOOLRE_WEBHOOK_SECRET?.trim();
  if (mustVerifyMoolreWebhook() && !secret) {
    console.error("[moolre webhook] MOOLRE_WEBHOOK_SECRET is required in production");
    return NextResponse.json(
      { error: "Webhook not configured (MOOLRE_WEBHOOK_SECRET)" },
      { status: 503 },
    );
  }
  if (secret) {
    const sig = request.headers.get("x-moolre-signature") || request.headers.get("x-signature");
    if (!sig || sig !== secret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.warn("[moolre webhook] MOOLRE_WEBHOOK_SECRET unset — accepting unsigned callbacks (dev only)");
  }

  const data = (body.data as Record<string, unknown> | undefined) || body;
  const reference = String(
    data.reference ??
      data.transactionRef ??
      data.tx_ref ??
      data.txRef ??
      body.reference ??
      body.transactionRef ??
      body.tx_ref ??
      "",
  );

  const rawStatus =
    data.status ??
    data.state ??
    data.payment_status ??
    data.paymentStatus ??
    body.status ??
    body.state ??
    body.payment_status ??
    body.paymentStatus;
  const statusRaw = String(rawStatus ?? "").trim().toLowerCase();
  const success =
    rawStatus === true ||
    rawStatus === 1 ||
    rawStatus === "1" ||
    statusRaw.includes("success") ||
    statusRaw.includes("successful") ||
    statusRaw.includes("paid") ||
    statusRaw.includes("approve") ||
    statusRaw.includes("complete");

  if (!reference || !success) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: orderRow } = await supabase
    .from("orders")
    .select(
      "status, total_amount, distributor_referral_code, customer_email, customer_name, items, payment_reference",
    )
    .eq("payment_reference", reference)
    .maybeSingle();

  if (!orderRow) {
    return NextResponse.json({ ok: true, ignored: true, reason: "unknown_reference" });
  }

  if (orderRow.status === "paid") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const paidAmount = orderRow.total_amount != null ? Number(orderRow.total_amount) : 0;

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_gateway: "moolre",
    })
    .eq("payment_reference", reference);

  if (orderRow.customer_email && reference) {
    await notifyCustomerOrderPaid({
      customerEmail: orderRow.customer_email as string,
      customerName: String(orderRow.customer_name ?? ""),
      reference,
      totalAmount: paidAmount,
      itemsRaw: orderRow.items,
    });
  }

  const metadata =
    (data.metadata as Record<string, unknown> | undefined) ||
    (body.metadata as Record<string, unknown> | undefined);
  const distributorCode =
    orderRow.distributor_referral_code ||
    String(metadata?.distributor_code ?? metadata?.distributorCode ?? "");

  if (distributorCode && paidAmount > 0) {
    const commission = paidAmount * 0.1;
    const { data: distributor } = await supabase
      .from("distributors")
      .select("id,total_sales,commission_earned")
      .eq("referral_code", distributorCode)
      .maybeSingle();

    if (distributor) {
      await supabase
        .from("distributors")
        .update({
          total_sales: Number(distributor.total_sales) + paidAmount,
          commission_earned: Number(distributor.commission_earned) + commission,
        })
        .eq("id", distributor.id);
    }
  }

  return NextResponse.json({ ok: true });
}
