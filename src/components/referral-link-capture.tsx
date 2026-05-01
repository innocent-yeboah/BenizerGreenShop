"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { normalizeReferralCode } from "@/lib/distributor-account";
import { persistReferralCode } from "@/lib/referral-storage";

/**
 * Reads `?ref=` and stores a normalized distributor code with a 30-day TTL.
 */
export function ReferralLinkCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const raw = searchParams.get("ref")?.trim();
    if (!raw) return;
    const code = normalizeReferralCode(raw);
    if (!code.length) return;
    persistReferralCode(code);
  }, [searchParams]);

  return null;
}
