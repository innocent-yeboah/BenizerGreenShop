/**
 * Public URL for redirects and payment callbacks (Moolre, Paystack, Supabase).
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL — canonical site URL (set on Vercel to your real domain, e.g. https://yoursite.com)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — on Vercel Production only, your production hostname
 * 3. NEXT_PUBLIC_SITE_URL — local dev; on Vercel, ignored if it still points to localhost (common misconfig)
 * 4. VERCEL_URL — automatic on Vercel (preview/production deployment host, often *.vercel.app)
 * 5. localhost for development
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostish(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function withHttpsIfNeeded(hostOrUrl: string): string {
  const t = hostOrUrl.trim();
  if (!t) return t;
  return t.startsWith("http") ? stripTrailingSlash(t) : stripTrailingSlash(`https://${t}`);
}

export function getPublicAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(
      explicit.startsWith("http") ? explicit : `https://${explicit}`,
    );
  }

  // Production deployment’s primary hostname (Vercel) — often your custom domain.
  if (process.env.VERCEL_ENV === "production") {
    const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (production) {
      return withHttpsIfNeeded(production);
    }
  }

  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    const normalized = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
    // Copied .env often keeps localhost; on Vercel that breaks payment callbacks / redirects.
    if (process.env.VERCEL === "1" && isLocalhostish(normalized)) {
      siteUrl = "";
    } else {
      return stripTrailingSlash(normalized);
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return stripTrailingSlash(host);
  }

  return "http://localhost:3000";
}
