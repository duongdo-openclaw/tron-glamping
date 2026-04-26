import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  await requireAdminApi();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("room_types")
    .select("id,code,name,description,capacity_adults,capacity_children,base_price,hero_image_url,sort_order,is_active")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, room_types: data ?? [] });
}

export async function PATCH(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { id, ...patch } = body;

  const { error } = await supabase.from("room_types").update(patch).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
