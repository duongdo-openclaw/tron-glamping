import { NextResponse } from "next/server";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase env" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const full_name = String(body.full_name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const requested_room_type = body.requested_room_type ? String(body.requested_room_type).trim() : null;
  const check_in_date = body.check_in_date ? String(body.check_in_date) : null;
  const check_out_date = body.check_out_date ? String(body.check_out_date) : null;
  const message = body.message ? String(body.message).trim() : null;

  if (!full_name || !phone) {
    return NextResponse.json(
      { ok: false, error: "full_name and phone are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_requests")
    .insert({
      full_name,
      phone,
      requested_room_type,
      check_in_date,
      check_out_date,
      message,
      source: "website",
    })
    .select("id,created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, lead: data });
}
