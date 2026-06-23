"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type App = {
  id: string;
  fullName: string;
  dob: string;
  phone: string;
  country: string;
  experience: string;
  avatarPath: string | null;
  resumePath: string | null;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  createdAt: string;
};

export default function AdminApplications({ initial }: { initial: App[] }) {
  const [apps, setApps] = useState<App[]>(initial);
  const [selected, setSelected] = useState<App | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [selected]);

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setSaving(true);
    const res = await fetch("/api/member-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminNote: note }),
    });
    const data = await res.json();
    if (res.ok) {
      setApps((prev) => prev.map((a) => (a.id === id ? data.application : a)));
      setSelected(null);
      setNote("");
    }
    setSaving(false);
  }

  const statusBadge = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    approved: "bg-green-100 text-green-800 border border-green-300",
    rejected: "bg-red-100 text-red-800 border border-red-300",
  };
  const statusLabel = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };

  return (
    <div className="card-compact space-y-5">
      {/* Header + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            Đơn xin thành viên ({apps.length})
          </h2>
          <div className="mt-1 h-px w-8 bg-brand-gold" />
        </div>
        <div className="flex gap-1 rounded-xl border border-white/60 bg-white/30 p-1">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? "bg-brand-gold text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
              {f === "all" ? "Tất cả" : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-400">Không có đơn nào.</p>}

      {/* Danh sách đơn — grid giống hồ sơ đã duyệt */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((app) => (
          <div key={app.id}
            className="glass-panel cursor-pointer overflow-hidden p-0 transition-all hover:bg-white/50"
            onClick={() => { setSelected(app); setNote(app.adminNote ?? ""); }}>
            <div className="relative h-40 w-full overflow-hidden">
              {app.avatarPath ? (
                <Image src={app.avatarPath} alt={app.fullName} fill className="object-cover object-top" sizes="300px" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-gold-light to-white text-4xl font-bold text-brand-gold">
                  {app.fullName[0]}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display font-semibold text-white text-sm leading-tight">{app.fullName}</p>
                <p className="text-xs text-white/75">{app.country}</p>
              </div>
              <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold backdrop-blur-sm ${statusBadge[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>
            <div className="p-3 text-xs text-gray-500">
              <span>{app.resumePath ? "📄 Có CV" : "❌ Chưa có CV"}</span>
              <span className="mx-2">·</span>
              <span>{app.phone}</span>
              <span className="mx-2">·</span>
              <span>Nộp: {new Date(app.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal — render qua portal để không bị giới hạn bởi container cha */}
      {selected && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="flex min-h-full items-start justify-center p-4 py-8">
            <div
              className="w-full rounded-3xl bg-white shadow-2xl"
              style={{ width: "min(92vw, 960px)", maxHeight: "92vh", display: "flex", flexDirection: "column" }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* ── Header ── */}
              <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
                <div className="flex items-center gap-4">
                  {selected.avatarPath ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                      <Image src={selected.avatarPath} alt={selected.fullName} fill className="object-cover object-top" sizes="56px" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-white text-xl font-bold">
                      {selected.fullName[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selected.fullName}</h2>
                    <p className="text-sm text-gray-500">{selected.country} · Nộp ngày {new Date(selected.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg font-bold">
                  ✕
                </button>
              </div>

              {/* ── Nội dung (scroll) ── */}
              <div className="overflow-y-auto px-8 py-6 space-y-6" style={{ flex: "1 1 auto", minHeight: 0 }}>

                {/* 4 ô thông tin */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Ngày sinh</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{selected.dob}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Điện thoại</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{selected.phone}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Quốc gia</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{selected.country}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Trạng thái</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge[selected.status]}`}>
                      {statusLabel[selected.status]}
                    </span>
                  </div>
                </div>

                {/* Kinh nghiệm */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Kinh nghiệm làm việc</p>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {selected.experience}
                  </div>
                </div>

                {/* Ảnh + CV */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Ảnh đại diện</p>
                    {selected.avatarPath ? (
                      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-200">
                        <Image src={selected.avatarPath} alt={selected.fullName} fill className="object-cover object-top" sizes="400px" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-200 text-sm text-gray-400">
                        Chưa có ảnh đại diện
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sơ yếu lý lịch (CV)</p>
                    {selected.resumePath ? (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">📄</span>
                          <div>
                            <p className="font-semibold text-gray-900">File CV đã upload</p>
                            <p className="text-xs text-green-600 font-medium">☁ Lưu trên Cloudinary</p>
                          </div>
                        </div>
                        <a href={selected.resumePath} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3 text-sm font-semibold text-white hover:bg-brand-gold-hover transition-colors">
                          Mở xem CV →
                        </a>
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-200 text-sm text-gray-400">
                        Chưa upload CV
                      </div>
                    )}
                  </div>
                </div>

                {/* Ghi chú nếu đã xử lý */}
                {selected.status !== "pending" && selected.adminNote && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                    <span className="font-semibold text-gray-700">Ghi chú Admin: </span>
                    <span className="text-gray-600">{selected.adminNote}</span>
                  </div>
                )}

                {/* ── Khu vực duyệt ── */}
                {selected.status === "pending" ? (
                  <div className="rounded-2xl border-2 border-brand-gold/30 bg-amber-50 p-5 space-y-4">
                    <p className="font-semibold text-gray-800">Quyết định của Admin</p>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        Ghi chú phản hồi cho ứng viên (tuỳ chọn)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                        placeholder="VD: Hồ sơ đủ điều kiện, hoặc lý do từ chối..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => updateStatus(selected.id, "approved")}
                        disabled={saving}
                        className="flex-1 rounded-xl bg-brand-gold py-4 text-base font-bold text-white shadow-md transition-all hover:bg-brand-gold-hover disabled:opacity-60"
                      >
                        {saving ? "Đang lưu..." : "✓ DUYỆT HỒ SƠ"}
                      </button>
                      <button
                        onClick={() => updateStatus(selected.id, "rejected")}
                        disabled={saving}
                        className="flex-1 rounded-xl border-2 border-red-300 bg-red-50 py-4 text-base font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-60"
                      >
                        ✕ TỪ CHỐI
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl p-4 text-center text-base font-semibold ${statusBadge[selected.status]}`}>
                    {selected.status === "approved" ? "✓ Đã duyệt hồ sơ này" : "✕ Đã từ chối hồ sơ này"}
                    {selected.adminNote && <p className="mt-1 text-sm font-normal">{selected.adminNote}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
