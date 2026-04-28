/**
 * Creates or updates the default admin user and sets public.profiles.role = 'admin'.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/seed-default-admin.mjs
 *
 * Env (optional overrides):
 *   DEFAULT_ADMIN_EMAIL    default: admin@benizergreenshop.com
 *   DEFAULT_ADMIN_PASSWORD default: ChangeMeAdmin123!
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email =
  process.env.DEFAULT_ADMIN_EMAIL || "admin@benizergreenshop.com";
const password =
  process.env.DEFAULT_ADMIN_PASSWORD || "ChangeMeAdmin123!";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: listData, error: listError } =
  await admin.auth.admin.listUsers({ page: 1, perPage: 200 });

if (listError) {
  console.error("listUsers:", listError.message);
  process.exit(1);
}

const existing = listData.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase(),
);

let userId;

if (existing) {
  const { error: upErr } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (upErr) {
    console.error("updateUserById:", upErr.message);
    process.exit(1);
  }
  userId = existing.id;
  console.log("Updated password and email confirmation for existing user:", email);
} else {
  const { data, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Site Administrator" },
  });
  if (createErr) {
    console.error("createUser:", createErr.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log("Created admin user:", email);
}

const { error: profErr } = await admin.from("profiles").upsert(
  {
    id: userId,
    full_name: "Site Administrator",
    role: "admin",
  },
  { onConflict: "id" },
);

if (profErr) {
  console.error("profiles upsert:", profErr.message);
  process.exit(1);
}

console.log("profiles.role set to admin for user id:", userId);
console.log("\nDefault sign-in (change after first login via Admin → Profile):");
console.log("  Email:   ", email);
console.log("  Password:", password);
