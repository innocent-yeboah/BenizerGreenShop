import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin client not configured." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .select("created_at,name,email,phone,type,product_interest,status")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "created_at",
    "name",
    "email",
    "phone",
    "type",
    "product_interest",
    "status",
  ];
  const rows = (data || []).map((lead) =>
    [
      lead.created_at,
      lead.name,
      lead.email,
      lead.phone,
      lead.type,
      lead.product_interest || "",
      lead.status,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=benizer-leads.csv",
    },
  });
}
