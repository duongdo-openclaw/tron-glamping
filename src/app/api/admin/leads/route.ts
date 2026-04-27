import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  await requireAdminApi();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("lead_requests")
    .select("id,customer_code,full_name,phone,email,guest_count_adults,guest_count_children,requested_room_type,check_in_date,check_out_date,selected_menu_items,customer_status,message,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, leads: data ?? [] });
}

export async function PATCH(req: Request) {
  await requireAdminApi();
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const patch: Record<string, any> = {};
  if (typeof body.customer_status === "string") patch.customer_status = body.customer_status;
  if (typeof body.message === "string") patch.message = body.message;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("lead_requests").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
