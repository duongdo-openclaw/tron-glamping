"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Sai mật khẩu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f1ea] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-[#e7dece] bg-white p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">Nhập mật khẩu quản trị để vào admin.</p>

        <label className="mt-5 grid gap-2">
          <span className="text-sm text-slate-600">Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-2xl border border-slate-300 px-4 text-sm"
            required
          />
        </label>

        {error && <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <button
          disabled={loading}
          className="mt-4 h-11 w-full rounded-full bg-[#4b5a44] text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang vào..." : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}
