import { NextResponse } from "next/server";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

export async function GET(req: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ ok: false, error: "Missing Supabase env" }, { status: 500 });
  }

  const url = new URL(req.url);
  const code = (url.searchParams.get("code") || "").trim();
  if (!code) {
    return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_requests")
    .select("customer_code,full_name,phone,requested_room_type,check_in_date,check_out_date,customer_status,created_at")
    .eq("customer_code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "Không tìm thấy mã" }, { status: 404 });

  return NextResponse.json({ ok: true, result: data });
}
