"use client";

import { useEffect, useMemo, useState } from "react";

type LeadRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  guest_count_adults: number | null;
  guest_count_children: number | null;
  requested_room_type: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  selected_menu_items: Array<{ name: string; category: string; qty: number; price: number }> | null;
  customer_status: string | null;
  message: string | null;
  created_at: string;
};

const statusOptions = ["new", "contacted", "quoted", "confirmed", "cancelled"];

export default function AdminLeadsPage() {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/leads", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok && Array.isArray(json.leads)) {
      setRows(json.leads as LeadRow[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveStatus(id: string, customer_status: string) {
    setMsg(null);
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, customer_status }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      setMsg(json?.error || "Cập nhật thất bại");
      return;
    }
    setMsg("Đã cập nhật lead");
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && (r.customer_status || "new") !== statusFilter) return false;
      if (!q.trim()) return true;
      const t = `${r.full_name} ${r.phone} ${r.email || ""}`.toLowerCase();
      return t.includes(q.trim().toLowerCase());
    });
  }, [rows, q, statusFilter]);

  const summary = useMemo(() => {
    const total = rows.length;
    const by = (s: string) => rows.filter((r) => (r.customer_status || "new") === s).length;
    return {
      total,
      new: by("new"),
      contacted: by("contacted"),
      quoted: by("quoted"),
      confirmed: by("confirmed"),
    };
  }, [rows]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý khách hàng / Leads</h1>
          <div className="text-sm text-slate-500">Theo dõi thông tin cá nhân + phòng + ẩm thực đã chọn</div>
        </div>
        <button onClick={() => void load()} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Làm mới</button>
      </div>

      {msg && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</div>}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Tổng" value={summary.total} />
        <Stat label="Mới" value={summary.new} />
        <Stat label="Đã liên hệ" value={summary.contacted} />
        <Stat label="Đã báo giá" value={summary.quoted} />
        <Stat label="Đã chốt" value={summary.confirmed} />
      </section>

      <section className="mt-6 rounded-3xl border border-[#e7dece] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên / số điện thoại / email"
            className="h-11 rounded-2xl border border-slate-300 px-4 text-sm"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-300 px-4 text-sm">
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm leading-[42px] text-slate-600">
            Hiển thị: <b>{filtered.length}</b> lead
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-[#e7dece] bg-white">
        {loading ? (
          <div className="p-6 text-sm text-slate-600">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#faf7f2] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium">Lưu trú</th>
                  <th className="px-4 py-3 font-medium">Ẩm thực</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-slate-500">Chưa có dữ liệu phù hợp.</td>
                  </tr>
                ) : (
                  filtered.map((l, idx) => {
                    const totalFood = Array.isArray(l.selected_menu_items)
                      ? l.selected_menu_items.reduce((sum, x) => sum + (x.price || 0) * (x.qty || 0), 0)
                      : 0;
                    const status = l.customer_status || "new";
                    return (
                      <tr key={l.id} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{new Date(l.created_at).toLocaleString("vi-VN")}</td>
                        <td className="px-4 py-3 min-w-[220px]">
                          <div className="font-semibold text-slate-800">{l.full_name}</div>
                          <div className="text-xs text-slate-600">{l.phone}</div>
                          <div className="text-xs text-slate-500">{l.email || "—"}</div>
                        </td>
                        <td className="px-4 py-3 min-w-[220px] text-xs text-slate-700">
                          <div>Loại phòng: <b>{l.requested_room_type || "—"}</b></div>
                          <div>Check-in: {l.check_in_date || "—"}</div>
                          <div>Check-out: {l.check_out_date || "—"}</div>
                          <div>Khách: {l.guest_count_adults ?? 1} NL / {l.guest_count_children ?? 0} TE</div>
                        </td>
                        <td className="px-4 py-3 min-w-[260px] text-xs text-slate-700">
                          {Array.isArray(l.selected_menu_items) && l.selected_menu_items.length > 0 ? (
                            <>
                              <div className="space-y-1">
                                {l.selected_menu_items.map((x, i) => (
                                  <div key={i}>{x.name} ({x.category}) ×{x.qty}</div>
                                ))}
                              </div>
                              <div className="mt-2 font-semibold text-[#4b5a44]">Tổng món: {new Intl.NumberFormat("vi-VN").format(totalFood)}đ</div>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={status}
                            onChange={(e) => setRows((prev) => patchLead(prev, idx, { customer_status: e.target.value }))}
                            className="h-10 rounded-xl border border-slate-300 px-3 text-sm"
                          >
                            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button
                            onClick={() => void saveStatus(l.id, (rows[idx]?.customer_status || "new") as string)}
                            className="mt-2 block rounded-full bg-[#4b5a44] px-3 py-1 text-xs font-semibold text-white"
                          >
                            Lưu trạng thái
                          </button>
                        </td>
                        <td className="px-4 py-3 max-w-[320px] text-xs text-slate-700">{l.message || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function patchLead(rows: LeadRow[], idx: number, patch: Partial<LeadRow>) {
  const clone = [...rows];
  clone[idx] = { ...clone[idx], ...patch };
  return clone;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#e7dece] bg-white px-4 py-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
