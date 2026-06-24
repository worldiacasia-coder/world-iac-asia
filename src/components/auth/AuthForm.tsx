"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { mapApiError, SITE } from "@/lib/constants";
import { getPostLoginPath } from "@/lib/roles";
import type { Role } from "@prisma/client";

export default function AuthForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  function translateError(apiMessage: string, fallback: string) {
    const key = mapApiError(apiMessage);
    return key ? tErrors(key) : apiMessage || fallback;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(translateError(data.error, t("loginFailed")));
      return;
    }

    router.push(getPostLoginPath(data.user.role as Role, redirectTo));
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card overflow-hidden">

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("email")}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="email@worldiacasia.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("password")}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="rounded"
            />
            {t("rememberMe")}
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("processing") : t("loginButton")}
          </button>

          <button
            type="button"
            onClick={() => setMessage(t("forgotMessage"))}
            className="w-full text-center text-sm text-brand-gold transition-colors hover:text-brand-gold-hover"
          >
            {t("forgotPassword")}
          </button>
        </form>

        {/* Thông báo chỉ admin cấp tài khoản */}
        <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            {t("accessNoticeLabel")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{t("accessNotice")}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-2 inline-flex text-sm font-medium text-brand-gold hover:text-brand-gold-hover"
          >
            {SITE.email} →
          </a>
        </div>
      </div>
    </div>
  );
}
