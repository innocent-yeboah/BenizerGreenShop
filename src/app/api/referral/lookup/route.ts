import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeReferralCode } from "@/lib/distributor-account";

export async function GET(request: Request) {
  const code = normalizeReferralCode(new URL(request.url).searchParams.get("code") || "");
  if (code.length < 4) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }

  const { data: distributor } = await supabase
    .from("distributors")
    .select("user_id")
    .eq("referral_code", code)
    .eq("approved", true)
    .maybeSingle();

  if (!distributor?.user_id) {
    return NextResponse.json({ ok: true, found: false });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", distributor.user_id)
    .maybeSingle();

  const fullName = (profile?.full_name ?? "").trim();
  const displayName = fullName || "your distributor partner";

  return NextResponse.json({
    ok: true,
    found: true,
    code,
    displayName,
  });
}
