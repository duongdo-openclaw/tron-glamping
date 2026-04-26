"use client";

import { useRef, useState } from "react";

const MAX_ORIGINAL_MB = 12;
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;

export function UploadButton({
  label,
  folder,
  onUploaded,
}: {
  label: string;
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function compressToWebp(file: File): Promise<File> {
    const tooBig = file.size > MAX_ORIGINAL_MB * 1024 * 1024;
    if (tooBig) throw new Error(`Ảnh gốc quá lớn (>${MAX_ORIGINAL_MB}MB)`);
    if (!file.type.startsWith("image/")) return file;

    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);

    const ratio = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * ratio));
    const height = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Không thể nén ảnh"))), "image/webp", WEBP_QUALITY);
    });

    const base = (file.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  }

  async function upload(file: File) {
    setBusy(true);
    try {
      const optimized = await compressToWebp(file);
      const fd = new FormData();
      fd.append("file", optimized);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Upload failed");
      onUploaded(json.url);
    } catch (e: any) {
      alert(e?.message || "Upload thất bại");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        {busy ? "Đang up..." : label}
      </button>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
