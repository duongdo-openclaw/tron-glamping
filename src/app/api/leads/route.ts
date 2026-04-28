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
  const voucher_code = body.voucher_code ? String(body.voucher_code).trim().toUpperCase() : null;
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

  function makeCustomerCode() {
    const d = new Date();
    const y = d.getFullYear().toString().slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `KH${y}${m}${day}${rnd}`;
  }

  let customer_code = makeCustomerCode();

  // Reuse the same customer code for returning customers by phone.
  const { data: oldByPhone, error: oldByPhoneError } = await supabase
    .from("lead_requests")
    .select("customer_code")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!oldByPhoneError && oldByPhone?.customer_code) {
    customer_code = String(oldByPhone.customer_code);
  }

  let voucher_valid: boolean | null = null;
  let voucher_discount_amount = 0;

  if (voucher_code) {
    const { data: voucherRow, error: voucherErr } = await supabase
      .from("vouchers")
      .select("id,code,is_active,discount_type,discount_value,starts_at,ends_at,max_total_uses,max_uses_per_phone")
      .eq("code", voucher_code)
      .maybeSingle();

    if (!voucherErr && voucherRow?.is_active) {
      const now = Date.now();
      const startOk = !voucherRow.starts_at || new Date(voucherRow.starts_at).getTime() <= now;
      const endOk = !voucherRow.ends_at || new Date(voucherRow.ends_at).getTime() >= now;

      let totalUsed = 0;
      let phoneUsed = 0;

      const { count: c1 } = await supabase
        .from("voucher_redemptions")
        .select("id", { count: "exact", head: true })
        .eq("voucher_id", voucherRow.id);
      totalUsed = c1 || 0;

      const { count: c2 } = await supabase
        .from("voucher_redemptions")
        .select("id", { count: "exact", head: true })
        .eq("voucher_id", voucherRow.id)
        .eq("phone", phone);
      phoneUsed = c2 || 0;

      const totalOk = !voucherRow.max_total_uses || totalUsed < voucherRow.max_total_uses;
      const phoneOk = !voucherRow.max_uses_per_phone || phoneUsed < voucherRow.max_uses_per_phone;

      voucher_valid = Boolean(startOk && endOk && totalOk && phoneOk);
      if (voucher_valid) {
        if (voucherRow.discount_type === "percent") {
          voucher_discount_amount = Math.max(0, Math.min(100, Number(voucherRow.discount_value || 0)));
        } else {
          voucher_discount_amount = Math.max(0, Number(voucherRow.discount_value || 0));
        }
      }
    } else {
      voucher_valid = false;
    }
  }

  let { data: insertedLead, error } = await supabase
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
      customer_code,
      customer_status: "new",
      source: "website",
      voucher_code,
      voucher_valid,
      voucher_discount_amount,
    })
    .select("id")
    .maybeSingle();

  // Backward compatibility if DB not migrated yet (no customer_code column)
  if (error && /customer_code/i.test(error.message || "")) {
    const retry = await supabase
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
      })
      .select("id")
      .maybeSingle();
    insertedLead = retry.data as any;
    error = retry.error;
    if (!error) {
      customer_code = "";
    }
  }

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  if (voucher_code && voucher_valid && insertedLead?.id) {
    const { data: v } = await supabase
      .from("vouchers")
      .select("id")
      .eq("code", voucher_code)
      .maybeSingle();

    if (v?.id) {
      await supabase.from("voucher_redemptions").insert({
        voucher_id: v.id,
        voucher_code_snapshot: voucher_code,
        phone,
        lead_request_id: insertedLead.id,
        discount_amount: voucher_discount_amount,
        metadata: { source: "website_lead" },
      });
    }
  }

  return NextResponse.json({ ok: true, customer_code, voucher_code, voucher_valid, voucher_discount_amount });
}
