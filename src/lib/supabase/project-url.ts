/**
 * Normalizes the Supabase **project URL** from env (Dashboard → Settings → API → Project URL).
 * Fixes common copy/paste mistakes that break auth requests (e.g. "Invalid path specified in request URL").
 */
export function normalizeSupabaseProjectUrl(raw: string): string {
  let u = raw.trim().replace(/\s+/g, "");
  u = u.replace(/\/+$/, "");
  const suffixes = ["/auth/v1", "/rest/v1", "/storage/v1", "/realtime/v1", "/functions/v1"];
  for (const suffix of suffixes) {
    if (u.toLowerCase().endsWith(suffix)) {
      u = u.slice(0, -suffix.length).replace(/\/+$/, "");
      break;
    }
  }
  return u;
}
