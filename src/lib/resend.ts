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

function extractEmailAddress(input: string): string {
  const trimmed = input.trim().toLowerCase();
  const match = trimmed.match(/<([^>]+)>/);
  return (match?.[1] || trimmed).trim();
}

/** True when using Resend sandbox sender (onboarding@resend.dev). */
export function isResendSandboxSender(from: string): boolean {
  return extractEmailAddress(from).endsWith("@resend.dev");
}

/**
 * Optional comma-separated allowlist for sandbox/testing sends.
 * Example: RESEND_SANDBOX_ALLOWLIST=you@gmail.com,admin@domain.com
 */
export function getResendSandboxAllowlist(): string[] {
  return (process.env.RESEND_SANDBOX_ALLOWLIST || "")
    .split(",")
    .map((v) => extractEmailAddress(v))
    .filter(Boolean);
}

/**
 * Sandbox rule: onboarding@resend.dev can only send to allowlisted testing emails.
 * Production sender domains are unrestricted by this helper.
 */
export function canSendWithCurrentResendSender(params: { from: string; to: string[] }): boolean {
  if (!isResendSandboxSender(params.from)) return true;
  const allow = new Set(getResendSandboxAllowlist());
  if (!allow.size) return false;
  return params.to.every((addr) => allow.has(extractEmailAddress(addr)));
}
