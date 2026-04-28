import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Moolre server-to-server callback (configure in Moolre dashboard as callbackUrl).
 * Payload shape may vary — we accept common reference + success fields.
 * Add MOOLRE_WEBHOOK_SECRET and signature verification when your Moolre docs specify it.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const secret = process.env.MOOLRE_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get("x-moolre-signature") || request.headers.get("x-signature");
    if (!sig || sig !== secret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const data = (body.data as Record<string, unknown> | undefined) || body;
  const reference = String(
    data.reference ?? data.transactionRef ?? body.reference ?? "",
  );
  const statusRaw = String(
    data.status ?? data.state ?? body.status ?? "",
  ).toLowerCase();
  const success =
    statusRaw.includes("success") ||
    statusRaw.includes("paid") ||
    statusRaw.includes("complete") ||
    body.status === 1;

  if (!reference || !success) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_gateway: "moolre",
    })
    .eq("payment_reference", reference);

  const { data: orderRow } = await supabase
    .from("orders")
    .select("total_amount, distributor_referral_code")
    .eq("payment_reference", reference)
    .maybeSingle();

  const distributorCode =
    orderRow?.distributor_referral_code ||
    String(
      (data.metadata as Record<string, unknown> | undefined)?.distributor_code ??
        (data.metadata as Record<string, unknown> | undefined)?.distributorCode ??
        "",
    );
  const paidAmount = orderRow?.total_amount != null ? Number(orderRow.total_amount) : 0;

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
