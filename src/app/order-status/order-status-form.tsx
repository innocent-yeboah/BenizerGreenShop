"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { lookupOrder } from "@/app/actions";
import { currencyFormatter } from "@/lib/utils";

function orderStatusLabel(status: string): string {
  const s = status.trim().toLowerCase();
  const map: Record<string, string> = {
    pending: "Awaiting payment",
    processing: "Processing",
    paid: "Payment confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    failed: "Payment issue",
  };
  return map[s] ?? status;
}

type OrderSummary = {
  reference: string;
  status: string;
  customerName: string;
  totalAmount: number;
  items: { title: string; quantity: number; total: number }[];
  createdAt: string;
  paymentGateway: string | null;
};

type LookupPayload = { found: true; order: OrderSummary } | { found: false };

export function OrderStatusForm() {
  const searchParams = useSearchParams();
  const qpRef = searchParams.get("reference")?.trim() ?? "";
  const [reference, setReference] = useState(qpRef);
  const [email, setEmail] = useState("");
  const action = useAction(lookupOrder);

  useEffect(() => {
    if (!qpRef) return;
    queueMicrotask(() => setReference(qpRef));
  }, [qpRef]);

  const data = action.result?.data as LookupPayload | undefined;
  const parsed = data && typeof data === "object" && "found" in data ? data : undefined;

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await action.executeAsync({
        reference: reference.trim(),
        email: email.trim(),
      });
    },
    [action, reference, email],
  );

  const errorMessage = useMemo(() => {
    if (!action.result) return "";
    const v = action.result.validationErrors;
    if (!v) return "";
    const refErr = v.reference?._errors?.[0];
    const emailErr = v.email?._errors?.[0];
    return refErr || emailErr || "";
  }, [action.result]);

  return (
    <>
      <form onSubmit={onSubmit} className="surface-card mt-10 max-w-xl rounded-2xl p-6 md:p-8">
        <label className="block text-sm font-semibold text-brand-charcoal">
          Order reference
          <input
            type="text"
            name="reference"
            autoComplete="off"
            spellCheck={false}
            placeholder="BGS-…"
            className="mt-1.5 w-full rounded-lg border border-brand-green/20 px-3 py-2.5 font-mono text-sm"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-brand-charcoal">
          Email used at checkout
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-brand-green/20 px-3 py-2.5 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={action.status === "executing"}
          className="btn-primary mt-6 w-full justify-center rounded-lg px-4 py-3 font-semibold shadow-sm disabled:opacity-60"
        >
          {action.status === "executing" ? "Looking up…" : "Look up order"}
        </button>
        {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
        {action.result?.serverError ? (
          <p className="mt-3 text-sm text-red-600">Something went wrong. Try again in a moment.</p>
        ) : null}
      </form>

      {parsed?.found === true ? (
        <section className="surface-card mx-auto mt-10 max-w-2xl rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-green-dark">
            Reference {parsed.order.reference}
          </h2>
          <p className="mt-2 text-sm text-brand-charcoal/80">
            Status:{" "}
            <strong className="text-brand-green-dark">
              {orderStatusLabel(parsed.order.status)}
            </strong>
          </p>
          <p className="mt-1 text-sm text-brand-charcoal/80">
            Placed on {new Date(parsed.order.createdAt).toLocaleString()}
            {parsed.order.paymentGateway ? (
              <>
                {" "}
                · Paid via <span className="capitalize">{parsed.order.paymentGateway}</span>
              </>
            ) : null}
          </p>
          <p className="mt-4 text-lg font-semibold tabular-nums">
            Total {currencyFormatter.format(parsed.order.totalAmount)}
          </p>
          {parsed.order.items.length ? (
            <ul className="mt-4 space-y-2 border-t border-brand-green/15 pt-4 text-sm">
              {parsed.order.items.map((item, idx) => (
                <li
                  key={`${item.title}-${idx}`}
                  className="flex justify-between gap-4 text-brand-charcoal/85"
                >
                  <span>
                    {item.title}{" "}
                    <span className="tabular-nums text-brand-charcoal/55">×{item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {currencyFormatter.format(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {parsed?.found === false ? (
        <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          No order matches that reference and email. Check for typos (reference is{" "}
          <span className="font-semibold">case-sensitive</span>) or{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-2">
            start a new order
          </Link>
          .
        </p>
      ) : null}
    </>
  );
}
