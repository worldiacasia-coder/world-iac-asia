"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  link: string | null;
  slug: string | null;
  metaDesc: string | null;
  sortOrder: number;
};

const EMPTY: Omit<NewsItem, "id"> = {
  title: "", excerpt: "", content: "", imageUrl: "",
  link: "", slug: "", metaDesc: "", sortOrder: 0,
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function AdminNewsPanel({ initial }: { initial: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initial);
  const [form, setForm] = useState<Omit<NewsItem, "id">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  /* ── Toolbar helpers ── */
  function insertTag(open: string, close: string) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || "Nội dung";
    const newVal = el.value.slice(0, start) + open + selected + close + el.value.slice(end);
    setForm((f) => ({ ...f, content: newVal }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + open.length, start + open.length + selected.length);
    }, 10);
  }

  /* ── Upload ảnh nội dung ── */
  async function uploadContentImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/news/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const tag = `\n<img src="${data.url}" alt="${file.name}" class="w-full rounded-xl my-4" />\n`;
        const el = contentRef.current;
        if (el) {
          const pos = el.selectionStart;
          const newVal = el.value.slice(0, pos) + tag + el.value.slice(pos);
          setForm((f) => ({ ...f, content: newVal }));
        }
      }
      setUploading(false);
    };
    input.click();
  }

  /* ── Upload ảnh bìa ── */
  async function uploadCover(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/news/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }));
    setUploading(false);
  }

  function startEdit(item: NewsItem) {
    setEditId(item.id);
    setForm({ title: item.title, excerpt: item.excerpt, content: item.content,
      imageUrl: item.imageUrl, link: item.link ?? "", slug: item.slug ?? "",
      metaDesc: item.metaDesc ?? "", sortOrder: item.sortOrder });
    setShowForm(true);
    setMsg("");
    setTab("write");
  }

  function cancelForm() {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(false);
    setMsg("");
  }

  async function save() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.imageUrl.trim()) {
      setMsg("⚠️ Cần có tiêu đề, tóm tắt và ảnh bìa.");
      return;
    }
    setSaving(true);
    setMsg("");
    const body = {
      ...form,
      slug: form.slug || slugify(form.title) || null,
      link: form.link || null,
      metaDesc: form.metaDesc || null,
    };
    try {
      const res = await fetch("/api/news", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...body } : body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (editId) {
        setItems((prev) => prev.map((i) => (i.id === editId ? data.item : i)));
        setMsg("✅ Đã cập nhật!");
      } else {
        setItems((prev) => [...prev, data.item].sort((a, b) => a.sortOrder - b.sortOrder));
        setMsg("✅ Đã đăng bài!");
      }
      cancelForm();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Xoá bài viết này?")) return;
    await fetch("/api/news", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const TOOLBAR = [
    { label: "H1", open: "<h1>", close: "</h1>" },
    { label: "H2", open: "<h2>", close: "</h2>" },
    { label: "H3", open: "<h3>", close: "</h3>" },
    { label: "P", open: "<p>", close: "</p>" },
    { label: "B", open: "<strong>", close: "</strong>" },
    { label: "I", open: "<em>", close: "</em>" },
    { label: "UL", open: "<ul>\n  <li>", close: "</li>\n</ul>" },
    { label: "LI", open: "<li>", close: "</li>" },
  ];

  return (
    <div className="card-compact space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">Quản lý Tin tức ({items.length})</h2>
          <div className="mt-1 h-px w-8 bg-brand-gold" />
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setTab("write"); }} className="btn-primary btn-sm">
            + Viết bài mới
          </button>
        )}
      </div>

      {/* ── Form Editor ── */}
      {showForm && (
        <div className="rounded-2xl border border-brand-gold/30 bg-white/60 p-5 space-y-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">{editId ? "✏️ Chỉnh sửa bài viết" : "➕ Bài viết mới"}</p>
            <button onClick={cancelForm} className="text-xs text-gray-400 hover:text-gray-600">Huỷ ✕</button>
          </div>

          {msg && <p className={`text-sm font-medium ${msg.startsWith("✅") ? "text-green-700" : "text-red-600"}`}>{msg}</p>}

          {/* Tiêu đề H1 */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tiêu đề bài viết (H1) *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
              className="input-field text-lg font-semibold"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          {/* Ảnh bìa */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Ảnh bìa *</label>
            <div className="flex gap-3">
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="input-field flex-1"
                placeholder="Dán URL ảnh hoặc tải lên từ máy tính..."
              />
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploading}
                className="btn-outline btn-sm shrink-0"
              >
                {uploading ? "⏳" : "📁 Tải lên"}
              </button>
              <input ref={coverRef} type="file" accept="image/*" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
            </div>
            {form.imageUrl && (
              <div className="relative mt-2 h-40 w-full overflow-hidden rounded-xl">
                <Image src={form.imageUrl} alt="cover" fill className="object-cover" sizes="600px" unoptimized />
              </div>
            )}
          </div>

          {/* Tóm tắt */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Tóm tắt (hiển thị trên trang chủ) *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="input-field resize-none"
              placeholder="Viết tóm tắt ngắn gọn, hấp dẫn..."
            />
          </div>

          {/* Nội dung bài viết */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nội dung bài viết</label>
              <div className="flex gap-1">
                <button onClick={() => setTab("write")} className={`rounded px-3 py-1 text-xs font-medium transition-all ${tab === "write" ? "bg-brand-gold text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Viết</button>
                <button onClick={() => setTab("preview")} className={`rounded px-3 py-1 text-xs font-medium transition-all ${tab === "preview" ? "bg-brand-gold text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>Xem trước</button>
              </div>
            </div>

            {tab === "write" ? (
              <>
                {/* Toolbar */}
                <div className="mb-2 flex flex-wrap gap-1 rounded-xl border border-white/60 bg-white/40 p-2">
                  {TOOLBAR.map((t) => (
                    <button key={t.label} type="button" onClick={() => insertTag(t.open, t.close)}
                      className="rounded bg-white/60 px-2 py-1 text-xs font-bold text-gray-700 shadow-sm hover:bg-brand-gold hover:text-white transition-all">
                      {t.label}
                    </button>
                  ))}
                  <button type="button" onClick={uploadContentImage} disabled={uploading}
                    className="rounded bg-white/60 px-2 py-1 text-xs font-bold text-gray-700 shadow-sm hover:bg-brand-gold hover:text-white transition-all">
                    {uploading ? "⏳" : "🖼 Ảnh"}
                  </button>
                </div>
                <textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={14}
                  className="input-field resize-y font-mono text-sm"
                  placeholder="<h2>Tiêu đề phần 1</h2>&#10;<p>Nội dung...</p>&#10;<h3>Tiêu đề phụ</h3>&#10;<p>Chi tiết...</p>"
                />
              </>
            ) : (
              <div
                className="min-h-[200px] rounded-2xl border border-white/60 bg-white/30 p-5 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-gray-400'>Chưa có nội dung...</p>" }}
              />
            )}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">🔍 SEO</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Slug URL (tự động tạo)</label>
                <input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-field text-sm" placeholder="vd: world-iac-summit-2025" />
                <p className="mt-1 text-xs text-gray-400">/news/{form.slug || "..."}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Meta Description</label>
                <textarea value={form.metaDesc ?? ""} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                  rows={2} className="input-field resize-none text-sm" placeholder="Mô tả hiển thị trên Google..." />
              </div>
            </div>
          </div>

          {/* Link + Thứ tự */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Link đọc thêm (tuỳ chọn)</label>
              <input value={form.link ?? ""} onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Thứ tự hiển thị</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="input-field" />
            </div>
          </div>

          <button onClick={save} disabled={saving || uploading} className="btn-primary w-full">
            {saving ? "Đang lưu..." : editId ? "Lưu thay đổi" : "Đăng bài"}
          </button>
        </div>
      )}

      {/* ── Danh sách bài viết ── */}
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
                  <p className="mt-0.5 text-xs text-gray-400">{item.slug ? `/news/${item.slug}` : "Chưa có slug"}</p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => startEdit(item)} className="text-xs font-medium text-brand-gold hover:text-brand-gold-hover">Sửa</button>
                  <button onClick={() => remove(item.id)} className="text-xs font-medium text-red-500 hover:text-red-700">Xoá</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
