"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SiteContent } from "@/lib/site-content";
import { defaultSiteContent } from "@/lib/site-content";

type MenuItem = {
  id: string;
  category: "food" | "drink" | "combo";
  serving_period?: "breakfast" | "main";
  name: string;
  description: string | null;
  price: number;
  image_url?: string | null;
};

function Money({ value }: { value: number }) {
  return <span className="font-semibold text-[#4b5a44]">{new Intl.NumberFormat("vi-VN").format(value)}đ</span>;
}

function Section({ title, items }: { title: string; items: MenuItem[] }) {
  if (!items.length) return null;
  const breakfast = items.filter((m) => (m.serving_period || "main") === "breakfast");
  const main = items.filter((m) => (m.serving_period || "main") !== "breakfast");

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium text-[#1f1d1a]">{title}</h2>

      {breakfast.length > 0 && (
        <div className="mt-5">
          <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Bữa sáng</div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {breakfast.map((m) => (
              <article key={m.id} className="flex gap-4 rounded-[1.6rem] border border-[#e7dece] bg-white p-4">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-[#f3efe7]" />
                )}
                <div className="flex-1">
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="mt-1 text-sm leading-6 text-[#6f665a]">{m.description || "—"}</div>
                  <div className="mt-2"><Money value={m.price} /></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {main.length > 0 && (
        <div className="mt-8">
          <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Bữa chính</div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {main.map((m) => (
              <article key={m.id} className="flex gap-4 rounded-[1.6rem] border border-[#e7dece] bg-white p-4">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-[#f3efe7]" />
                )}
                <div className="flex-1">
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="mt-1 text-sm leading-6 text-[#6f665a]">{m.description || "—"}</div>
                  <div className="mt-2"><Money value={m.price} /></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function MenuPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    (async () => {
      const [homeRes, menuRes] = await Promise.all([
        fetch("/api/public/home-data", { cache: "no-store" }),
        fetch("/api/public/menu", { cache: "no-store" }),
      ]);

      const homeJson = await homeRes.json().catch(() => null);
      if (homeRes.ok && homeJson?.ok && homeJson.content) setContent(homeJson.content as SiteContent);

      const menuJson = await menuRes.json().catch(() => null);
      if (menuRes.ok && menuJson?.ok && Array.isArray(menuJson.items)) setItems(menuJson.items as MenuItem[]);
    })();
  }, []);

  const combos = useMemo(() => items.filter((m) => m.category === "combo"), [items]);
  const foods = useMemo(() => items.filter((m) => m.category === "food"), [items]);
  const drinks = useMemo(() => items.filter((m) => m.category === "drink"), [items]);

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#1f1d1a]">
      <header className="sticky top-0 z-30 border-b border-[#e9e0d4] bg-[#f8f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src={content.logoUrl} alt={content.brandName} className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-[#d8cfbe] px-4 py-2 text-sm">Trang chủ</Link>
            <Link href="/#booking" className="rounded-full bg-[#4b5a44] px-4 py-2 text-sm font-medium text-white">Đặt chỗ</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="rounded-[2.2rem] bg-white p-7 shadow-[0_12px_48px_rgba(62,56,47,0.10)]">
          <div className="text-xs uppercase tracking-[0.18em] text-[#9b907e]">Menu</div>
          <h1 className="mt-2 text-3xl font-medium md:text-5xl">{content.menuSectionTitle}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f665a]">Giá tham khảo. Combo phù hợp nhóm đi nghỉ dưỡng; món lẻ chia theo đồ ăn / đồ uống.</p>
        </div>

        <Section title="Combo" items={combos} />
        <Section title="Đồ ăn" items={foods} />
        <Section title="Đồ uống" items={drinks} />

        {items.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#e7dece] bg-white p-6 text-sm text-[#6f665a]">Chưa có dữ liệu menu.</div>
        )}
      </main>

      <footer className="border-t border-[#e9e0d4] bg-[#f8f4ee]">
        <div className="mx-auto max-w-7xl px-5 py-10 text-sm text-[#6f665a] lg:px-8">
          <div className="font-semibold text-[#1f1d1a]">{content.brandName}</div>
          <div className="mt-2">Hotline: {content.contact.hotline}</div>
        </div>
      </footer>
    </div>
  );
}
