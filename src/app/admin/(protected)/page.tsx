import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Trốn Glamping</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Admin panel để chỉnh nội dung landing + room types (giá, mô tả, ảnh...).
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Mở website →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Content" desc="Chỉnh toàn bộ text và ảnh landing" href="/admin/content" />
        <Card title="Room types" desc="Chỉnh loại lều, giá base, sức chứa, ảnh, bật/tắt" href="/admin/room-types" />
        <Card title="Ẩm thực" desc="Đồ ăn, đồ uống, combo" href="/admin/menu" />
        <Card title="Leads" desc="Quản lý khách hàng + thông tin đặt" href="/admin/leads" />
      </div>
    </main>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-[#e7dece] bg-white p-5 hover:bg-slate-50">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-600">{desc}</div>
      <div className="mt-4 text-sm font-semibold text-[#4b5a44]">Mở →</div>
    </Link>
  );
}
