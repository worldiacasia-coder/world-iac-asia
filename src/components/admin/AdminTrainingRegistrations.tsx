"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export type TrainingRegistrationItem = {
  id: string;
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  course: string;
  isRead: boolean;
  createdAt: string;
};

type Props = {
  initial: TrainingRegistrationItem[];
};

type Filter = "all" | "unread" | "read";

export default function AdminTrainingRegistrations({ initial }: Props) {
  const t = useTranslations("admin");
  const [items, setItems] = useState<TrainingRegistrationItem[]>(initial);
  const [selected, setSelected] = useState<TrainingRegistrationItem | null>(null);
  const [filter, setFilter] = useState<Filter>("unread");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const filtered = items.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (filter === "read") return item.isRead;
    return true;
  });

  const unreadCount = items.filter((item) => !item.isRead).length;

  async function setRead(id: string, isRead: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/training/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isRead: data.registration.isRead as boolean }
            : item
        )
      );
      setSelected((prev) =>
        prev?.id === id ? { ...prev, isRead: data.registration.isRead as boolean } : prev
      );
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t("trainingDeleteConfirm"))) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/training/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
    } finally {
      setBusyId(null);
    }
  }

  function openItem(item: TrainingRegistrationItem) {
    setSelected(item);
    if (!item.isRead) {
      void setRead(item.id, true);
    }
  }

  return (
    <div className="card-compact space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            {t("trainingTitle")} ({items.length})
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-medium text-brand-gold">
                {unreadCount} {t("trainingUnread")}
              </span>
            )}
          </h2>
          <div className="mt-1 h-px w-8 bg-brand-gold" />
        </div>
        <div className="flex gap-1 rounded-xl border border-white/60 bg-white/30 p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f
                  ? "bg-brand-gold text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {f === "all" ? t("trainingFilterAll") : f === "unread" ? t("trainingFilterUnread") : t("trainingFilterRead")}
            </button>
          ))}
        </div>
      </div>

      <ul className="max-h-[28rem] space-y-3 overflow-y-auto text-sm">
        {filtered.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border p-4 transition-colors ${
              item.isRead
                ? "border-white/40 bg-white/20"
                : "border-brand-gold/30 bg-brand-gold/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => openItem(item)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-gray-900">{item.fullName}</p>
                  {!item.isRead && (
                    <span className="rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {t("trainingNew")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-600">{item.course}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.organization} · {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </p>
                <p className="mt-2 text-[11px] text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={item.isRead}
                    disabled={busyId === item.id}
                    onChange={(e) => void setRead(item.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  {t("trainingMarkRead")}
                </label>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void remove(item.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {t("trainingDelete")}
                </button>
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-gray-400">{t("trainingEmpty")}</li>
        )}
      </ul>

      {mounted &&
        selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="my-4 w-full max-w-lg rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    {t("trainingDetail")}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-gray-900">
                    {selected.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  aria-label={t("trainingClose")}
                >
                  ✕
                </button>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-6 text-sm">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingName")}
                    </dt>
                    <dd className="mt-1 text-gray-900">{selected.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingOrganization")}
                    </dt>
                    <dd className="mt-1 text-gray-900">{selected.organization}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingEmail")}
                    </dt>
                    <dd className="mt-1">
                      <a href={`mailto:${selected.email}`} className="text-brand-gold hover:underline">
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingPhone")}
                    </dt>
                    <dd className="mt-1">
                      <a href={`tel:${selected.phone}`} className="text-brand-gold hover:underline">
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingCourse")}
                    </dt>
                    <dd className="mt-1 text-gray-900">{selected.course}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("trainingDate")}
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(selected.createdAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={selected.isRead}
                      disabled={busyId === selected.id}
                      onChange={(e) => void setRead(selected.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                    />
                    {t("trainingMarkRead")}
                  </label>
                  <button
                    type="button"
                    disabled={busyId === selected.id}
                    onClick={() => void remove(selected.id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {t("trainingDelete")}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
