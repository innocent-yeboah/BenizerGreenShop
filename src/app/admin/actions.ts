"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function requireAdminClient() {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase service role is not configured");
  return supabase;
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "pending");
  const supabase = requireAdminClient();

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
}

export async function updateLeadStatusAction(formData: FormData) {
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
  const distributorId = String(formData.get("distributorId") || "");
  const approved = String(formData.get("approved") || "false") === "true";
  const supabase = requireAdminClient();

  await supabase.from("distributors").update({ approved }).eq("id", distributorId);
  revalidatePath("/admin/distributors");
}

export async function upsertProductAction(formData: FormData) {
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
