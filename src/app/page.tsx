"use client";

import { useEffect, useState } from "react";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

type RoomType = {
  code: string;
  name: string;
  description: string | null;
  capacity_adults: number;
  base_price: number;
  hero_image_url: string | null;
};

type MenuItem = {
  id: string;
  category: "food" | "drink" | "combo";
  name: string;
  description: string | null;
  price: number;
};

const fallbackRoomTypes: RoomType[] = [
  {
    code: "GLAMPING_DOME",
    name: "Glamping Dome",
    description: "Lake view, ideal for 2-4 guests.",
    capacity_adults: 4,
    base_price: 2000000,
    hero_image_url:
      "https://w.ladicdn.com/s800x1000/59364fe77015e1b316b75df7/img_7457-20251113063529-mphok.jpeg",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(fallbackRoomTypes);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const [homeRes, menuRes] = await Promise.all([
        fetch("/api/public/home-data", { cache: "no-store" }),
        fetch("/api/public/menu", { cache: "no-store" }),
      ]);

      const homeJson = await homeRes.json().catch(() => null);
      if (homeRes.ok && homeJson?.ok) {
        if (homeJson.content) setContent(homeJson.content as SiteContent);
        if (Array.isArray(homeJson.room_types) && homeJson.room_types.length) {
          setRoomTypes(homeJson.room_types as RoomType[]);
        }
      }

      const menuJson = await menuRes.json().catch(() => null);
      if (menuRes.ok && menuJson?.ok && Array.isArray(menuJson.items)) {
        setMenuItems(menuJson.items as MenuItem[]);
      }
    })();
  }, []);

  async function submitLead(form: HTMLFormElement) {
    setLoading(true);
    setDone(null);
    setError(null);

    const fd = new FormData(form);
    const payload = {
      full_name: String(fd.get("full_name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      check_in_date: fd.get("check_in_date") ? String(fd.get("check_in_date")) : null,
      check_out_date: fd.get("check_out_date") ? String(fd.get("check_out_date")) : null,
      requested_room_type: fd.get("requested_room_type") ? String(fd.get("requested_room_type")) : null,
      email: fd.get("email") ? String(fd.get("email")) : null,
      guest_count_adults: Number(fd.get("guest_count_adults") || 1),
      guest_count_children: Number(fd.get("guest_count_children") || 0),
      selected_menu_items: menuItems
        .filter((m) => (selectedMenu[m.id] || 0) > 0)
        .map((m) => ({ id: m.id, name: m.name, category: m.category, price: m.price, qty: selectedMenu[m.id] })),
      message: fd.get("message") ? String(fd.get("message")) : null,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Submit failed");

      setDone("Đã gửi yêu cầu! Bên Trốn sẽ liên hệ sớm.");
      form.reset();
      setSelectedMenu({});
    } catch (e: any) {
      setError(e?.message || "Có lỗi, thử lại giúp mình nhé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#1f1d1a]">
      <header className="sticky top-0 z-30 border-b border-[#e9e0d4] bg-[#f8f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={content.logoUrl}
                alt={content.brandName}
                className="h-9 w-9 rounded-full bg-white"
              />
              <div className="text-lg font-semibold tracking-[0.08em] text-[#4b5a44] uppercase">{content.brandName}</div>
            </div>
            <div className="text-xs text-[#7c7469]">{content.brandTagline}</div>
          </div>
          <a href="#booking" className="rounded-full bg-[#4b5a44] px-5 py-2.5 text-sm font-medium text-white">Đặt chỗ</a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={content.heroImageUrl}
              alt={content.brandName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2f342d]/60 via-[#2f342d]/35 to-transparent" />
          </div>

          <div className="relative mx-auto grid min-h-[80vh] max-w-7xl items-end gap-10 px-5 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
            <div className="max-w-3xl pb-4 text-white lg:pb-10">
              <div className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/85">
                {content.heroBadge}
              </div>
              <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-[0.02em] md:text-6xl">{content.heroTitle}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">{content.heroDesc}</p>
            </div>

            <div id="booking" className="w-full max-w-md justify-self-end rounded-[2rem] bg-[#fbf7f1] p-6 text-[#1f1d1a] shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
              <div className="text-xs uppercase tracking-[0.18em] text-[#8b816f]">{content.bookingLabel}</div>
              <div className="mt-1 text-2xl font-medium">{content.bookingTitle}</div>

              <form className="mt-6 grid gap-4" onSubmit={(e) => { e.preventDefault(); void submitLead(e.currentTarget); }}>
                <input name="full_name" required className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" placeholder="Họ và tên" />
                <input name="phone" required className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" placeholder="Số điện thoại" />
                <input name="email" className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" placeholder="Email (tuỳ chọn)" />
                <select name="requested_room_type" className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" defaultValue="">
                  <option value="">Chọn loại lều</option>
                  {roomTypes.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input name="check_in_date" className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" type="date" />
                  <input name="check_out_date" className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" type="date" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="guest_count_adults" type="number" min={1} defaultValue={1} className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" placeholder="Người lớn" />
                  <input name="guest_count_children" type="number" min={0} defaultValue={0} className="h-12 rounded-2xl border border-[#e7ddcf] bg-white px-4 text-sm" placeholder="Trẻ em" />
                </div>
                {menuItems.length > 0 && (
                  <details className="rounded-2xl border border-[#e7ddcf] bg-white px-4 py-3 text-sm">
                    <summary className="cursor-pointer font-medium text-[#4b5a44]">{content.menuSectionTitle} (đồ ăn / đồ uống / combo)</summary>
                    <div className="mt-3 grid gap-2">
                      {menuItems.map((m) => (
                        <label key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2">
                          <div>
                            <div className="text-sm font-medium">{m.name} <span className="text-xs text-slate-500">({m.category})</span></div>
                            <div className="text-xs text-slate-500">{new Intl.NumberFormat("vi-VN").format(m.price)}đ</div>
                          </div>
                          <input
                            type="number"
                            min={0}
                            value={selectedMenu[m.id] || 0}
                            onChange={(e) => setSelectedMenu((prev) => ({ ...prev, [m.id]: Number(e.target.value || 0) }))}
                            className="h-9 w-20 rounded-xl border border-slate-300 px-2 text-right"
                          />
                        </label>
                      ))}
                    </div>
                  </details>
                )}

                <textarea name="message" rows={3} className="rounded-2xl border border-[#e7ddcf] bg-white px-4 py-3 text-sm" placeholder="Ghi chú" />
                <button disabled={loading} className="h-12 rounded-full bg-[#4b5a44] text-sm font-semibold text-white disabled:opacity-60">
                  {loading ? "Đang gửi..." : "Gửi yêu cầu đặt chỗ"}
                </button>
                {done && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{done}</div>}
                {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <h2 className="text-3xl font-medium md:text-5xl">{content.roomSectionTitle}</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {roomTypes.map((item) => (
              <article key={item.code} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(62,56,47,0.08)]">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.hero_image_url || "https://picsum.photos/600/800"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#9a8f7f]">{item.code}</div>
                  <h3 className="mt-2 text-xl font-medium">{item.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6f665a]">{item.description || `${item.capacity_adults} khách`}</p>
                  <div className="mt-5 text-sm font-medium text-[#4b5a44]">
                    {item.base_price > 0 ? `${new Intl.NumberFormat("vi-VN").format(item.base_price)}đ / đêm` : "Liên hệ"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {menuItems.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-4 lg:px-8 lg:py-8">
            <h2 className="text-3xl font-medium md:text-5xl">{content.menuSectionTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#e7dece] bg-white p-5">
                  <div className="text-xs uppercase tracking-[0.14em] text-[#9b907e]">{item.category}</div>
                  <div className="mt-1 text-lg font-semibold text-[#1f1d1a]">{item.name}</div>
                  <div className="mt-2 text-sm text-[#6f665a]">{item.description || "—"}</div>
                  <div className="mt-3 text-sm font-semibold text-[#4b5a44]">{new Intl.NumberFormat("vi-VN").format(item.price)}đ</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
          <h2 className="text-3xl font-medium md:text-5xl">{content.experiencesSectionTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f665a]">{content.experiencesSectionDesc}</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {content.experiences.map((exp) => (
              <article key={exp.title} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(62,56,47,0.08)]">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={exp.image || "https://picsum.photos/1200/675"} alt={exp.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium">{exp.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6f665a]">{exp.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-[2.2rem] bg-[#ede3d4] p-8 lg:p-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.facts.map((fact) => (
                <div key={fact.label} className="rounded-3xl bg-[#f8f4ee] p-5">
                  <div className="text-xs uppercase tracking-[0.14em] text-[#9b907e]">{fact.label}</div>
                  <div className="mt-2 text-lg font-medium text-[#2f2a24]">{fact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e9e0d4] bg-[#f8f4ee]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-[#6f665a] lg:grid-cols-3 lg:px-8">
          <div>
            <div className="text-base font-semibold text-[#1f1d1a]">Trốn Glamping</div>
            <p className="mt-3 leading-7">{content.contact.note}</p>
          </div>
          <div>
            <div className="font-semibold text-[#1f1d1a]">{content.contactSectionTitle}</div>
            <ul className="mt-3 space-y-2 leading-7">
              <li>Địa chỉ: {content.contact.address}</li>
              <li>Hotline: {content.contact.hotline}</li>
              <li>Di chuyển: {content.contact.transport}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
