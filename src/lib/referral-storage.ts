import { normalizeReferralCode } from "@/lib/distributor-account";

/** Stored referral from `?ref=` — applied at checkout for 30 days. */
export const REFERRAL_STORAGE_KEY = "bgs_ref_v1";

export const REFERRAL_UPDATED_EVENT = "bgs-referral-updated";

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredPayload = {
  code: string;
  storedAt: number;
};

export function dispatchReferralUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REFERRAL_UPDATED_EVENT));
}

function readStored(): StoredPayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredPayload;
    if (!parsed.code || typeof parsed.storedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Returns normalized stored code if still valid, otherwise clears storage and returns "". */
export function getPersistedReferralCode(): string {
  const row = readStored();
  if (!row) return "";
  const code = normalizeReferralCode(row.code);
  if (!code.length || Date.now() - row.storedAt > TTL_MS) {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    return "";
  }
  return code;
}

/** Persists a raw URL segment; emits {@link REFERRAL_UPDATED_EVENT}. */
export function persistReferralCode(raw: string): void {
  if (typeof window === "undefined") return;
  const code = normalizeReferralCode(raw);
  if (!code.length) return;
  const payload: StoredPayload = { code, storedAt: Date.now() };
  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(payload));
  dispatchReferralUpdated();
}

export function clearPersistedReferralCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
  dispatchReferralUpdated();
}
