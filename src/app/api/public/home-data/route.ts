import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { defaultSiteContent } from "@/lib/site-content";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const [{ data: contentRow }, { data: roomTypes }] = await Promise.all([
      supabase.from("site_content").select("value").eq("key", "site_content").maybeSingle(),
      supabase
        .from("room_types")
        .select("code,name,description,capacity_adults,capacity_children,base_price,hero_image_url,sort_order,is_active")
        .order("sort_order", { ascending: true }),
    ]);

    return NextResponse.json({
      ok: true,
      content: { ...defaultSiteContent, ...(contentRow?.value ?? {}) },
      room_types: (roomTypes ?? []).filter((r: any) => r.is_active !== false),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
