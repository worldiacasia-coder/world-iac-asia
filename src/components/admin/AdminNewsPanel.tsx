"use client";

import Image from "next/image";
import { useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  link: string | null;
  sortOrder: number;
};

type Status = "idle" | "loading" | "success" | "error";

const EMPTY = { title: "", excerpt: "", imageUrl: "", link: "", sortOrder: 0 };

export default function AdminNewsPanel({ initial }: { initial: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initial);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  function startEdit(item: NewsItem) {
    setEditId(item.id);
    setForm({ title: item.title, excerpt: item.excerpt, imageUrl: item.imageUrl, link: item.link ?? "", sortOrder: item.sortOrder });
    setShowForm(true);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(false);
    setMsg("");
  }

  async function save() {
    if (!form.title.trim() || !form.excerpt.trim()) {
      setMsg("Vui lòng điền tiêu đề và nội dung tóm tắt.");
      return;
    }
    setStatus("loading");
    setMsg("");
    try {
      if (editId) {
        const res = await fetch("/api/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form, link: form.link || null }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setItems((prev) => prev.map((i) => (i.id === editId ? data.item : i)));
        setMsg("✅ Đã cập nhật bài viết!");
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, link: form.link || null }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setItems((prev) => [...prev, data.item].sort((a, b) => a.sortOrder - b.sortOrder));
        setMsg("✅ Đã đăng bài viết mới!");
      }
      cancelForm();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setStatus("idle");
    }
  }

  async function remove(id: string) {
    if (!confirm("Xoá bài viết này?")) return;
    const res = await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="card-compact space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            Quản lý Tin tức ({items.length})
          </h2>
          <div className="mt-1 h-px w-8 bg-brand-gold" />
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
            + Viết bài mới
          </button>
        )}
      </div>

      {/* Form viết / sửa bài */}
      {showForm && (
        <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-700">
            {editId ? "✏️ Chỉnh sửa bài viết" : "➕ Viết bài mới"}
          </p>

          {msg && (
            <p className={`text-sm font-medium ${msg.startsWith("✅") ? "text-green-700" : "text-red-600"}`}>
              {msg}
            </p>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tiêu đề *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="VD: World IAC Asia Annual Summit 2025"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nội dung tóm tắt *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder="Viết tóm tắt nội dung bài viết, sự kiện hoặc thông tin muốn chia sẻ..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">URL Ảnh bìa *</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="input-field"
                placeholder="https://images.unsplash.com/..."
              />
              {form.imageUrl && (
                <div className="relative mt-2 h-24 w-full overflow-hidden rounded-xl">
                  <Image src={form.imageUrl} alt="preview" fill className="object-cover" sizes="300px" unoptimized />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Link đọc thêm (tuỳ chọn)</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
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
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={status === "loading"} className="btn-primary btn-sm">
              {status === "loading" ? "Đang lưu..." : editId ? "Lưu thay đổi" : "Đăng bài"}
            </button>
            <button onClick={cancelForm} className="btn-outline btn-sm">Huỷ</button>
          </div>
        </div>
      )}

      {/* Danh sách bài viết */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Chưa có bài viết nào.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass-panel overflow-hidden p-0 sm:flex">
              <div className="relative h-28 w-full shrink-0 overflow-hidden sm:h-auto sm:w-36">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="144px" unoptimized />
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" className="mt-1 text-xs text-brand-gold hover:underline">
                      {item.link}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => startEdit(item)} className="text-xs font-medium text-brand-gold hover:text-brand-gold-hover">
                    Sửa
                  </button>
                  <button onClick={() => remove(item.id)} className="text-xs font-medium text-red-500 hover:text-red-700">
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
