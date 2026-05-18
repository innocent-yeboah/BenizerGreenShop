/**
 * Public URL for redirects and payment callbacks (Moolre, Paystack, Supabase).
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL — canonical site URL (Vercel: https://www.benizergreenshop.com)
 * 2. PRODUCTION_CANONICAL_HOST — optional (Vercel Production only), when NEXT_PUBLIC_APP_URL is unset
 * 3. VERCEL_PROJECT_PRODUCTION_URL — on Vercel Production only; if *.vercel.app, we fall back to www.benizergreenshop.com for metadata/payments
 * 4. NEXT_PUBLIC_SITE_URL — local dev; on Vercel, ignored if it still points to localhost
 * 5. VERCEL_URL — automatic on Vercel (preview/production deployment host)
 * 6. localhost for development
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

  // Vercel exposes VERCEL_PROJECT_PRODUCTION_URL as *.vercel.app; metadataBase must use the
  // public custom domain or tab favicons and OG URLs point at the wrong host.
  const canonicalHost = process.env.PRODUCTION_CANONICAL_HOST?.trim();
  if (
    process.env.VERCEL_ENV === "production" &&
    canonicalHost &&
    !isLocalhostish(canonicalHost)
  ) {
    return stripTrailingSlash(
      canonicalHost.startsWith("http") ? canonicalHost : `https://${canonicalHost}`,
    );
  }

  if (process.env.VERCEL_ENV === "production") {
    const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (production) {
      const u = withHttpsIfNeeded(production);
      try {
        if (/\.vercel\.app$/i.test(new URL(u).hostname)) {
          return "https://www.benizergreenshop.com";
        }
      } catch {
        /* ignore */
      }
      return u;
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
