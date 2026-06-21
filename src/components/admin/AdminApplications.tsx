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
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
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
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f ? "bg-brand-gold text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {f === "all" ? "Tất cả" : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400">Không có đơn nào.</p>
      )}

      <div className="space-y-3">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="glass-panel cursor-pointer p-4 transition-all hover:bg-white/50"
            onClick={() => { setSelected(app); setNote(app.adminNote ?? ""); }}
          >
            <div className="flex items-center gap-4">
              {app.avatarPath ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={app.avatarPath} alt={app.fullName} fill className="object-cover" sizes="48px" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg font-semibold text-gray-400">
                  {app.fullName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{app.fullName}</p>
                <p className="text-sm text-gray-500">{app.country} · {app.phone}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[app.status]}`}>
                {statusLabel[app.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-semibold text-gray-900">{selected.fullName}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-400">Ngày sinh</p><p className="font-medium">{selected.dob}</p></div>
                <div><p className="text-xs text-gray-400">Điện thoại</p><p className="font-medium">{selected.phone}</p></div>
                <div><p className="text-xs text-gray-400">Quốc gia</p><p className="font-medium">{selected.country}</p></div>
                <div><p className="text-xs text-gray-400">Ngày nộp</p><p className="font-medium">{new Date(selected.createdAt).toLocaleDateString("vi-VN")}</p></div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Kinh nghiệm</p>
                <p className="mt-1 whitespace-pre-wrap text-gray-700">{selected.experience}</p>
              </div>
              {selected.avatarPath && (
                <div>
                  <p className="text-xs text-gray-400">Ảnh đại diện</p>
                  <div className="relative mt-1 h-32 w-32 overflow-hidden rounded-xl">
                    <Image src={selected.avatarPath} alt="" fill className="object-cover" sizes="128px" />
                  </div>
                </div>
              )}
              {selected.resumePath && (
                <div>
                  <p className="text-xs text-gray-400">Sơ yếu lý lịch</p>
                  <a href={selected.resumePath} target="_blank" className="mt-1 inline-flex items-center gap-1 text-brand-gold hover:underline">
                    Xem file →
                  </a>
                </div>
              )}
            </div>

            {selected.status === "pending" && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ghi chú (tuỳ chọn)</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input-field resize-none text-sm" placeholder="Lý do từ chối hoặc ghi chú..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selected.id, "approved")} disabled={saving} className="btn-primary btn-sm flex-1">
                    ✓ Duyệt
                  </button>
                  <button onClick={() => updateStatus(selected.id, "rejected")} disabled={saving} className="flex-1 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100">
                    ✕ Từ chối
                  </button>
                </div>
              </div>
            )}
            {selected.status !== "pending" && (
              <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${statusColor[selected.status]}`}>
                {statusLabel[selected.status]}{selected.adminNote ? ` — ${selected.adminNote}` : ""}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
