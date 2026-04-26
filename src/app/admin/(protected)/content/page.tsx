"use client";

import { useEffect, useState } from "react";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok && json?.content) setContent(json.content);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      setMsg(json?.error || "Lưu thất bại");
    } else {
      setMsg("Đã lưu content");
    }
    setSaving(false);
  }

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">Đang tải...</main>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Content</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-[#4b5a44] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {msg && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm">{msg}</div>}

      <section className="mt-6 grid gap-4 rounded-3xl border border-[#e7dece] bg-white p-5">
        <Field label="Brand name" value={content.brandName} onChange={(v) => setContent({ ...content, brandName: v })} />
        <Field label="Brand tagline" value={content.brandTagline} onChange={(v) => setContent({ ...content, brandTagline: v })} />
        <Field label="Logo URL" value={content.logoUrl} onChange={(v) => setContent({ ...content, logoUrl: v })} />
        <Field label="Hero image URL" value={content.heroImageUrl} onChange={(v) => setContent({ ...content, heroImageUrl: v })} />

        <Field label="Hero badge" value={content.heroBadge} onChange={(v) => setContent({ ...content, heroBadge: v })} />
        <Field label="Hero title" value={content.heroTitle} onChange={(v) => setContent({ ...content, heroTitle: v })} />
        <TextArea label="Hero desc" value={content.heroDesc} onChange={(v) => setContent({ ...content, heroDesc: v })} />

        <Field label="Booking label" value={content.bookingLabel} onChange={(v) => setContent({ ...content, bookingLabel: v })} />
        <Field label="Booking title" value={content.bookingTitle} onChange={(v) => setContent({ ...content, bookingTitle: v })} />

        <Field label="Room section title" value={content.roomSectionTitle} onChange={(v) => setContent({ ...content, roomSectionTitle: v })} />
        <Field label="Menu section title" value={content.menuSectionTitle} onChange={(v) => setContent({ ...content, menuSectionTitle: v })} />

        <TextArea
          label="Highlights (mỗi dòng 1 item)"
          value={content.highlights.join("\n")}
          onChange={(v) => setContent({ ...content, highlights: v.split("\n").map((x) => x.trim()).filter(Boolean) })}
        />

        <TextArea
          label="Facts (format: label|value, mỗi dòng 1 item)"
          value={content.facts.map((f) => `${f.label}|${f.value}`).join("\n")}
          onChange={(v) =>
            setContent({
              ...content,
              facts: v
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [label, value] = line.split("|");
                  return { label: (label || "").trim(), value: (value || "").trim() };
                }),
            })
          }
        />

        <Field label="Experiences section title" value={content.experiencesSectionTitle} onChange={(v) => setContent({ ...content, experiencesSectionTitle: v })} />
        <TextArea label="Experiences section desc" value={content.experiencesSectionDesc} onChange={(v) => setContent({ ...content, experiencesSectionDesc: v })} />
        <TextArea
          label="Experiences (format: title|desc|imageUrl, mỗi dòng 1 item)"
          value={content.experiences.map((e) => `${e.title}|${e.desc}|${e.image}`).join("\n")}
          onChange={(v) =>
            setContent({
              ...content,
              experiences: v
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [title, desc, image] = line.split("|");
                  return { title: (title || "").trim(), desc: (desc || "").trim(), image: (image || "").trim() };
                }),
            })
          }
        />

        <Field label="Contact section title" value={content.contactSectionTitle} onChange={(v) => setContent({ ...content, contactSectionTitle: v })} />
        <Field label="Địa chỉ" value={content.contact.address} onChange={(v) => setContent({ ...content, contact: { ...content.contact, address: v } })} />
        <Field label="Hotline" value={content.contact.hotline} onChange={(v) => setContent({ ...content, contact: { ...content.contact, hotline: v } })} />
        <Field label="Di chuyển" value={content.contact.transport} onChange={(v) => setContent({ ...content, contact: { ...content.contact, transport: v } })} />
        <TextArea label="Footer note" value={content.contact.note} onChange={(v) => setContent({ ...content, contact: { ...content.contact, note: v } })} />
      </section>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-2xl border border-slate-300 px-4 text-sm" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-600">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm" />
    </label>
  );
}
