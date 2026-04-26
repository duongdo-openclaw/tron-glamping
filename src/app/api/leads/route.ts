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
  const email = body.email ? String(body.email).trim() : null;
  const guest_count_adults = Number(body.guest_count_adults ?? 1) || 1;
  const guest_count_children = Number(body.guest_count_children ?? 0) || 0;
  const message = body.message ? String(body.message).trim() : null;
  const selected_menu_items = Array.isArray(body.selected_menu_items)
    ? body.selected_menu_items
        .map((x: any) => ({
          id: String(x?.id ?? ""),
          name: String(x?.name ?? ""),
          category: String(x?.category ?? ""),
          price: Number(x?.price ?? 0) || 0,
          qty: Math.max(1, Number(x?.qty ?? 1) || 1),
        }))
        .filter((x: any) => x.id && x.name)
    : [];

  if (!full_name || !phone) {
    return NextResponse.json(
      { ok: false, error: "full_name and phone are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("lead_requests")
    .insert({
      full_name,
      phone,
      requested_room_type,
      check_in_date,
      check_out_date,
      email,
      guest_count_adults,
      guest_count_children,
      selected_menu_items,
      message,
      customer_status: "new",
      source: "website",
    });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
