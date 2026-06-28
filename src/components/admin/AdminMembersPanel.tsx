"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MEMBER_COUNTRIES } from "@/lib/constants";

type Member = {
  id: string;
  memberCode: string;
  name: string;
  avatarUrl: string;
  country: string;
  jobTitle: string;
  expirationDate: string;
  paymentStatus: "paid" | "unpaid";
};

export default function AdminMembersPanel({ initial }: { initial: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initial);
  const [filter, setFilter] = useState<"all" | "expired" | "active">("all");
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", country: "", jobTitle: "", avatarUrl: "" });
  const imageRef = useRef<HTMLInputElement>(null);

  const now = new Date();

  const isExpired = (m: Member) =>
    new Date(m.expirationDate) < now || m.paymentStatus === "unpaid";

  const filtered =
    filter === "expired" ? members.filter(isExpired)
    : filter === "active" ? members.filter((m) => !isExpired(m))
    : members;

  const expiredCount = members.filter(isExpired).length;

  function startEdit(m: Member) {
    setEditId(m.id);
    setEditForm({
      name: m.name,
      country: m.country,
      jobTitle: m.jobTitle,
      avatarUrl: m.avatarUrl,
    });
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm({ name: "", country: "", jobTitle: "", avatarUrl: "" });
  }

  async function uploadImage(memberId: string, file: File) {
    setUploading(memberId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/members/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Tải ảnh thất bại");
      setEditForm((f) => ({ ...f, avatarUrl: data.url }));
    } finally {
      setUploading(null);
    }
  }

  async function saveEdit(id: string) {
    setSaving(id);
    const res = await fetch("/api/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    const data = await res.json();
    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data.member, expirationDate: data.member.expirationDate } : m))
      );
      cancelEdit();
    }
    setSaving(null);
  }

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

      <div className="space-y-3">
        {filtered.map((m) => {
          const expired = isExpired(m);
          const expDate = new Date(m.expirationDate).toLocaleDateString("vi-VN");
          const editing = editId === m.id;

          return (
            <div key={m.id} className={`rounded-xl border border-white/70 bg-white/90 p-4 ${expired ? "border-red-200" : ""}`}>
              {editing ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Họ tên</label>
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Chức danh</label>
                      <input value={editForm.jobTitle} onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Quốc gia</label>
                      <select value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="select-field">
                        {MEMBER_COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ảnh đại diện</label>
                      <div className="flex gap-2">
                        <input value={editForm.avatarUrl} onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })} className="input-field min-w-0 flex-1" />
                        <button type="button" onClick={() => imageRef.current?.click()} disabled={uploading === m.id} className="btn-outline btn-sm shrink-0">
                          {uploading === m.id ? "⏳" : "📁"}
                        </button>
                        <input ref={imageRef} type="file" accept="image/*" className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(m.id, file);
                            e.target.value = "";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(m.id)} disabled={saving === m.id} className="btn-primary btn-sm">
                      {saving === m.id ? "..." : "Lưu"}
                    </button>
                    <button onClick={cancelEdit} className="btn-outline btn-sm">Huỷ</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-gold/25 ${expired ? "opacity-60 grayscale" : ""}`}>
                    <Image src={m.avatarUrl} alt={m.name} fill className="object-cover object-top" sizes="44px" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <span className="font-mono text-xs text-gray-400">{m.memberCode}</span>
                      {expired && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">Hết hạn</span>
                      )}
                    </div>
                    {m.jobTitle && <p className="text-sm text-brand-gold">{m.jobTitle}</p>}
                    <p className="text-sm text-gray-500">{m.country} · Hết hạn: {expDate}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button onClick={() => startEdit(m)} className="text-xs font-medium text-brand-gold hover:text-brand-gold-hover">Sửa</button>
                    <select value={m.paymentStatus}
                      onChange={(e) => updatePayment(m.id, e.target.value as "paid" | "unpaid")}
                      className={`rounded-lg border px-2 py-1 text-xs backdrop-blur-sm ${m.paymentStatus === "paid" ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                      <option value="paid">Đã thanh toán</option>
                      <option value="unpaid">Chưa thanh toán</option>
                    </select>
                    <button onClick={() => renew(m.id)} disabled={saving === m.id}
                      className="rounded-full border border-brand-gold bg-brand-gold-light px-3 py-1 text-xs font-semibold text-brand-gold hover:bg-brand-gold hover:text-white transition-all">
                      {saving === m.id ? "..." : "↻ Gia hạn"}
                    </button>
                    <button onClick={() => remove(m.id, m.name)}
                      className="text-xs font-medium text-red-400 hover:text-red-600">Xoá</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
