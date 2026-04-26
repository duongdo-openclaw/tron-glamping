const features = [
  {
    title: "Pricing theo calendar",
    desc: "Giá theo ngày/qua đêm, cuối tuần/ngày lễ, phụ thu thêm giờ rõ ràng.",
  },
  {
    title: "Inventory theo khu/lều",
    desc: "Quản lý số lượng, trạng thái trống/giữ chỗ/đã book theo từng loại phòng.",
  },
  {
    title: "Check-in/out chuẩn hóa",
    desc: "Rule giờ nhận/trả, tính phí thêm giờ tự động theo cấu hình.",
  },
];

const stays = [
  {
    title: "Canopy Tent",
    meta: "2 khách · 1 giường · 36m²",
    desc: "Không gian riêng tư, nằm dưới tán cây. Phù hợp cặp đôi.",
  },
  {
    title: "Horizon Suite",
    meta: "2–3 khách · view núi · 40m²",
    desc: "View rộng, chill hoàng hôn. Ưu tiên trải nghiệm premium.",
  },
  {
    title: "Family Villa",
    meta: "4–6 khách · 2 phòng · BBQ",
    desc: "Đi nhóm/gia đình, có khu sinh hoạt chung và sân ngoài.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Trốn Glamping</div>
              <div className="text-xs text-slate-500">Booking system (MVP)</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#stay">
              Stay
            </a>
            <a className="hover:text-slate-900" href="#experiences">
              Experiences
            </a>
            <a className="hover:text-slate-900" href="#features">
              Hệ thống
            </a>
            <a className="hover:text-slate-900" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50" href="#admin">
              Admin
            </a>
            <a
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              href="#book"
            >
              Book now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO — inspired by luxury camp sites: big visual + short copy + booking box */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(250,204,21,.18),transparent_45%),radial-gradient(circle_at_40%_90%,rgba(56,189,248,.12),transparent_40%)]" />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_.8fr] md:py-16">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Lấy vibe từ resort/tented camp sites · tối giản, sang, nhiều khoảng thở
              </div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Glamping booking —
                <span className="text-emerald-200"> đẹp như landing resort</span>, chạy như hệ thống.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/75">
                Mục tiêu: khách nhìn là muốn đặt ngay. Admin quản được giá theo ngày/qua đêm, phụ thu thêm giờ,
                check-in/out và tồn phòng.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                  href="#book"
                >
                  Bắt đầu đặt chỗ
                </a>
                <a
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  href="#stay"
                >
                  Xem loại phòng
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 text-xs text-white/80 sm:text-sm">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-white/60">Giá</div>
                  <div className="mt-1 font-semibold">Theo ngày</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-white/60">Qua đêm</div>
                  <div className="mt-1 font-semibold">Overnight</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-white/60">Phụ thu</div>
                  <div className="mt-1 font-semibold">Thêm giờ</div>
                </div>
              </div>
            </div>

            {/* Booking box */}
            <div className="md:pt-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Book your stay</div>
                  <div className="text-xs text-white/60">(demo)</div>
                </div>

                <div id="book" className="mt-4 grid gap-3">
                  <label className="grid gap-1">
                    <span className="text-xs text-white/70">Tên khách</span>
                    <input
                      className="h-11 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-300/60"
                      placeholder="Nguyễn Văn A"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs text-white/70">SĐT</span>
                    <input
                      className="h-11 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-300/60"
                      placeholder="09xx xxx xxx"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs text-white/70">Check-in</span>
                      <input
                        className="h-11 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none focus:border-emerald-300/60"
                        type="date"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs text-white/70">Check-out</span>
                      <input
                        className="h-11 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none focus:border-emerald-300/60"
                        type="date"
                      />
                    </label>
                  </div>

                  <button className="mt-1 h-11 rounded-2xl bg-emerald-400 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
                    Gửi yêu cầu
                  </button>

                  <div className="text-xs text-white/60">
                    Bước tiếp theo: lưu lead/booking vào Supabase + tính giá theo calendar.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAY */}
        <section id="stay" className="border-t border-black/5">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs font-semibold text-emerald-700">STAY WITH US</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  Chọn loại phòng/lều phù hợp
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Card layout kiểu resort: tên + mô tả ngắn + CTA. Sau này nối dữ liệu Supabase để hiển thị giá theo
                  ngày.
                </p>
              </div>
              <a className="hidden text-sm font-semibold text-slate-700 hover:text-slate-900 md:block" href="#book">
                Book now →
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {stays.map((x) => (
                <div key={x.title} className="group overflow-hidden rounded-3xl border bg-white">
                  <div className="relative h-44 bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-100">
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,.25),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(15,23,42,.15),transparent_50%)]" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-semibold">{x.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{x.meta}</div>
                    <div className="mt-3 text-sm text-slate-600">{x.desc}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Giá: (coming soon)</span>
                      <a className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="#book">
                        Book →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCES */}
        <section id="experiences" className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr]">
              <div>
                <div className="text-xs font-semibold text-emerald-700">ACTIVITIES & WELLNESS</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  Bán trải nghiệm, không chỉ bán phòng
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Lấy cảm hứng từ tantawan: nhiều section kể câu chuyện + list hoạt động. Phần này giúp landing trông
                  “đắt” hơn.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { t: "BBQ / Campfire", d: "Đặt BBQ riêng, setup lửa trại, combo đồ ăn." },
                  { t: "Trekking / Hiking", d: "Tour ngắn quanh khu, phù hợp khách mới." },
                  { t: "Yoga / Wellness", d: "Buổi sáng nhẹ nhàng, tăng cảm giác retreat." },
                  { t: "Picnic", d: "Set picnic riêng — ảnh đẹp, dễ viral." },
                ].map((x) => (
                  <div key={x.t} className="rounded-3xl border bg-[#fbfbfa] p-5">
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM FEATURES */}
        <section id="features" className="border-t border-black/5 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs font-semibold text-emerald-700">SYSTEM</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Tính năng hệ thống booking</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Đây là phần “bằng chứng” cho admin: pricing calendar, inventory, check-in/out & thêm giờ.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {features.map((x) => (
                <div key={x.title} className="rounded-3xl border bg-white p-5">
                  <div className="text-sm font-semibold">{x.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-black/5">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <div className="text-xs font-semibold text-emerald-700">FAQ</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Câu hỏi nhanh</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border bg-white p-5">
                <div className="text-sm font-semibold">Khi nào xong bản booking thật?</div>
                <div className="mt-1 text-sm text-slate-600">
                  Sau khi nối Supabase + chốt rule pricing/check-in/out, mình làm booking flow + admin.
                </div>
              </div>
              <div className="rounded-3xl border bg-white p-5">
                <div className="text-sm font-semibold">Có xuất hoá đơn/báo cáo không?</div>
                <div className="mt-1 text-sm text-slate-600">MVP chưa, nhưng schema sẽ chuẩn để mở rộng.</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Trốn Glamping</div>
          <div className="text-xs">Deployed on Vercel · Data: Supabase (coming soon)</div>
        </div>
      </footer>
    </div>
  );
}
