import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  full_name: string;
  phone: string;
  requested_room_type: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  message: string | null;
  created_at: string;
};

async function getLeads(): Promise<LeadRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("lead_requests")
    .select(
      "id,full_name,phone,requested_room_type,check_in_date,check_out_date,message,created_at"
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
                  <th className="px-4 py-3 font-medium">SĐT</th>
                  <th className="px-4 py-3 font-medium">Loại</th>
                  <th className="px-4 py-3 font-medium">Check-in</th>
                  <th className="px-4 py-3 font-medium">Check-out</th>
                  <th className="px-4 py-3 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-slate-500">
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
                      <td className="px-4 py-3 whitespace-nowrap">{l.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.requested_room_type ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.check_in_date ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.check_out_date ?? "—"}</td>
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
