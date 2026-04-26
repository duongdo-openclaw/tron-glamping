import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

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

async function getLeads(): Promise<LeadRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("lead_requests")
    .select(
      "id,full_name,phone,email,guest_count_adults,guest_count_children,requested_room_type,check_in_date,check_out_date,selected_menu_items,customer_status,message,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as LeadRow[];
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Trốn Glamping</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Leads</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ← Landing
            </Link>
          </div>
        </div>


        <section className="mt-6 overflow-hidden rounded-3xl border border-[#e7dece] bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-sm text-slate-600">Mới nhất (tối đa 50)</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#faf7f2] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="px-4 py-3 font-medium">SĐT / Email</th>
                  <th className="px-4 py-3 font-medium">Khách</th>
                  <th className="px-4 py-3 font-medium">Loại</th>
                  <th className="px-4 py-3 font-medium">Check-in</th>
                  <th className="px-4 py-3 font-medium">Check-out</th>
                  <th className="px-4 py-3 font-medium">Ẩm thực</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-slate-500">
                      Chưa có lead.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {new Date(l.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{l.full_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>{l.phone}</div>
                        <div className="text-xs text-slate-500">{l.email ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.guest_count_adults ?? 1} NL / {l.guest_count_children ?? 0} TE</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.requested_room_type ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.check_in_date ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.check_out_date ?? "—"}</td>
                      <td className="px-4 py-3 min-w-[220px] text-xs text-slate-700">
                        {Array.isArray(l.selected_menu_items) && l.selected_menu_items.length > 0
                          ? l.selected_menu_items.map((x, i) => (
                              <div key={i}>{x.name} ×{x.qty}</div>
                            ))
                          : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.customer_status ?? "new"}</td>
                      <td className="px-4 py-3 max-w-[360px] truncate" title={l.message ?? ""}>
                        {l.message ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
