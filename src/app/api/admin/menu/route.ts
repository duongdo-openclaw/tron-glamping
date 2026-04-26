import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  await requireAdminApi();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,category,name,description,price,image_url,serving_period,is_active,sort_order")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: data ?? [] });
}

export async function POST(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.category) {
    return NextResponse.json({ ok: false, error: "Missing name/category" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("menu_items").insert({
    category: body.category,
    name: body.name,
    description: body.description ?? null,
    price: Number(body.price ?? 0),
    image_url: body.image_url ?? null,
    is_active: body.is_active ?? true,
    serving_period: body.serving_period ?? "main",
    sort_order: Number(body.sort_order ?? 0),
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const { id, ...patch } = body;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("menu_items").update(patch).eq("id", id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
