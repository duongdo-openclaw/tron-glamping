import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  await requireAdminApi();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("vouchers")
    .select("id,code,name,description,is_active,discount_type,discount_value,starts_at,ends_at,max_total_uses,max_uses_per_phone,min_order_amount,stackable,applies_to_room_day,applies_to_room_overnight,applies_to_extra_hour,applies_to_menu,allowed_room_type_codes,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vouchers: data ?? [] });
}

export async function POST(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.code) return NextResponse.json({ ok: false, error: "Missing code" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const payload = {
    code: String(body.code).trim().toUpperCase(),
    name: String(body.name || body.code).trim(),
    description: body.description || null,
    is_active: body.is_active ?? true,
    discount_type: body.discount_type || "fixed_amount",
    discount_value: Number(body.discount_value || 0),
    starts_at: body.starts_at || null,
    ends_at: body.ends_at || null,
    max_total_uses: body.max_total_uses ? Number(body.max_total_uses) : null,
    max_uses_per_phone: body.max_uses_per_phone ? Number(body.max_uses_per_phone) : null,
    min_order_amount: Number(body.min_order_amount || 0),
    stackable: body.stackable ?? false,
    applies_to_room_day: body.applies_to_room_day ?? true,
    applies_to_room_overnight: body.applies_to_room_overnight ?? true,
    applies_to_extra_hour: body.applies_to_extra_hour ?? true,
    applies_to_menu: body.applies_to_menu ?? false,
    allowed_room_type_codes: Array.isArray(body.allowed_room_type_codes) ? body.allowed_room_type_codes : [],
  };

  const { error } = await supabase.from("vouchers").insert(payload);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { id, ...patch } = body;
  if (patch.code) patch.code = String(patch.code).trim().toUpperCase();
  if (patch.discount_value !== undefined) patch.discount_value = Number(patch.discount_value || 0);
  if (patch.min_order_amount !== undefined) patch.min_order_amount = Number(patch.min_order_amount || 0);
  if (patch.max_total_uses === "") patch.max_total_uses = null;
  if (patch.max_uses_per_phone === "") patch.max_uses_per_phone = null;

  const { error } = await supabase.from("vouchers").update(patch).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
