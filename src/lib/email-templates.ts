import { currencyFormatter } from "@/lib/utils";
import { siteConfig } from "@/lib/site-data";

/** Matches storefront `--color-brand-*` in globals.css for transactional emails. */
export const EMAIL_BRAND = {
  green: "#1b5e20",
  greenDark: "#0d3b0f",
  gold: "#ffc107",
  goldDark: "#ffa000",
  cream: "#fff8e1",
  charcoal: "#212121",
  greenLight: "#a5d6a7",
  white: "#ffffff",
} as const;

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** First token for a friendly greeting (falls back to "there"). */
export function firstNameFromFullName(fullName: string): string {
  const t = fullName.trim();
  if (!t) return "there";
  return t.split(/\s+/)[0] ?? "there";
}

function wrapEmail(inner: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.cream};font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:${EMAIL_BRAND.charcoal};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BRAND.cream};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${EMAIL_BRAND.white};border-radius:12px;overflow:hidden;border:1px solid ${EMAIL_BRAND.greenLight};box-shadow:0 8px 24px rgba(27,94,32,0.08);">
${inner}
</table>
<p style="margin:16px 0 0;font-size:12px;color:${EMAIL_BRAND.charcoal};opacity:0.75;">${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.tagline)}</p>
</td></tr></table>
</body></html>`;
}

export function orderCheckoutConfirmationEmail(params: {
  customerName: string;
  reference: string;
  amountGhs: number;
  items: { title: string; quantity: number; unitPrice: number; total: number }[];
  checkoutUrl: string;
  appUrl: string;
}): { subject: string; html: string } {
  const first = firstNameFromFullName(params.customerName);
  const href =
    params.checkoutUrl.startsWith("http") ? params.checkoutUrl : `${params.appUrl.replace(/\/$/, "")}${params.checkoutUrl.startsWith("/") ? params.checkoutUrl : `/${params.checkoutUrl}`}`;
  const rows = params.items
    .map(
      (row) =>
        `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;">${escapeHtml(row.title)} × ${row.quantity}</td><td align="right" style="padding:10px 12px;border-bottom:1px solid #eee;white-space:nowrap;">${currencyFormatter.format(row.total)}</td></tr>`,
    )
    .join("");
  const inner = `
<tr><td style="background:linear-gradient(135deg,${EMAIL_BRAND.greenDark} 0%,${EMAIL_BRAND.green} 100%);padding:22px 24px;text-align:center;">
<p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">${escapeHtml(siteConfig.tagline)}</p>
<h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:${EMAIL_BRAND.white};">${escapeHtml(siteConfig.name)}</h1>
</td></tr>
<tr><td style="padding:24px 24px 8px;">
<p style="margin:0 0 16px;font-size:17px;color:${EMAIL_BRAND.charcoal};">Hi <strong>${escapeHtml(first)}</strong>,</p>
<p style="margin:0 0 16px;">Thank you for your order. Your reference is <strong style="color:${EMAIL_BRAND.green};">${escapeHtml(params.reference)}</strong>.</p>
<p style="margin:0 0 20px;">Complete payment using the button below when you&apos;re ready.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr><td style="border-radius:999px;background:${EMAIL_BRAND.gold};">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-weight:700;font-size:15px;color:${EMAIL_BRAND.charcoal};text-decoration:none;border-radius:999px;background:${EMAIL_BRAND.gold};border-bottom:3px solid ${EMAIL_BRAND.goldDark};">Complete payment</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${EMAIL_BRAND.cream};border-radius:8px;overflow:hidden;">
<tr><td colspan="2" style="padding:12px 14px;background:rgba(27,94,32,0.08);font-weight:700;color:${EMAIL_BRAND.greenDark};">Order summary</td></tr>
${rows}
<tr><td style="padding:12px 14px;font-weight:700;">Total</td><td align="right" style="padding:12px 14px;font-weight:700;color:${EMAIL_BRAND.green};">${currencyFormatter.format(params.amountGhs)}</td></tr>
</table>
</td></tr>
<tr><td style="padding:24px;font-size:14px;color:#555;">
<p style="margin:0;">Questions? Reply to this email or reach us at <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:${EMAIL_BRAND.green};font-weight:600;">${escapeHtml(siteConfig.email)}</a>.</p>
</td></tr>`;

  return {
    subject: `Your order ${params.reference} — ${siteConfig.name}`,
    html: wrapEmail(inner),
  };
}

export function distributorApplicationConfirmationEmail(params: {
  applicantName: string;
  packageLine: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const first = firstNameFromFullName(params.applicantName);
  const shopLink = params.siteUrl.replace(/\/$/, "");
  const inner = `
<tr><td style="background:linear-gradient(135deg,${EMAIL_BRAND.greenDark} 0%,${EMAIL_BRAND.green} 100%);padding:22px 24px;text-align:center;">
<p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">${escapeHtml(siteConfig.tagline)}</p>
<h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:${EMAIL_BRAND.white};">Application received</h1>
</td></tr>
<tr><td style="padding:24px 24px 8px;">
<p style="margin:0 0 16px;font-size:17px;color:${EMAIL_BRAND.charcoal};">Hi <strong>${escapeHtml(first)}</strong>,</p>
<p style="margin:0 0 16px;">Thank you for applying to join <strong>${escapeHtml(siteConfig.name)}</strong> as a distributor. We&apos;re excited you&apos;re interested in growing with us.</p>
<div style="margin:20px 0;padding:16px 18px;background:${EMAIL_BRAND.cream};border-left:4px solid ${EMAIL_BRAND.gold};border-radius:0 8px 8px 0;">
<p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:${EMAIL_BRAND.greenDark};font-weight:700;">Your selected package</p>
<p style="margin:0;font-size:15px;line-height:1.45;color:${EMAIL_BRAND.charcoal};">${escapeHtml(params.packageLine)}</p>
</div>
<p style="margin:0 0 20px;">Our team will review your application and get back to you soon.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px;"><tr><td style="border-radius:999px;background:${EMAIL_BRAND.green};">
<a href="${escapeHtml(shopLink)}" style="display:inline-block;padding:14px 28px;font-weight:700;font-size:15px;color:${EMAIL_BRAND.white};text-decoration:none;border-radius:999px;">Visit ${escapeHtml(siteConfig.name)}</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:12px 24px 24px;font-size:14px;color:#555;">
<p style="margin:0;">Questions? Email us at <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:${EMAIL_BRAND.green};font-weight:600;">${escapeHtml(siteConfig.email)}</a>.</p>
</td></tr>`;

  return {
    subject: `We received your distributor application — ${siteConfig.name}`,
    html: wrapEmail(inner),
  };
}
