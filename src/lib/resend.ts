import { Resend } from "resend";

/** True when transactional emails can be sent. */
export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/** Call only from server code (Server Actions, Route Handlers). */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

/**
 * Verified sender address for Resend.
 * Production: set `RESEND_FROM` to an identity verified in Resend (e.g. Benizer <noreply@yourdomain.com>).
 * Without it, Resend's sandbox `onboarding@resend.dev` is used (fine for testing; limits apply).
 */
export function getResendFrom(): string {
  const custom = process.env.RESEND_FROM?.trim();
  if (custom) return custom;
  return "Benizer Green Shop <onboarding@resend.dev>";
}
