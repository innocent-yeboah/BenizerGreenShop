import { cache } from "react";
import { isExpectedUnauthenticatedError } from "@/lib/supabase/expected-auth-error";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const getCurrentUserWithRole = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: sessionErr,
    } = await supabase.auth.getUser();

    if (sessionErr) {
      if (!isExpectedUnauthenticatedError(sessionErr.message)) {
        console.error("[auth] getUser:", sessionErr.message);
      }
      return null;
    }

    if (!user) return null;

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role,full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr) {
      console.error("[auth] profiles:", profileErr.message);
    }

    return {
      user,
      role: profile?.role || "customer",
      fullName: profile?.full_name || "",
    };
  } catch (e) {
    const err = e as { message?: string; digest?: string };
    const msg = err?.message ?? String(e);
    if (
      err?.digest === "DYNAMIC_SERVER_USAGE" ||
      msg.includes("Dynamic server usage") ||
      msg.includes("`cookies`")
    ) {
      return null;
    }
    console.error("[auth] getCurrentUserWithRole:", e);
    return null;
  }
});
