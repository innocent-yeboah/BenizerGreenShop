"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  REFERRAL_UPDATED_EVENT,
  getPersistedReferralCode,
} from "@/lib/referral-storage";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading"; code: string }
  | { phase: "ready"; code: string; displayName: string }
  | { phase: "error"; code: string };

export function ReferralShoppingBanner() {
  const [state, setState] = useState<LookupState>({ phase: "idle" });

  const runLookup = useCallback(async (code: string) => {
    if (!code) {
      setState({ phase: "idle" });
      return;
    }
    setState({ phase: "loading", code });
    try {
      const res = await fetch(`/api/referral/lookup?code=${encodeURIComponent(code)}`);
      const body = (await res.json()) as {
        found?: boolean;
        displayName?: string;
      };
      if (!res.ok || !body.found) {
        setState({ phase: "error", code });
        return;
      }
      setState({
        phase: "ready",
        code,
        displayName: body.displayName || "your distributor",
      });
    } catch {
      setState({ phase: "error", code });
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      void runLookup(getPersistedReferralCode());
    };
    sync();
    window.addEventListener(REFERRAL_UPDATED_EVENT, sync);
    return () => window.removeEventListener(REFERRAL_UPDATED_EVENT, sync);
  }, [runLookup]);

  if (state.phase === "idle" || state.phase === "loading") {
    return null;
  }

  if (state.phase === "error") {
    return (
      <aside className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-center text-xs text-amber-900 sm:text-sm">
        Referral{" "}
        <span className="font-mono font-semibold tabular-nums">{state.code}</span>{" "}
        could not be verified. You can continue shopping or{" "}
        <Link href="/cart" className="font-semibold underline underline-offset-2">
          enter a valid code at checkout
        </Link>
        .
      </aside>
    );
  }

  return (
    <aside className="border-b border-brand-green/15 bg-brand-green/12 px-6 py-2.5 text-center text-xs text-brand-charcoal sm:text-sm">
      You&apos;re shopping with{" "}
      <strong className="font-semibold text-brand-green-dark">{state.displayName}</strong>
      {" — "}
      referral{" "}
      <span className="font-mono font-semibold tabular-nums text-brand-green-dark">{state.code}</span>
      {" will apply at checkout."}
    </aside>
  );
}
