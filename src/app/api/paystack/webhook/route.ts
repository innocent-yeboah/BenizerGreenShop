import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  if (payload?.event !== "charge.success") {
    return NextResponse.json({ ok: true });
  }

  const reference = String(payload?.data?.reference || "");
  if (!reference) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 500 });
  }

  const { data: orderRow } = await supabase
    .from("orders")
    .select("status, distributor_referral_code, total_amount")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (!orderRow) {
    return NextResponse.json({ ok: true, ignored: true, reason: "unknown_reference" });
  }

  if (orderRow.status === "paid") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_gateway: "paystack",
    })
    .eq("payment_reference", reference);

  const distributorCode =
    (payload?.data?.metadata?.distributor_code as string | undefined) ||
    orderRow.distributor_referral_code ||
    undefined;
  const paidAmount =
    orderRow.total_amount != null
      ? Number(orderRow.total_amount)
      : Number(payload?.data?.amount || 0) / 100;

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
