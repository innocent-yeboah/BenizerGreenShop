import type { CookieMethodsServer } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/distributor")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet, headersToSet) {
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options),
      );
      Object.entries(headersToSet).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    },
  };

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: cookieMethods,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const query = new URLSearchParams({ next: pathname }).toString();

  if ((pathname.startsWith("/admin") || pathname.startsWith("/distributor")) && !user) {
    return NextResponse.redirect(new URL(`/auth/sign-in?${query}`, request.url));
  }

  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user!.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/distributor")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user!.id)
      .maybeSingle();

    if (profile?.role !== "distributor" && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/become-distributor", request.url));
    }

    const { data: distributor } = await supabase
      .from("distributors")
      .select("approved")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!distributor?.approved && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/become-distributor", request.url));
    }
  }

  if (pathname.startsWith("/auth/sign-in") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role || "customer";

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "distributor") {
      const { data: distributor } = await supabase
        .from("distributors")
        .select("approved")
        .eq("user_id", user.id)
        .maybeSingle();

      if (distributor?.approved) {
        return NextResponse.redirect(new URL("/distributor", request.url));
      }
      return NextResponse.redirect(new URL("/become-distributor", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/distributor/:path*", "/auth/sign-in"],
};
