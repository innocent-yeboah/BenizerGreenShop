"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReferralCode, normalizeReferralCode } from "@/lib/distributor-account";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }
}

function requireAdminClient() {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase service role is not configured");
  return supabase;
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "pending");
  const supabase = requireAdminClient();

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
}

export async function updateLeadStatusAction(formData: FormData) {
  await assertAdmin();
  const leadId = String(formData.get("leadId") || "");
  const status = String(formData.get("status") || "new");
  const supabase = requireAdminClient();

  await supabase
    .from("leads")
    .update({
      status,
      contacted_at: status === "contacted" ? new Date().toISOString() : null,
    })
    .eq("id", leadId);

  revalidatePath("/admin/leads");
}

export async function approveDistributorAction(formData: FormData) {
  await assertAdmin();
  const distributorId = String(formData.get("distributorId") || "");
  const approved = String(formData.get("approved") || "false") === "true";
  const supabase = requireAdminClient();

  await supabase.from("distributors").update({ approved }).eq("id", distributorId);
  revalidatePath("/admin/distributors");
}

export async function upsertProductAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const slug = String(formData.get("slug") || "");
  const title = String(formData.get("title") || "");
  const tagline = String(formData.get("tagline") || "");
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const featured = String(formData.get("featured") || "false") === "true";

  const supabase = requireAdminClient();
  const payload = { slug, title, tagline, category, price, stock, featured };

  if (id) {
    await supabase.from("products").update(payload).eq("id", id);
  } else {
    await supabase.from("products").insert({
      ...payload,
      ingredients: [],
      benefits: [],
      usage: "See label",
      images: [],
      active: true,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

/**
 * Creates Auth credentials + profile (distributor) + distributors row so the partner can sign in.
 */
export async function createDistributorAccountAction(formData: FormData) {
  await assertAdmin();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const referralRaw = String(formData.get("referralCode") || "").trim();
  const leadId = String(formData.get("leadId") || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/admin/distributors?error=" + encodeURIComponent("Enter a valid email address."));
  }

  if (password.length < 8) {
    redirect("/admin/distributors?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const admin = createAdminClient();
  if (!admin) {
    redirect(
      "/admin/distributors?error=" +
        encodeURIComponent("SUPABASE_SERVICE_ROLE_KEY must be set on the server to create accounts."),
    );
  }

  let referralCode = "";

  if (referralRaw) {
    referralCode = normalizeReferralCode(referralRaw);
    if (referralCode.length < 4) {
      redirect(
        "/admin/distributors?error=" +
          encodeURIComponent("Referral code must be at least 4 letters or numbers."),
      );
    }
    const { data: taken } = await admin.from("distributors").select("id").eq("referral_code", referralCode).maybeSingle();
    if (taken) {
      redirect("/admin/distributors?error=" + encodeURIComponent("That referral code is already in use."));
    }
  } else {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidate = generateReferralCode();
      const { data: collision } = await admin.from("distributors").select("id").eq("referral_code", candidate).maybeSingle();
      if (!collision) {
        referralCode = candidate;
        break;
      }
    }
    if (!referralCode) {
      redirect(
        "/admin/distributors?error=" +
          encodeURIComponent("Could not allocate a unique referral code — try again or enter a custom code."),
      );
    }
  }

  let userId: string | null = null;

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (authErr || !authData.user) {
    const msg =
      authErr?.message?.includes("already") || authErr?.status === 422
        ? "That email is already registered. Use a different email or reset password from Sign-in."
        : authErr?.message || "Could not create sign-in credentials.";
    redirect("/admin/distributors?error=" + encodeURIComponent(msg));
  }

  userId = authData.user.id;

  const { error: profileErr } = await admin.from("profiles").insert({
    id: userId,
    full_name: fullName || null,
    role: "distributor",
  });

  if (profileErr) {
    await admin.auth.admin.deleteUser(userId);
    redirect("/admin/distributors?error=" + encodeURIComponent(profileErr.message));
  }

  const { error: distErr } = await admin.from("distributors").insert({
    user_id: userId,
    referral_code: referralCode,
    approved: true,
    total_sales: 0,
    commission_earned: 0,
  });

  if (distErr) {
    await admin.auth.admin.deleteUser(userId);
    redirect("/admin/distributors?error=" + encodeURIComponent(distErr.message));
  }

  if (leadId) {
    await admin
      .from("leads")
      .update({
        status: "converted_distributor",
        contacted_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .eq("type", "distributor");
    revalidatePath("/admin/leads");
  }

  revalidatePath("/admin/distributors");
  redirect("/admin/distributors?created=1");
}
