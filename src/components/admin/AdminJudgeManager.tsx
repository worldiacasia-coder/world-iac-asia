"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import StarRating from "@/components/ui/StarRating";
import { MEMBER_COUNTRIES } from "@/lib/constants";
import type { JudgeLevel } from "@/lib/judge-level";
import { groupJudgesByLevel, sortJudges } from "@/lib/judge-sort";
import { readJsonResponse } from "@/lib/api-client";
import JudgeOrderList from "@/components/admin/JudgeOrderList";
import { JudgeLevelAvatarBadge, JudgeLevelLabel } from "@/components/judges/JudgeLevelBadge";

export type JudgeRecord = {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  country: string;
  stars: number;
  level: JudgeLevel;
  sortOrder: number;
  phone: string;
  email: string;
  certifications: string;
  history: string;
};

const emptyForm = {
  name: "",
  avatarUrl: "",
  title: "",
  country: "",
  stars: 1,
  level: "chief" as JudgeLevel,
  phone: "",
  email: "",
  certifications: "",
  history: "",
};

export default function AdminJudgeManager({ initial }: { initial: JudgeRecord[] }) {
  const t = useTranslations("judges");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement>(null);

  const [judges, setJudges] = useState(() => sortJudges(initial));
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reorderingLevel, setReorderingLevel] = useState<JudgeLevel | null>(null);
  const [msg, setMsg] = useState("");

  function startEdit(judge: JudgeRecord) {
    setEditId(judge.id);
    setForm({
      name: judge.name,
      avatarUrl: judge.avatarUrl,
      title: judge.title,
      country: judge.country,
      stars: judge.stars,
      level: judge.level,
      phone: judge.phone,
      email: judge.email,
      certifications: judge.certifications,
      history: judge.history,
    });
    setMsg("");
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setMsg("");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/judges/upload", { method: "POST", body: fd });
      const data = await readJsonResponse<{ url?: string; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Tải ảnh thất bại");
      if (!data.url) throw new Error("Tải ảnh thất bại");
      const url = data.url;
      setForm((f) => ({ ...f, avatarUrl: url }));
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const payload = { ...form, ...(editId ? { id: editId } : {}) };
      const res = await fetch("/api/judges", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonResponse<{ judge?: JudgeRecord; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Lỗi lưu");
      if (!data.judge) throw new Error("Lỗi lưu");
      const judge = data.judge;

      if (editId) {
        setJudges((prev) => sortJudges(prev.map((j) => (j.id === editId ? { ...j, ...judge } : j))));
        setMsg("Đã cập nhật giám khảo!");
      } else {
        setJudges((prev) => sortJudges([...prev, judge]));
        setMsg("Đã thêm giám khảo mới!");
      }
      cancelEdit();
      router.refresh();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function commitOrder(level: JudgeLevel, orderedIds: string[]) {
    const snapshot = judges;
    setReorderingLevel(level);
    setMsg("");
    setJudges((prev) => {
      const others = prev.filter((j) => j.level !== level);
      const reordered = orderedIds.map((id, i) => {
        const judge = prev.find((j) => j.id === id);
        if (!judge) throw new Error("missing");
        return { ...judge, sortOrder: i };
      });
      return sortJudges([...others, ...reordered]);
    });

    try {
      const res = await fetch("/api/judges/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await readJsonResponse<{ judges?: JudgeRecord[]; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Không thể đổi thứ tự");
      if (!data.judges) throw new Error("Không thể đổi thứ tự");
      setJudges(sortJudges(data.judges));
      router.refresh();
    } catch (e: unknown) {
      setJudges(snapshot);
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setReorderingLevel(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Xoá giám khảo "${name}"?`)) return;
    const res = await fetch("/api/judges", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setJudges((prev) => prev.filter((j) => j.id !== id));
      if (editId === id) cancelEdit();
      router.refresh();
    }
  }

  const isEditing = editId !== null;
  const { chief, trainee } = groupJudgesByLevel(judges);

  return (
    <div className="card-compact space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900">
          {t("adminManageTitle")} ({judges.length})
        </h2>
        <div className="mt-2 h-px w-8 bg-brand-gold" />
        <p className="mt-2 text-sm text-gray-500">{t("adminManageSubtitle")}</p>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur-sm">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          {isEditing ? "✏️ Chỉnh sửa giám khảo" : "➕ Thêm giám khảo mới"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Họ tên *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Chức danh *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Quốc gia *</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="select-field"
            >
              <option value="">Chọn quốc gia</option>
              {MEMBER_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Ảnh đại diện *</label>
            <div className="flex gap-2">
              <input
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="input-field min-w-0 flex-1"
                placeholder="Tải ảnh hoặc dán URL..."
              />
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                disabled={uploading}
                className="btn-outline btn-sm shrink-0"
              >
                {uploading ? "⏳" : "📁 Tải lên"}
              </button>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Chứng chỉ</label>
            <textarea
              value={form.certifications}
              onChange={(e) => setForm({ ...form, certifications: e.target.value })}
              rows={2}
              className="input-field resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Kinh nghiệm</label>
            <textarea
              value={form.history}
              onChange={(e) => setForm({ ...form, history: e.target.value })}
              rows={2}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">{t("levelLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {(["chief", "trainee"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm({ ...form, level })}
                  className={`rounded-full border px-3 py-1.5 transition-all ${
                    form.level === level
                      ? "border-brand-gold bg-brand-gold-light"
                      : "border-gray-200 bg-white/60 hover:border-brand-gold/50"
                  }`}
                >
                  <JudgeLevelLabel level={level} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Xếp hạng sao (1–5)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, stars: star })}
                  className={`text-xl transition-colors ${
                    star <= form.stars ? "star-active" : "star-inactive"
                  }`}
                >
                  ★
                </button>
              ))}
              <StarRating stars={form.stars} size="sm" readOnly />
            </div>
          </div>
        </div>

        {form.avatarUrl && (
          <div className="relative mt-4 h-16 w-16 overflow-hidden rounded-full ring-2 ring-brand-gold/30">
            <Image src={form.avatarUrl} alt="preview" fill className="object-cover object-top" sizes="64px" unoptimized />
          </div>
        )}

        {msg && (
          <p
            className={`mt-3 text-sm font-medium ${
              msg.includes("Lỗi") || msg.includes("thất bại") ? "text-red-600" : "text-green-700"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={save}
            disabled={saving || uploading || !form.name || !form.title || !form.country || !form.avatarUrl}
            className="btn-primary btn-sm"
          >
            {saving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm giám khảo"}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} className="btn-outline btn-sm">
              Huỷ
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-gray-500">{t("orderHint")}</p>

        {chief.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{t("orderSectionChief")}</p>
            <JudgeOrderList
              items={chief}
              level="chief"
              reordering={reorderingLevel === "chief"}
              onEdit={startEdit}
              onRemove={remove}
              onReorder={(orderedIds) => commitOrder("chief", orderedIds)}
            />
          </div>
        )}

        {trainee.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("orderSectionTrainee")}</p>
            <JudgeOrderList
              items={trainee}
              level="trainee"
              reordering={reorderingLevel === "trainee"}
              onEdit={startEdit}
              onRemove={remove}
              onReorder={(orderedIds) => commitOrder("trainee", orderedIds)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
