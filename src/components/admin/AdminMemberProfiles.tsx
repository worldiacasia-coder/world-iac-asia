"use client";

import Image from "next/image";
import { useState } from "react";

type Profile = {
  id: string;
  fullName: string;
  dob: string;
  phone: string;
  country: string;
  experience: string;
  avatarPath: string | null;
  resumePath: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function AdminMemberProfiles({ profiles }: { profiles: Profile[] }) {
  const [selected, setSelected] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");

  const approved = profiles.filter((p) => p.status === "approved");
  const filtered = approved.filter(
    (p) => p.fullName.toLowerCase().includes(search.toLowerCase()) ||
           p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card-compact space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900">
          Hồ sơ thành viên được duyệt ({approved.length})
        </h2>
        <div className="mt-1 h-px w-8 bg-brand-gold" />
        <p className="mt-2 text-sm text-gray-500">
          Chỉ hiển thị hồ sơ đã được phê duyệt — file lưu vĩnh viễn trên Cloudinary.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        placeholder="Tìm theo tên hoặc quốc gia..."
      />

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400">Chưa có hồ sơ nào được phê duyệt.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id}
            className="glass-panel cursor-pointer overflow-hidden p-0 transition-all hover:bg-white/50"
            onClick={() => setSelected(p)}>
            {/* Ảnh */}
            <div className="relative h-40 w-full overflow-hidden">
              {p.avatarPath ? (
                <Image src={p.avatarPath} alt={p.fullName} fill className="object-cover object-top" sizes="300px" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-gold-light to-white text-4xl font-bold text-brand-gold">
                  {p.fullName[0]}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display font-semibold text-white text-sm leading-tight">{p.fullName}</p>
                <p className="text-xs text-white/75">{p.country}</p>
              </div>
              {/* Badge Cloudinary */}
              {(p.avatarPath?.includes("cloudinary") || p.resumePath?.includes("cloudinary")) && (
                <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  ☁ Cloudinary
                </div>
              )}
            </div>
            <div className="p-3 text-xs text-gray-500">
              <span>{p.resumePath ? "📄 Có CV" : "❌ Chưa có CV"}</span>
              <span className="mx-2">·</span>
              <span>Duyệt: {new Date(p.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết hồ sơ */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl" style={{ display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
            <div className="flex shrink-0 items-center justify-between border-b border-white/40 px-6 py-4">
              <h3 className="font-display text-xl font-semibold text-gray-900">{selected.fullName}</h3>
              <button onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">✕</button>
            </div>

            <div style={{ overflowY: "auto", flex: "1 1 0", minHeight: 0 }} className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/40 p-3"><p className="text-xs text-gray-400">Ngày sinh</p><p className="font-semibold">{selected.dob}</p></div>
                <div className="rounded-xl bg-white/40 p-3"><p className="text-xs text-gray-400">Điện thoại</p><p className="font-semibold">{selected.phone}</p></div>
                <div className="rounded-xl bg-white/40 p-3"><p className="text-xs text-gray-400">Quốc gia</p><p className="font-semibold">{selected.country}</p></div>
                <div className="rounded-xl bg-green-100 p-3"><p className="text-xs text-gray-400">Trạng thái</p><p className="font-semibold text-green-700">✓ Đã duyệt</p></div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Kinh nghiệm</p>
                <div className="rounded-xl bg-white/40 p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{selected.experience}</div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Ảnh đại diện</p>
                  {selected.avatarPath ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/60">
                      <Image src={selected.avatarPath} alt={selected.fullName} fill className="object-cover object-top" sizes="400px" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">Chưa có ảnh</div>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sơ yếu lý lịch (CV)</p>
                  {selected.resumePath ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">📄</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">CV đã lưu trên Cloudinary</p>
                          <p className="text-xs text-green-600">☁ Lưu vĩnh viễn</p>
                        </div>
                      </div>
                      <a href={selected.resumePath} target="_blank" rel="noopener noreferrer"
                        className="btn-primary btn-sm block text-center">Mở xem CV →</a>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">Chưa upload CV</div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flexShrink: 0 }} className="border-t border-white/40 px-6 py-4">
              <button onClick={() => setSelected(null)} className="btn-outline w-full">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
