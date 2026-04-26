const stayOptions = [
  {
    title: "Lều Dome",
    meta: "2–4 khách · view hồ · điều hoà",
    price: "Từ 2.000.000đ / đêm",
    image:
      "https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-01.jpeg",
  },
  {
    title: "Lều Mông Cổ",
    meta: "2–4 khách · riêng tư · đủ tiện nghi",
    price: "Từ 1.000.000đ / đêm",
    image:
      "https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-07.jpeg",
  },
  {
    title: "Lều Royal / nhóm",
    meta: "5–14 khách · phù hợp nhóm bạn / team",
    price: "Từ 1.800.000đ / đêm",
    image:
      "https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-09.jpeg",
  },
];

const experiences = [
  {
    title: "Chèo sup trên hồ",
    desc: "Mặt hồ yên, sáng sớm và chiều muộn rất đẹp. Phù hợp khách thích trải nghiệm chill nhẹ.",
    image:
      "https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-10.jpeg",
  },
  {
    title: "BBQ & lửa trại",
    desc: "Ăn tối ngoài trời, ngồi cạnh bếp lửa, hợp cho cặp đôi, gia đình và nhóm bạn.",
    image:
      "https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-08.jpeg",
  },
];

const highlights = [
  "Bên hồ Ghềnh Chè · cách Hà Nội chưa tới 2 giờ lái xe",
  "9 lều glamping, sức chứa từ 2 đến 10+ khách",
  "Có chèo sup, câu cá, BBQ, đốt lửa trại, check-in đồi chè",
];

const facts = [
  { label: "Check-in", value: "14:00" },
  { label: "Check-out", value: "Trước 11:00" },
  { label: "Loại lưu trú", value: "Dome · Mông Cổ · Royal" },
  { label: "Hoạt động", value: "Sup · BBQ · Câu cá · Thuyền hồ" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#1f1d1a]">
      <header className="sticky top-0 z-30 border-b border-[#e9e0d4] bg-[#f8f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-[0.08em] text-[#4b5a44] uppercase">Trốn Glamping</div>
            <div className="text-xs text-[#7c7469]">The Retreat Space</div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[#6f665a] md:flex">
            <a href="#intro" className="hover:text-[#1f1d1a]">
              Giới thiệu
            </a>
            <a href="#stay" className="hover:text-[#1f1d1a]">
              Lưu trú
            </a>
            <a href="#experiences" className="hover:text-[#1f1d1a]">
              Trải nghiệm
            </a>
            <a href="#contact" className="hover:text-[#1f1d1a]">
              Liên hệ
            </a>
          </nav>

          <a
            href="#booking"
            className="rounded-full bg-[#4b5a44] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3e4c38]"
          >
            Đặt chỗ
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-00-cover.jpeg"
              alt="Trốn Glamping bên hồ Ghềnh Chè"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2f342d]/60 via-[#2f342d]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1d1a]/30 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-end gap-10 px-5 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
            <div className="max-w-3xl pb-4 text-white lg:pb-10">
              <div className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/85">
                Resort-style glamping by the lake
              </div>
              <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-[0.02em] md:text-6xl">
                Nghỉ dưỡng giữa thiên nhiên, chậm lại một nhịp ở hồ Ghềnh Chè.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">
                Không gian glamping sáng, yên và riêng tư. Phù hợp cho cặp đôi, gia đình hoặc nhóm bạn muốn trốn khỏi
                thành phố cuối tuần.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="rounded-full bg-[#f4eadc] px-6 py-3 text-sm font-semibold text-[#2b3128] transition hover:bg-white"
                >
                  Kiểm tra chỗ trống
                </a>
                <a
                  href="#stay"
                  className="rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Xem các loại lều
                </a>
              </div>
            </div>

            <div id="booking" className="w-full max-w-md justify-self-end rounded-[2rem] bg-[#fbf7f1] p-6 text-[#1f1d1a] shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#8b816f]">Reservation</div>
                  <div className="mt-1 text-2xl font-medium">Đặt kỳ nghỉ của bạn</div>
                </div>
                <div className="rounded-full bg-[#efe6d9] px-3 py-1 text-xs text-[#6a6156]">MVP</div>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-[#6f665a]">Họ và tên</span>
                  <input
                    className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm outline-none placeholder:text-[#b0a79a] focus:border-[#9fa88d]"
                    placeholder="Tên khách"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#6f665a]">Số điện thoại</span>
                  <input
                    className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm outline-none placeholder:text-[#b0a79a] focus:border-[#9fa88d]"
                    placeholder="09xx xxx xxx"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm text-[#6f665a]">Check-in</span>
                    <input className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm outline-none focus:border-[#9fa88d]" type="date" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-[#6f665a]">Check-out</span>
                    <input className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm outline-none focus:border-[#9fa88d]" type="date" />
                  </label>
                </div>

                <button className="mt-2 h-12 rounded-full bg-[#4b5a44] text-sm font-semibold text-white transition hover:bg-[#3e4c38]">
                  Gửi yêu cầu đặt chỗ
                </button>

                <p className="text-xs leading-6 text-[#8b816f]">
                  Bước tiếp theo: nối booking thật với Supabase, giá theo ngày/qua đêm và tồn lều theo lịch.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="intro" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-[#8b816f]">A retreat close to Hanoi</div>
              <h2 className="mt-3 text-3xl font-medium leading-tight md:text-5xl">
                Một nơi để ở yên, ngắm hồ, uống cà phê sáng và tận hưởng không khí trong lành.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] leading-8 text-[#5f574d]">
              {highlights.map((item) => (
                <div key={item} className="flex gap-3 rounded-3xl border border-[#eadfce] bg-[#fcfaf6] px-5 py-4">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#7f916e]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stay" className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-[#8b816f]">Stay with us</div>
              <h2 className="mt-3 text-3xl font-medium md:text-5xl">Các loại lều / không gian lưu trú</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6f665a]">
              Dùng ảnh thật của Trốn để lên cảm giác resort sáng, sạch, thư giãn. Nội dung giá hiện là tham chiếu ban đầu.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {stayOptions.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(62,56,47,0.08)]">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#9a8f7f]">Accommodation</div>
                  <h3 className="mt-2 text-2xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6f665a]">{item.meta}</p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-[#4b5a44]">{item.price}</span>
                    <a href="#booking" className="text-sm font-semibold text-[#4b5a44]">
                      Đặt chỗ →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experiences" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            {experiences.map((item, idx) => (
              <article key={item.title} className={`grid overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(62,56,47,0.08)] ${idx === 0 ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"}`}>
                {idx === 0 ? (
                  <>
                    <img src={item.image} alt={item.title} className="h-full min-h-[320px] w-full object-cover" />
                    <div className="flex items-center p-8 lg:p-10">
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-[#8b816f]">Experience</div>
                        <h3 className="mt-3 text-3xl font-medium">{item.title}</h3>
                        <p className="mt-4 text-sm leading-8 text-[#6f665a]">{item.desc}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center p-8 lg:p-10">
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-[#8b816f]">Evening at Trốn</div>
                        <h3 className="mt-3 text-3xl font-medium">{item.title}</h3>
                        <p className="mt-4 text-sm leading-8 text-[#6f665a]">{item.desc}</p>
                      </div>
                    </div>
                    <img src={item.image} alt={item.title} className="h-full min-h-[320px] w-full object-cover" />
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-[2.2rem] bg-[#ede3d4]">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="p-8 lg:p-12">
                <div className="text-xs uppercase tracking-[0.18em] text-[#8b816f]">Before you arrive</div>
                <h2 className="mt-3 text-3xl font-medium md:text-4xl">Thông tin nhanh cho khách đặt chỗ</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label} className="rounded-3xl bg-[#f8f4ee] p-5">
                      <div className="text-xs uppercase tracking-[0.14em] text-[#9b907e]">{fact.label}</div>
                      <div className="mt-2 text-lg font-medium text-[#2f2a24]">{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-[340px]">
                <img
                  src="https://giadinhcamping.vn/wp-content/uploads/2023/09/tron-glamping-06.jpeg"
                  alt="Không gian Trốn Glamping"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-[#e9e0d4] bg-[#f8f4ee]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-[#6f665a] lg:grid-cols-3 lg:px-8">
          <div>
            <div className="text-base font-semibold text-[#1f1d1a]">Trốn Glamping</div>
            <p className="mt-3 leading-7">Retreat bên hồ Ghềnh Chè, dành cho những ngày cần chậm lại và nghỉ đúng nghĩa.</p>
          </div>
          <div>
            <div className="font-semibold text-[#1f1d1a]">Thông tin</div>
            <ul className="mt-3 space-y-2 leading-7">
              <li>Địa chỉ: Hồ Ghềnh Chè, Bình Sơn, Sông Công, Thái Nguyên</li>
              <li>Hotline: 0356 910 763</li>
              <li>Di chuyển: ô tô / xe máy / đường thuỷ</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#1f1d1a]">Ghi chú</div>
            <p className="mt-3 leading-7">
              Giao diện đang là bản MVP theo hướng resort sáng. Bước tiếp theo có thể nối form thật với Supabase để nhận
              booking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
