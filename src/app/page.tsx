export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Trốn Glamping</div>
              <div className="text-xs text-slate-500">Booking system (MVP)</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#features">Tính năng</a>
            <a className="hover:text-slate-900" href="#pricing">Giá</a>
            <a className="hover:text-slate-900" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50" href="#admin">
              Admin
            </a>
            <a
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              href="#book"
            >
              Đặt chỗ
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:py-16">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Đang dựng MVP · Next.js + Supabase
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Đặt glamping nhanh, quản lý giá theo ngày/qua đêm, thêm giờ.
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Bản demo này là nền tảng để triển khai booking + admin: inventory theo phòng/lều, pricing theo calendar,
              check-in/out, và phát sinh thêm giờ.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                href="#book"
              >
                Bắt đầu đặt chỗ
              </a>
              <a className="rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-slate-50" href="#features">
                Xem tính năng
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 text-sm">
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-slate-500">Pricing</div>
                <div className="font-semibold">Theo ngày</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-slate-500">Overnight</div>
                <div className="font-semibold">Qua đêm</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-slate-500">Extra</div>
                <div className="font-semibold">Thêm giờ</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-emerald-50 to-white p-6">
            <div id="book" className="space-y-4">
              <div className="text-sm font-semibold">Đặt chỗ (demo form)</div>
              <div className="grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-slate-600">Tên khách</span>
                  <input className="h-11 rounded-xl border px-4" placeholder="Nguyễn Văn A" />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-slate-600">SĐT</span>
                  <input className="h-11 rounded-xl border px-4" placeholder="09xx xxx xxx" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">Check-in</span>
                    <input className="h-11 rounded-xl border px-4" type="date" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs text-slate-600">Check-out</span>
                    <input className="h-11 rounded-xl border px-4" type="date" />
                  </label>
                </div>
                <button className="mt-2 h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
                  Gửi yêu cầu
                </button>
                <div className="text-xs text-slate-500">
                  (Bước tiếp theo: lưu lead/booking vào Supabase + tính giá theo calendar.)
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <h2 className="text-2xl font-semibold tracking-tight">Tính năng MVP</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { t: "Inventory", d: "Quản lý lều/phòng, số lượng, trạng thái trống/đã giữ/đã book." },
                { t: "Pricing calendar", d: "Giá theo ngày + qua đêm, có phụ thu ngày lễ/cuối tuần." },
                { t: "Check-in/out + thêm giờ", d: "Chuẩn hoá giờ nhận/trả, rule tính phí thêm giờ." },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border bg-white p-5">
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <div className="text-sm font-semibold">Khi nào xong bản booking thật?</div>
                <div className="mt-1 text-sm text-slate-600">
                  Sau khi nối Supabase + chốt rule pricing/check-in/out, mình làm booking flow + admin.
                </div>
              </div>
              <div className="rounded-2xl border p-5">
                <div className="text-sm font-semibold">Có xuất hoá đơn/báo cáo không?</div>
                <div className="mt-1 text-sm text-slate-600">MVP chưa, nhưng schema sẽ chuẩn để mở rộng.</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Trốn Glamping</div>
          <div className="text-xs">Deployed on Vercel · Data: Supabase (coming soon)</div>
        </div>
      </footer>
    </div>
  );
}
