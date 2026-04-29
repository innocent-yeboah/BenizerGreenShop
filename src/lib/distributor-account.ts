/** Readable distributor referral codes — avoids ambiguous chars. */
const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferralCode(prefix = "BGS"): string {
  let suffix = "";
  for (let i = 0; i < 5; i += 1) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `${prefix}${suffix}`;
}

export function normalizeReferralCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
