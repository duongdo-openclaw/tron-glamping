import Link from "next/link";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";

type RoomType = {
  id: string;
  code: string;
  name: string;
  base_price: number;
  capacity_adults: number;
  is_active: boolean;
};

const mockRoomTypes: RoomType[] = [
  { id: "1", code: "GLAMPING_DOME", name: "Glamping Dome", base_price: 2000000, capacity_adults: 4, is_active: true },
  { id: "2", code: "GLAMPING_MCN", name: "Glamping Mông Cổ (MCN)", base_price: 1000000, capacity_adults: 4, is_active: true },
  { id: "3", code: "GLAMPING_MCL", name: "Glamping Mông Cổ (MCL)", base_price: 1200000, capacity_adults: 4, is_active: true },
  { id: "4", code: "GLAMPING_HOME", name: "Glamping Home", base_price: 1200000, capacity_adults: 3, is_active: true },
  { id: "5", code: "VENUE_RENTAL", name: "Thuê địa điểm", base_price: 0, capacity_adults: 2, is_active: true },
];

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

async function getRoomTypes() {
  if (!hasSupabaseEnv) return mockRoomTypes;

  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("room_types")
      .select("id,code,name,base_price,capacity_adults,is_active")
      .order("sort_order", { ascending: true });

    if (error || !data) return mockRoomTypes;
    return data as RoomType[];
  } catch {
    return mockRoomTypes;
  }
}

export default async function AdminPage() {
  const roomTypes = await getRoomTypes();

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Trốn Glamping</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Về landing
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Leads mới" value="12" sub="7 ngày" />
          <StatCard label="Booking pending" value="5" sub="Cần xác nhận" />
          <StatCard label="Đang ở" value="3" sub="Checked-in" />
          <StatCard label="Doanh thu tạm tính" value="28.500.000đ" sub="Tháng này" />
        </div>

        <section className="mt-8 rounded-3xl border border-[#e7dece] bg-white p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Loại lưu trú</h2>
            {!hasSupabaseEnv && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">Đang dùng dữ liệu mẫu</span>}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#faf7f2] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="px-4 py-3 font-medium">Sức chứa</th>
                  <th className="px-4 py-3 font-medium">Giá base</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((room) => (
                  <tr key={room.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">{room.code}</td>
                    <td className="px-4 py-3">{room.name}</td>
                    <td className="px-4 py-3">{room.capacity_adults} khách</td>
                    <td className="px-4 py-3">{formatVnd(room.base_price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${room.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {room.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e7dece] bg-white p-5">
            <h3 className="text-base font-semibold">Rule vận hành mặc định</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Check-in: 14:00</li>
              <li>• Check-out: 12:00</li>
              <li>• Extra hour mặc định: 100.000đ/giờ</li>
              <li>• Booking status: pending → confirmed → checked_in → checked_out</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#e7dece] bg-white p-5">
            <h3 className="text-base font-semibold">Checklist kết nối thật</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Tạo project Supabase</li>
              <li>2. Run file <code>supabase/schema.sql</code></li>
              <li>3. Set env ở Vercel</li>
              <li>4. Chuyển form landing sang insert lead_requests</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-[#e7dece] bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  );
}
