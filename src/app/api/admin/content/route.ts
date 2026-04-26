import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

export async function GET() {
  await requireAdminApi();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key,value")
    .eq("key", "site_content")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, content: { ...defaultSiteContent, ...(data?.value ?? {}) } });
}

export async function POST(req: Request) {
  await requireAdminApi();

  const body = (await req.json().catch(() => null)) as SiteContent | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "site_content", value: body }, { onConflict: "key" });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
