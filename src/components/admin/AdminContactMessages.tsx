"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export type ContactMessageItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Props = {
  initial: ContactMessageItem[];
};

type Filter = "all" | "unread" | "read";

export default function AdminContactMessages({ initial }: Props) {
  const t = useTranslations("admin");
  const [messages, setMessages] = useState<ContactMessageItem[]>(initial);
  const [selected, setSelected] = useState<ContactMessageItem | null>(null);
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

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  async function setRead(id: string, isRead: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, isRead: data.message.isRead as boolean }
            : m
        )
      );
      setSelected((prev) =>
        prev?.id === id ? { ...prev, isRead: data.message.isRead as boolean } : prev
      );
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t("contactDeleteConfirm"))) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
    } finally {
      setBusyId(null);
    }
  }

  function openMessage(message: ContactMessageItem) {
    setSelected(message);
    if (!message.isRead) {
      void setRead(message.id, true);
    }
  }

  return (
    <div className="card-compact space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            {t("contactTitle")} ({messages.length})
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-medium text-brand-gold">
                {unreadCount} {t("contactUnread")}
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
              {f === "all" ? t("contactFilterAll") : f === "unread" ? t("contactFilterUnread") : t("contactFilterRead")}
            </button>
          ))}
        </div>
      </div>

      <ul className="max-h-[28rem] space-y-3 overflow-y-auto text-sm">
        {filtered.map((m) => (
          <li
            key={m.id}
            className={`rounded-xl border p-4 transition-colors ${
              m.isRead
                ? "border-white/40 bg-white/20"
                : "border-brand-gold/30 bg-brand-gold/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => openMessage(m)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-gray-900">{m.subject}</p>
                  {!m.isRead && (
                    <span className="rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {t("contactNew")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-600">
                  {m.fullName} · {m.email}
                  {m.phone ? ` · ${m.phone}` : ""}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-400">{m.message}</p>
                <p className="mt-2 text-[11px] text-gray-400">
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </button>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={m.isRead}
                    disabled={busyId === m.id}
                    onChange={(e) => void setRead(m.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  {t("contactMarkRead")}
                </label>
                <button
                  type="button"
                  disabled={busyId === m.id}
                  onClick={() => void remove(m.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {t("contactDelete")}
                </button>
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-gray-400">{t("contactEmpty")}</li>
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
                    {t("contactDetail")}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-gray-900">
                    {selected.subject}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  aria-label={t("contactClose")}
                >
                  ✕
                </button>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-6 text-sm">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("contactName")}
                    </dt>
                    <dd className="mt-1 text-gray-900">{selected.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("contactEmail")}
                    </dt>
                    <dd className="mt-1">
                      <a href={`mailto:${selected.email}`} className="text-brand-gold hover:underline">
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("contactPhone")}
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {selected.phone ? (
                        <a href={`tel:${selected.phone}`} className="text-brand-gold hover:underline">
                          {selected.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("contactDate")}
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(selected.createdAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {t("contactMessageBody")}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 leading-relaxed text-gray-700">
                    {selected.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={selected.isRead}
                      disabled={busyId === selected.id}
                      onChange={(e) => void setRead(selected.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                    />
                    {t("contactMarkRead")}
                  </label>
                  <button
                    type="button"
                    disabled={busyId === selected.id}
                    onClick={() => void remove(selected.id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {t("contactDelete")}
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
