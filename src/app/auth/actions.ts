"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/request-origin";

function isSafeRelativePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/auth/");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const nextRaw = String(formData.get("next") || "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const params = new URLSearchParams({
      error: error.message,
      ...(nextRaw ? { next: nextRaw } : {}),
    });
    redirect(`/auth/sign-in?${params.toString()}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in?error=Session+could+not+be+created.");
  }

  if (nextRaw && nextRaw !== "/" && isSafeRelativePath(nextRaw)) {
    redirect(nextRaw);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || "customer";

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "distributor") {
    const { data: distributor } = await supabase
      .from("distributors")
      .select("approved")
      .eq("user_id", user.id)
      .maybeSingle();

    if (distributor?.approved) {
      redirect("/distributor");
    }
    redirect("/become-distributor");
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!email) {
    redirect("/auth/forgot-password?error=missing_email");
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });
  if (error) {
    console.error("[auth] resetPasswordForEmail:", error.message);
  }

  redirect("/auth/forgot-password?sent=1");
}
