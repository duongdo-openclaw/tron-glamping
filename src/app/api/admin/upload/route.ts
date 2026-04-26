import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const BUCKET = "public-assets";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  await requireAdminApi();

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false, error: "Invalid form" }, { status: 400 });

  const file = form.get("file");
  const folder = String(form.get("folder") || "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Best-effort ensure bucket exists
  const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (bucketErr && !/already exists/i.test(bucketErr.message)) {
    // continue; bucket may still be usable
  }

  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Ảnh sau nén vượt quá 6MB" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const base = safeName((file.name || "file").replace(/\.[^.]+$/, "")) || "file";
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}-${base}.${ext}`;
  const path = `${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl, path });
}
