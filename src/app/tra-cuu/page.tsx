"use client";

import { useState } from "react";
import Link from "next/link";

type LookupResult = {
  customer_code: string;
  full_name: string;
  phone: string;
  requested_room_type: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  customer_status: string | null;
  created_at: string;
};

export default function LookupPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/public/lookup?code=${encodeURIComponent(code.trim())}`, { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Không tìm thấy mã");
      setResult(json.result as LookupResult);
    } catch (e: any) {
      setError(e?.message || "Có lỗi, thử lại giúp mình nhé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#1f1d1a]">
      <header className="sticky top-0 z-30 border-b border-[#e9e0d4] bg-[#f8f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-sm font-semibold">← Trở về</Link>
          <div className="text-sm font-semibold">Tra cứu đặt chỗ</div>
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="rounded-[2rem] border border-[#e7dece] bg-white p-6 shadow-[0_12px_48px_rgba(62,56,47,0.08)]">
          <div className="text-xs uppercase tracking-[0.16em] text-[#9b907e]">Tra cứu</div>
          <h1 className="mt-2 text-2xl font-medium">Nhập mã đặt chỗ / mã KH</h1>
          <p className="mt-2 text-sm leading-7 text-[#6f665a]">Ví dụ: KH2604271234</p>

          <div className="mt-5 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nhập mã..."
              className="h-12 flex-1 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm"
            />
            <button
              disabled={loading || !code.trim()}
              onClick={() => void submit()}
              className="h-12 rounded-2xl bg-[#4b5a44] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Đang tìm..." : "Tra cứu"}
            </button>
          </div>

          {error && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

          {result && (
            <div className="mt-5 rounded-2xl border border-[#efe7da] bg-[#fbf7f1] p-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">Mã: {result.customer_code}</div>
                <div className="rounded-full bg-white px-3 py-1 text-xs text-[#6f665a]">Trạng thái: <b>{result.customer_status || "new"}</b></div>
              </div>
              <div className="mt-3 grid gap-2 text-[#2f2a24]">
                <div>Khách: <b>{result.full_name}</b> ({result.phone})</div>
                <div>Loại lều: <b>{result.requested_room_type || "—"}</b></div>
                <div>Check-in: <b>{result.check_in_date || "—"}</b></div>
                <div>Check-out: <b>{result.check_out_date || "—"}</b></div>
              </div>
              <div className="mt-3 text-xs text-[#6f665a]">Thời gian tạo: {new Date(result.created_at).toLocaleString("vi-VN")}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
