"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { HomeContentData } from "@/lib/home-content";

type Props = { initial: HomeContentData };

export default function AdminHomeContent({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"banner" | "side" | null>(null);
  const [msg, setMsg] = useState("");
  const bannerRef = useRef<HTMLInputElement>(null);
  const sideRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File, field: "bannerImageUrl" | "sideImageUrl") {
    setUploading(field === "bannerImageUrl" ? "banner" : "side");
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/home-content/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Tải ảnh thất bại");
      setForm((f) => ({ ...f, [field]: data.url }));
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Tải ảnh thất bại");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      setForm(data.content);
      setMsg("Đã lưu nội dung trang chủ!");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card-compact space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900">
          Trang chủ — Tầm nhìn &amp; Giá trị
        </h2>
        <div className="mt-1 h-px w-8 bg-brand-gold" />
        <p className="mt-2 text-sm text-gray-500">
          Ảnh banner khuyến nghị <strong>1920 × 640 px</strong> (tỉ lệ 3:1). Ảnh bên phải (Giá trị) tùy chọn.
        </p>
      </div>

      {/* Banner */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Ảnh banner (phía trên)
        </p>
        <div className="relative aspect-[3/1] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/60 bg-white/30">
          {form.bannerImageUrl ? (
            <Image src={form.bannerImageUrl} alt="Banner" fill className="object-cover" sizes="768px" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">Chưa có ảnh banner</div>
          )}
        </div>
        <input
          ref={bannerRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, "bannerImageUrl");
          }}
        />
        <button
          type="button"
          onClick={() => bannerRef.current?.click()}
          disabled={uploading === "banner"}
          className="btn-outline btn-sm mt-3"
        >
          {uploading === "banner" ? "Đang tải..." : "Tải ảnh banner"}
        </button>
      </div>

      {/* Side image */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Ảnh bên phải (dưới Sứ mệnh)
        </p>
        <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-2xl border border-white/60 bg-white/30">
          {form.sideImageUrl ? (
            <Image src={form.sideImageUrl} alt="Side" fill className="object-cover" sizes="320px" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">Chưa có ảnh</div>
          )}
        </div>
        <input
          ref={sideRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, "sideImageUrl");
          }}
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => sideRef.current?.click()}
            disabled={uploading === "side"}
            className="btn-outline btn-sm"
          >
            {uploading === "side" ? "Đang tải..." : "Tải ảnh"}
          </button>
          {form.sideImageUrl && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, sideImageUrl: "" }))}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Xóa ảnh
            </button>
          )}
        </div>
      </div>

      {/* Text fields — VI / EN */}
      <div className="grid gap-6 lg:grid-cols-2">
        {(
          [
            ["visionVi", "visionEn", "Tầm nhìn"],
            ["missionVi", "missionEn", "Sứ mệnh"],
            ["valuesVi", "valuesEn", "Giá trị"],
          ] as const
        ).map(([viKey, enKey, label]) => (
          <div key={viKey} className="lg:col-span-2 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">{label} (Tiếng Việt)</label>
              <textarea
                rows={5}
                value={form[viKey]}
                onChange={(e) => setForm((f) => ({ ...f, [viKey]: e.target.value }))}
                className="input-field min-h-[120px] w-full resize-y"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">{label} (English)</label>
              <textarea
                rows={5}
                value={form[enKey]}
                onChange={(e) => setForm((f) => ({ ...f, [enKey]: e.target.value }))}
                className="input-field min-h-[120px] w-full resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {msg && (
          <p className={`text-sm ${msg.includes("Đã lưu") ? "text-green-600" : "text-red-500"}`}>{msg}</p>
        )}
      </div>
    </div>
  );
}
