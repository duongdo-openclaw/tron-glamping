"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "./UploadButton";

type RoomType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  capacity_adults: number;
  capacity_children: number;
  base_price: number;
  hero_image_url: string | null;
  gallery_images?: string[];
  sort_order: number;
  is_active: boolean;
};

export default function AdminRoomTypesPage() {
  const [rows, setRows] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const t0 = Date.now();
    const res = await fetch("/api/admin/room-types", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) setRows(json.room_types || []);
    const took = Date.now() - t0;
    if (took > 1200) setMsg(`Load phòng hơi chậm (${took}ms). Em sẽ tối ưu thêm phase hardening.`);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveRow(row: RoomType) {
    setMsg(null);
    const res = await fetch("/api/admin/room-types", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) setMsg(json?.error || "Lưu thất bại");
    else setMsg(`Đã lưu ${row.code}`);
  }

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">Đang tải...</main>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold">Room types</h1>
      {msg && <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</div>}

      <div className="mt-6 grid gap-4">
        {rows.map((row, idx) => (
          <div key={row.id} className="rounded-3xl border border-[#e7dece] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">{row.code}</div>
              <button
                onClick={() => void saveRow(row)}
                className="rounded-full bg-[#4b5a44] px-4 py-1.5 text-sm font-semibold text-white"
              >
                Lưu
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Tên" value={row.name} onChange={(v) => setRows((prev) => patch(prev, idx, { name: v }))} />
              <Field
                label="Giá base"
                value={String(row.base_price ?? 0)}
                onChange={(v) => setRows((prev) => patch(prev, idx, { base_price: Number(v || 0) }))}
              />
              <Field
                label="Sức chứa người lớn"
                value={String(row.capacity_adults ?? 0)}
                onChange={(v) => setRows((prev) => patch(prev, idx, { capacity_adults: Number(v || 0) }))}
              />
              <Field
                label="Sức chứa trẻ em"
                value={String(row.capacity_children ?? 0)}
                onChange={(v) => setRows((prev) => patch(prev, idx, { capacity_children: Number(v || 0) }))}
              />
              <Field
                label="Sort"
                value={String(row.sort_order ?? 0)}
                onChange={(v) => setRows((prev) => patch(prev, idx, { sort_order: Number(v || 0) }))}
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={row.is_active}
                  onChange={(e) => setRows((prev) => patch(prev, idx, { is_active: e.target.checked }))}
                />
                Active
              </label>
            </div>

            <label className="mt-3 grid gap-2">
              <span className="text-sm text-slate-600">Mô tả</span>
              <textarea
                rows={2}
                value={row.description || ""}
                onChange={(e) => setRows((prev) => patch(prev, idx, { description: e.target.value }))}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              />
            </label>

            <div className="mt-3 grid gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Ảnh đại diện</div>
                  <div className="text-xs text-slate-500">Có thể nhập link hoặc upload trực tiếp</div>
                </div>
                <UploadButton label="Upload ảnh đại diện" folder={`room-types/${row.code.toLowerCase()}`} onUploaded={(url) => setRows((prev) => patch(prev, idx, { hero_image_url: url }))} />
              </div>
              <Field
                label="Ảnh đại diện"
                value={row.hero_image_url || ""}
                onChange={(v) => setRows((prev) => patch(prev, idx, { hero_image_url: v }))}
              />
            </div>

            <div className="mt-3 grid gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Gallery (tối đa 3 ảnh)</div>
                  <div className="text-xs text-slate-500">Mỗi lều nên có 3 ảnh</div>
                </div>
                <UploadButton
                  label="Upload ảnh gallery"
                  folder={`room-types/${row.code.toLowerCase()}`}
                  onUploaded={(url) => {
                    const current = Array.isArray(row.gallery_images) ? row.gallery_images : [];
                    if (current.length >= 3) return;
                    setRows((prev) => patch(prev, idx, { gallery_images: [...current, url] }));
                  }}
                />
              </div>
              {[0, 1, 2].map((imageIdx) => (
                <div key={imageIdx} className="flex items-center gap-2">
                  <div className="min-w-14 text-xs text-slate-500">Ảnh {imageIdx + 1}</div>
                  <input
                    value={row.gallery_images?.[imageIdx] || ""}
                    onChange={(e) => {
                      const next = [...(row.gallery_images || [])];
                      next[imageIdx] = e.target.value;
                      setRows((prev) => patch(prev, idx, { gallery_images: next.filter((x) => x !== undefined) }));
                    }}
                    className="h-11 flex-1 rounded-2xl border border-slate-300 px-4 text-sm"
                    placeholder={`URL ảnh ${imageIdx + 1}`}
                  />
                  {row.gallery_images?.[imageIdx] ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(row.gallery_images || [])];
                        next.splice(imageIdx, 1);
                        setRows((prev) => patch(prev, idx, { gallery_images: next }));
                      }}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600"
                    >
                      Xoá
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function patch(rows: RoomType[], idx: number, update: Partial<RoomType>) {
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
