import type { CookieMethodsServer } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and restart the dev server.",
    );
  }

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet, _headersToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      } catch {
        // Called from a Server Component / route that cannot mutate cookies.
        // Session refresh should be handled in middleware instead.
      }
      // Cache-Control headers accompany auth cookie writes; middleware applies them on the edge.
      void _headersToSet;
    },
  };

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
  });
}
