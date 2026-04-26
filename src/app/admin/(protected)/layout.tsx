import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-slate-900">
      <header className="border-b border-[#e7dece] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="font-semibold text-slate-900">Admin</Link>
            <span className="text-slate-300">/</span>
            <Link href="/admin/content" className="text-slate-600 hover:text-slate-900">Content</Link>
            <Link href="/admin/room-types" className="text-slate-600 hover:text-slate-900">Room types</Link>
            <Link href="/admin/menu" className="text-slate-600 hover:text-slate-900">Ẩm thực</Link>
            <Link href="/admin/leads" className="text-slate-600 hover:text-slate-900">Leads</Link>
          </div>

          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm">Đăng xuất</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
