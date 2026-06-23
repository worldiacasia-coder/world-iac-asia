"use client";

import Image from "next/image";
import { useState } from "react";

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

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };
  const statusLabel = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };

  return (
    <div className="card-compact space-y-5">
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

      <div className="space-y-3">
        {filtered.map((app) => (
          <div key={app.id} className="glass-panel cursor-pointer p-4 transition-all hover:bg-white/50"
            onClick={() => { setSelected(app); setNote(app.adminNote ?? ""); }}>
            <div className="flex items-center gap-4">
              {app.avatarPath ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={app.avatarPath} alt={app.fullName} fill className="object-cover" sizes="48px" unoptimized />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg font-semibold text-gray-400">
                  {app.fullName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{app.fullName}</p>
                <p className="text-sm text-gray-500">{app.country} · {app.phone} · {new Date(app.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal chi tiết rộng ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="glass-panel w-full" style={{ display: "flex", flexDirection: "column", maxHeight: "92vh", width: "min(90vw, 900px)" }}>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/40 px-6 py-4">
              <div className="flex items-center gap-3">
                {selected.avatarPath ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image src={selected.avatarPath} alt={selected.fullName} fill className="object-cover" sizes="48px" unoptimized />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold text-white text-lg font-bold">
                    {selected.fullName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900">{selected.fullName}</h3>
                  <p className="text-sm text-gray-500">{selected.country} · Nộp ngày {new Date(selected.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg">✕</button>
            </div>

            {/* Nội dung cuộn */}
            <div style={{ overflowY: "auto", flex: "1 1 0", minHeight: 0 }} className="px-6 py-5">
              {/* Grid thông tin */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl bg-white/40 p-3">
                  <p className="text-xs font-medium text-gray-400">Ngày sinh</p>
                  <p className="mt-1 font-semibold text-gray-900">{selected.dob}</p>
                </div>
                <div className="rounded-xl bg-white/40 p-3">
                  <p className="text-xs font-medium text-gray-400">Điện thoại</p>
                  <p className="mt-1 font-semibold text-gray-900">{selected.phone}</p>
                </div>
                <div className="rounded-xl bg-white/40 p-3">
                  <p className="text-xs font-medium text-gray-400">Quốc gia</p>
                  <p className="mt-1 font-semibold text-gray-900">{selected.country}</p>
                </div>
                <div className="rounded-xl bg-white/40 p-3">
                  <p className="text-xs font-medium text-gray-400">Trạng thái</p>
                  <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor[selected.status]}`}>
                    {statusLabel[selected.status]}
                  </span>
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Kinh nghiệm làm việc</p>
                <div className="rounded-xl bg-white/40 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap min-h-[80px]">
                  {selected.experience}
                </div>
              </div>

              {/* Ảnh + CV */}
              <div className="mt-5 grid gap-6 grid-cols-2">
                {/* Ảnh đại diện */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Ảnh đại diện</p>
                  {selected.avatarPath ? (
                    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/60">
                      <Image src={selected.avatarPath} alt={selected.fullName} fill className="object-cover object-top" sizes="500px" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">Chưa có ảnh</div>
                  )}
                </div>

                {/* Sơ yếu lý lịch */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sơ yếu lý lịch (CV)</p>
                  {selected.resumePath ? (
                    <div className="flex flex-col gap-3 rounded-xl border border-white/60 bg-white/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold-light text-brand-gold text-2xl">📄</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">File CV đã upload</p>
                          <p className="text-xs text-gray-400">Lưu trên Cloudinary</p>
                        </div>
                      </div>
                      <a href={selected.resumePath} target="_blank" rel="noopener noreferrer"
                        className="btn-primary btn-sm text-center">
                        Mở xem CV →
                      </a>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">Chưa upload CV</div>
                  )}
                </div>
              </div>

              {/* Ghi chú admin nếu đã xử lý */}
              {selected.status !== "pending" && selected.adminNote && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  <span className="font-semibold">Ghi chú Admin:</span> {selected.adminNote}
                </div>
              )}
            </div>

            {/* Footer — nút duyệt */}
            <div style={{ flexShrink: 0 }} className="border-t border-white/40 px-6 py-4">
              {selected.status === "pending" ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ghi chú (tuỳ chọn)</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                      className="input-field resize-none text-sm" placeholder="Lý do từ chối hoặc ghi chú cho ứng viên..." />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(selected.id, "approved")} disabled={saving}
                      className="btn-primary flex-1 py-3 text-base">
                      {saving ? "Đang lưu..." : "✓ Duyệt hồ sơ"}
                    </button>
                    <button onClick={() => updateStatus(selected.id, "rejected")} disabled={saving}
                      className="flex-1 rounded-full border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100">
                      ✕ Từ chối
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${statusColor[selected.status]}`}>
                  {selected.status === "approved" ? "✓" : "✕"} {statusLabel[selected.status]}
                  {selected.adminNote ? ` — ${selected.adminNote}` : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
