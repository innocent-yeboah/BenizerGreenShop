import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const getCurrentUserWithRole = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    role: profile?.role || "customer",
    fullName: profile?.full_name || "",
  };
});
