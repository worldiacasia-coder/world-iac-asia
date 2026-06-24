"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/constants";

export default function ContactForm() {
  const t = useTranslations("partners");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h3 className="font-display text-xl font-semibold text-gray-900">{t("contactInfo")}</h3>
        <div className="mt-3 h-0.5 w-8 bg-brand-gold" />
        <dl className="mt-8 space-y-5 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("address")}
            </dt>
            <dd className="mt-2 text-gray-600">{SITE.address}</dd>
          </div>
          <hr className="divider" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("phone")}
            </dt>
            <dd className="mt-2">
              <a href={`tel:${SITE.phone}`} className="text-brand-gold hover:text-brand-gold-hover">
                {SITE.phone}
              </a>
            </dd>
          </div>
          <hr className="divider" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("email")}
            </dt>
            <dd className="mt-2">
              <a href={`mailto:${SITE.email}`} className="text-brand-gold hover:text-brand-gold-hover">
                {SITE.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="font-display text-xl font-semibold text-gray-900">{t("formTitle")}</h3>
        <div className="mt-3 h-0.5 w-8 bg-brand-gold" />
        {status === "success" && (
          <div className="mt-6 rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
            {t("success")}
          </div>
        )}
        {status === "error" && (
          <div className="mt-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            {t("error")}
          </div>
        )}
        <div className="mt-8 space-y-4">
          <input
            required
            placeholder={`${t("fullName")} *`}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="email"
            placeholder={`${t("email")} *`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="tel"
            placeholder={`${t("phone")} *`}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder={`${t("subject")} *`}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input-field"
          />
          <textarea
            required
            rows={4}
            placeholder={`${t("message")} *`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input-field resize-none"
          />
        </div>
        <button type="submit" disabled={status === "loading"} className="btn-primary mt-6">
          {status === "loading" ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
