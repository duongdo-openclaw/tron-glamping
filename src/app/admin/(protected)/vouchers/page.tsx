"use client";

import { useEffect, useState } from "react";

type Voucher = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  discount_type: "fixed_amount" | "percent";
  discount_value: number;
  starts_at: string | null;
  ends_at: string | null;
  max_total_uses: number | null;
  max_uses_per_phone: number | null;
  min_order_amount: number;
  applies_to_room_day: boolean;
  applies_to_room_overnight: boolean;
  applies_to_extra_hour: boolean;
  applies_to_menu: boolean;
};

const emptyCreate = {
  code: "",
  name: "",
  description: "",
  is_active: true,
  discount_type: "fixed_amount",
  discount_value: 0,
  max_total_uses: "",
  max_uses_per_phone: "",
  min_order_amount: 0,
};

export default function AdminVouchersPage() {
  const [rows, setRows] = useState<Voucher[]>([]);
  const [creating, setCreating] = useState<any>(emptyCreate);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/vouchers", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) setRows(json.vouchers || []);
  }

  useEffect(() => { void load(); }, []);

  async function createVoucher() {
    setMsg(null);
    const res = await fetch("/api/admin/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creating),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) return setMsg(json?.error || "Tạo voucher thất bại");
    setCreating(emptyCreate);
    setMsg("Đã tạo voucher");
    await load();
  }

  async function saveRow(row: Voucher) {
    setMsg(null);
    const res = await fetch("/api/admin/vouchers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) return setMsg(json?.error || "Lưu thất bại");
    setMsg(`Đã lưu ${row.code}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold">Vouchers</h1>
      {msg && <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</div>}

      <section className="mt-5 rounded-3xl border border-[#e7dece] bg-white p-5">
        <div className="text-lg font-semibold">Tạo mã mới</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="Code" value={creating.code} onChange={(v) => setCreating((p: any) => ({ ...p, code: v }))} />
          <Field label="Tên" value={creating.name} onChange={(v) => setCreating((p: any) => ({ ...p, name: v }))} />
          <Field label="Giảm" value={String(creating.discount_value)} onChange={(v) => setCreating((p: any) => ({ ...p, discount_value: Number(v || 0) }))} />
          <label className="grid gap-2"><span className="text-sm text-slate-600">Loại giảm</span><select className="h-11 rounded-2xl border border-slate-300 px-4 text-sm" value={creating.discount_type} onChange={(e) => setCreating((p: any) => ({ ...p, discount_type: e.target.value }))}><option value="fixed_amount">Số tiền</option><option value="percent">Phần trăm (%)</option></select></label>
          <Field label="Giới hạn tổng lượt" value={String(creating.max_total_uses)} onChange={(v) => setCreating((p: any) => ({ ...p, max_total_uses: v }))} />
          <Field label="Giới hạn/phone" value={String(creating.max_uses_per_phone)} onChange={(v) => setCreating((p: any) => ({ ...p, max_uses_per_phone: v }))} />
        </div>
        <button onClick={() => void createVoucher()} className="mt-4 rounded-full bg-[#4b5a44] px-5 py-2 text-sm font-semibold text-white">Tạo voucher</button>
      </section>

      <section className="mt-6 grid gap-4">
        {rows.map((r, idx) => (
          <div key={r.id} className="rounded-3xl border border-[#e7dece] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">{r.code}</div>
              <button onClick={() => void saveRow(r)} className="rounded-full bg-[#4b5a44] px-4 py-1.5 text-sm font-semibold text-white">Lưu</button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Code" value={r.code} onChange={(v) => setRows((p) => patch(p, idx, { code: v }))} />
              <Field label="Tên" value={r.name} onChange={(v) => setRows((p) => patch(p, idx, { name: v }))} />
              <Field label="Giảm" value={String(r.discount_value)} onChange={(v) => setRows((p) => patch(p, idx, { discount_value: Number(v || 0) }))} />
              <label className="grid gap-2"><span className="text-sm text-slate-600">Loại giảm</span><select className="h-11 rounded-2xl border border-slate-300 px-4 text-sm" value={r.discount_type} onChange={(e) => setRows((p) => patch(p, idx, { discount_type: e.target.value as any }))}><option value="fixed_amount">Số tiền</option><option value="percent">Phần trăm (%)</option></select></label>
              <Field label="Giới hạn tổng" value={String(r.max_total_uses ?? "")} onChange={(v) => setRows((p) => patch(p, idx, { max_total_uses: v ? Number(v) : null }))} />
              <Field label="Giới hạn/phone" value={String(r.max_uses_per_phone ?? "")} onChange={(v) => setRows((p) => patch(p, idx, { max_uses_per_phone: v ? Number(v) : null }))} />
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-4 text-sm">
              <label><input type="checkbox" checked={r.is_active} onChange={(e) => setRows((p) => patch(p, idx, { is_active: e.target.checked }))} /> Active</label>
              <label><input type="checkbox" checked={r.applies_to_room_day} onChange={(e) => setRows((p) => patch(p, idx, { applies_to_room_day: e.target.checked }))} /> Room day</label>
              <label><input type="checkbox" checked={r.applies_to_room_overnight} onChange={(e) => setRows((p) => patch(p, idx, { applies_to_room_overnight: e.target.checked }))} /> Room overnight</label>
              <label><input type="checkbox" checked={r.applies_to_extra_hour} onChange={(e) => setRows((p) => patch(p, idx, { applies_to_extra_hour: e.target.checked }))} /> Extra hour</label>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function patch(rows: Voucher[], idx: number, update: Partial<Voucher>) {
  const c = [...rows];
  c[idx] = { ...c[idx], ...update };
  return c;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-2xl border border-slate-300 px-4 text-sm" />
    </label>
  );
}
