import { getPublicAppUrl } from "@/lib/app-url";
import { orderFulfillmentEmail, orderPaymentReceivedEmail } from "@/lib/email-templates";
import { sendTransactionalEmail } from "@/lib/transactional-email";

export type OrderItemRow = { title: string; quantity: number; total: number };

export function parseOrderItemsJson(raw: unknown): OrderItemRow[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: OrderItemRow[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const title = String(o.title ?? "Item");
    const quantity = Number(o.quantity) || 1;
    const unit = Number(o.unitPrice) || 0;
    const total =
      typeof o.total === "number" && !Number.isNaN(o.total)
        ? o.total
        : unit * quantity;
    out.push({ title, quantity, total });
  }
  return out;
}

export async function notifyCustomerOrderPaid(params: {
  customerEmail: string;
  customerName: string;
  reference: string;
  totalAmount: number;
  itemsRaw: unknown;
}): Promise<void> {
  let items = parseOrderItemsJson(params.itemsRaw);
  if (!items.length) {
    items = [{ title: "Your order", quantity: 1, total: params.totalAmount }];
  }
  const appUrl = getPublicAppUrl();
  const trackOrderUrl = `${appUrl}/order-status?reference=${encodeURIComponent(params.reference)}`;
  const mail = orderPaymentReceivedEmail({
    customerName: params.customerName,
    reference: params.reference,
    amountGhs: params.totalAmount,
    items,
    trackOrderUrl,
  });
  await sendTransactionalEmail({
    to: [params.customerEmail.trim().toLowerCase()],
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    context: "order-paid-customer",
  });
}

export async function notifyCustomerOrderFulfillment(params: {
  customerEmail: string;
  customerName: string;
  reference: string;
  stage: "shipped" | "delivered";
}): Promise<void> {
  const appUrl = getPublicAppUrl();
  const trackOrderUrl = `${appUrl}/order-status?reference=${encodeURIComponent(params.reference)}`;
  const mail = orderFulfillmentEmail({
    customerName: params.customerName,
    reference: params.reference,
    stage: params.stage,
    trackOrderUrl,
  });
  await sendTransactionalEmail({
    to: [params.customerEmail.trim().toLowerCase()],
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    context: `order-${params.stage}-customer`,
  });
}
