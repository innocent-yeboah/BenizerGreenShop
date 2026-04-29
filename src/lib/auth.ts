import { cache } from "react";
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
      console.error("[auth] getUser:", sessionErr.message);
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
    console.error("[auth] getCurrentUserWithRole:", e);
    return null;
  }
});
