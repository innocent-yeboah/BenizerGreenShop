"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

async function requireAdmin() {
  const ctx = await getCurrentUserWithRole();
  if (!ctx || ctx.role !== "admin") {
    return null;
  }
  return ctx;
}

export async function updateAdminFullNameAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Unauthorized." };

  const fullName = String(formData.get("fullName") || "").trim();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", ctx.user.id);

  if (error) return { error: error.message };
  revalidatePath("/admin/profile");
  return { ok: true, message: "Display name saved." };
}

export async function updateAdminEmailAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Unauthorized." };

  const newEmail = String(formData.get("email") || "").trim().toLowerCase();
  if (!newEmail || !newEmail.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) return { error: error.message };
  revalidatePath("/admin/profile");
  return {
    ok: true,
    message:
      "Email update requested. Check your inbox to confirm the new address if your project requires email confirmation.",
  };
}

export async function updateAdminPasswordAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Unauthorized." };

  const current = String(formData.get("currentPassword") || "");
  const next = String(formData.get("newPassword") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (next.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (next !== confirm) {
    return { error: "New password and confirmation do not match." };
  }

  const email = ctx.user.email;
  if (!email) return { error: "No email on this account." };

  const supabase = await createClient();
  const { error: signErr } = await supabase.auth.signInWithPassword({
    email,
    password: current,
  });
  if (signErr) {
    return { error: "Current password is incorrect." };
  }

  const { error: upErr } = await supabase.auth.updateUser({ password: next });
  if (upErr) return { error: upErr.message };

  revalidatePath("/admin/profile");
  return { ok: true, message: "Password updated." };
}
