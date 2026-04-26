"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "./UploadButton";

type MenuItem = {
  id: string;
  category: "food" | "drink" | "combo";
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  serving_period: "breakfast" | "main";
  sort_order: number;
  is_active: boolean;
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/menu", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) setItems(json.items || []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(item: MenuItem) {
    setMsg(null);
    const res = await fetch("/api/admin/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) setMsg(json?.error || "Lưu thất bại");
    else setMsg(`Đã lưu ${item.name}`);
  }

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">Đang tải...</main>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold">Ẩm thực (đồ ăn / đồ uống / combo)</h1>
      {msg && <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</div>}

      <div className="mt-6 grid gap-4">
        {items.map((item, idx) => (
          <div key={item.id} className="rounded-3xl border border-[#e7dece] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">{item.category.toUpperCase()}</div>
              <button onClick={() => void save(item)} className="rounded-full bg-[#4b5a44] px-4 py-1.5 text-sm font-semibold text-white">Lưu</button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Tên" value={item.name} onChange={(v) => setItems((p) => patch(p, idx, { name: v }))} />
              <Field label="Giá" value={String(item.price)} onChange={(v) => setItems((p) => patch(p, idx, { price: Number(v || 0) }))} />
              <Field label="Sort" value={String(item.sort_order)} onChange={(v) => setItems((p) => patch(p, idx, { sort_order: Number(v || 0) }))} />
              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Bữa</span>
                <select
                  value={item.serving_period || "main"}
                  onChange={(e) => setItems((p) => patch(p, idx, { serving_period: e.target.value as any }))}
                  className="h-11 rounded-2xl border border-slate-300 px-4 text-sm"
                >
                  <option value="breakfast">Bữa sáng</option>
                  <option value="main">Bữa chính</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={item.is_active} onChange={(e) => setItems((p) => patch(p, idx, { is_active: e.target.checked }))} /> Active
              </label>
            </div>

            <label className="mt-3 grid gap-2">
              <span className="text-sm text-slate-600">Mô tả</span>
              <textarea rows={2} value={item.description || ""} onChange={(e) => setItems((p) => patch(p, idx, { description: e.target.value }))} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm" />
            </label>

            <div className="mt-3 flex items-center justify-between gap-3">
              <Field label="Ảnh" value={item.image_url || ""} onChange={(v) => setItems((p) => patch(p, idx, { image_url: v }))} />
              <UploadButton label="Upload ảnh" folder={`menu/${item.category}`} onUploaded={(url) => setItems((p) => patch(p, idx, { image_url: url }))} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function patch(rows: MenuItem[], idx: number, update: Partial<MenuItem>) {
  const clone = [...rows];
  clone[idx] = { ...clone[idx], ...update };
  return clone;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-2xl border border-slate-300 px-4 text-sm" />
    </label>
  );
}
