/**
 * `supabase.auth.getUser()` can return an error when there is simply no session
 * (anonymous visitor). That is not a server failure and should not be `console.error`.
 */
export function isExpectedUnauthenticatedError(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return m.includes("auth session missing") || m.includes("session missing");
}
