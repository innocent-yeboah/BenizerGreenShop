/**
 * Public URL for redirects and payment callbacks (Moolre, Paystack, Supabase).
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL — canonical site URL (set on Vercel)
 * 2. NEXT_PUBLIC_SITE_URL — alternate naming used by some configs
 * 3. VERCEL_URL — automatic on Vercel (preview/production hostname)
 * 4. localhost for development
 */
export function getPublicAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (siteUrl) return siteUrl;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return host.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
