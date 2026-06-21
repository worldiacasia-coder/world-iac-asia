"use client";

import Image from "next/image";
import { useState } from "react";

type Card = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export default function AdminPartnerCards({ initial }: { initial: Card[] }) {
  const [cards, setCards] = useState<Card[]>(initial);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", sortOrder: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function startEdit(c: Card) {
    setEditId(c.id);
    setForm({ name: c.name, description: c.description, imageUrl: c.imageUrl, sortOrder: c.sortOrder });
    setMsg("");
  }
  function cancelEdit() {
    setEditId(null);
    setForm({ name: "", description: "", imageUrl: "", sortOrder: 0 });
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      if (editId) {
        const res = await fetch("/api/partner-cards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCards((prev) => prev.map((c) => (c.id === editId ? data.card : c)));
        setMsg("Đã cập nhật!");
        cancelEdit();
      } else {
        const res = await fetch("/api/partner-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCards((prev) => [...prev, data.card].sort((a, b) => a.sortOrder - b.sortOrder));
        setMsg("Đã thêm mới!");
        cancelEdit();
      }
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Xoá card này?")) return;
    await fetch("/api/partner-cards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  const isEditing = editId !== null;

  return (
    <div className="card-compact space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900">
          Quản lý thẻ Đối tác ({cards.length})
        </h2>
        <div className="mt-2 h-px w-8 bg-brand-gold" />
      </div>

      {/* Form thêm / sửa */}
      <div className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur-sm">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          {isEditing ? "✏️ Chỉnh sửa thẻ" : "➕ Thêm thẻ mới"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tên / Tiêu đề *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="VD: Sự Công Nhận"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">URL Ảnh *</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input-field"
              placeholder="https://... hoặc /images/..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="input-field resize-none"
              placeholder="Mô tả ngắn về đối tác / lợi ích..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Thứ tự hiển thị</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        {/* Preview ảnh */}
        {form.imageUrl && (
          <div className="mt-4 relative h-32 w-48 overflow-hidden rounded-xl border border-white/50">
            <Image src={form.imageUrl} alt="preview" fill className="object-cover" sizes="192px" />
          </div>
        )}

        {msg && (
          <p className={`mt-3 text-sm font-medium ${msg.includes("Lỗi") ? "text-red-600" : "text-green-700"}`}>
            {msg}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={save}
            disabled={saving || !form.name || !form.imageUrl}
            className="btn-primary btn-sm"
          >
            {saving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm mới"}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} className="btn-outline btn-sm">
              Huỷ
            </button>
          )}
        </div>
      </div>

      {/* Danh sách cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.id} className="glass-panel overflow-hidden p-0">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src={c.imageUrl} alt={c.name} fill className="object-cover" sizes="300px" />
              <div className="absolute inset-0 bg-black/30" />
              <p className="absolute bottom-2 left-3 font-display text-sm font-semibold text-white">
                {c.name}
              </p>
              <span className="absolute right-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-xs text-white/70">
                #{c.sortOrder}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <p className="line-clamp-1 text-xs text-gray-500">{c.description || "—"}</p>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(c)}
                  className="text-xs font-medium text-brand-gold hover:text-brand-gold-hover"
                >
                  Sửa
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
