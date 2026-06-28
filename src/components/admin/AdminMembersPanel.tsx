"use client";

import Image from "next/image";
import { useState } from "react";

type Member = {
  id: string;
  memberCode: string;
  name: string;
  avatarUrl: string;
  country: string;
  expirationDate: string;
  paymentStatus: "paid" | "unpaid";
};

export default function AdminMembersPanel({ initial }: { initial: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initial);
  const [filter, setFilter] = useState<"all" | "expired" | "active">("all");
  const [saving, setSaving] = useState<string | null>(null);

  const now = new Date();

  const isExpired = (m: Member) =>
    new Date(m.expirationDate) < now || m.paymentStatus === "unpaid";

  const filtered =
    filter === "expired" ? members.filter(isExpired)
    : filter === "active" ? members.filter((m) => !isExpired(m))
    : members;

  const expiredCount = members.filter(isExpired).length;

  async function renew(id: string) {
    setSaving(id);
    const res = await fetch("/api/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "renew" }),
    });
    const data = await res.json();
    if (res.ok) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...data.member, expirationDate: data.member.expirationDate } : m));
    }
    setSaving(null);
  }

  async function updatePayment(id: string, paymentStatus: "paid" | "unpaid") {
    const res = await fetch("/api/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentStatus }),
    });
    if (res.ok) setMembers((prev) => prev.map((m) => m.id === id ? { ...m, paymentStatus } : m));
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Xoá hội viên "${name}"?`)) return;
    const res = await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="card-compact space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            Danh sách Hội viên ({members.length})
            {expiredCount > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                {expiredCount} hết hạn
              </span>
            )}
          </h2>
          <div className="mt-1 h-px w-8 bg-brand-gold" />
        </div>
        <div className="flex gap-1 rounded-xl border border-white/60 bg-white/30 p-1">
          {(["all", "expired", "active"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? "bg-brand-gold text-white" : "text-gray-500 hover:text-gray-900"}`}>
              {f === "all" ? "Tất cả" : f === "expired" ? "Hết hạn" : "Còn hạn"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-400">Không có hội viên nào.</p>}

      {/* Danh sách */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const expired = isExpired(m);
          const expDate = new Date(m.expirationDate).toLocaleDateString("vi-VN");
          return (
            <div key={m.id} className={`glass-panel overflow-hidden p-0 ${expired ? "border-red-200" : ""}`}>
              <div className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ${expired ? "opacity-60 grayscale" : ""}`}>
                  <Image src={m.avatarUrl} alt={m.name} fill className="object-cover" sizes="48px" unoptimized />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <span className="font-mono text-xs text-gray-400">{m.memberCode}</span>
                    {expired && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">Hết hạn</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{m.country} · Hết hạn: {expDate}</p>
                </div>

                {/* Controls */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {/* Payment */}
                  <select value={m.paymentStatus}
                    onChange={(e) => updatePayment(m.id, e.target.value as "paid" | "unpaid")}
                    className={`rounded-lg border px-2 py-1 text-xs backdrop-blur-sm ${m.paymentStatus === "paid" ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                    <option value="paid">Đã thanh toán</option>
                    <option value="unpaid">Chưa thanh toán</option>
                  </select>

                  {/* Gia hạn */}
                  <button onClick={() => renew(m.id)} disabled={saving === m.id}
                    className="rounded-full border border-brand-gold bg-brand-gold-light px-3 py-1 text-xs font-semibold text-brand-gold hover:bg-brand-gold hover:text-white transition-all">
                    {saving === m.id ? "..." : "↻ Gia hạn"}
                  </button>

                  {/* Xoá */}
                  <button onClick={() => remove(m.id, m.name)}
                    className="text-xs font-medium text-red-400 hover:text-red-600">Xoá</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
