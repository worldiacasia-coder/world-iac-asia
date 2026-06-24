"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/constants";

export default function JudgeCourseRegistrationForm() {
  const t = useTranslations("judges");
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        course: t("registrationCourseName"),
      }),
    });

    setStatus(res.ok ? "success" : "error");
    if (res.ok) {
      setForm({ fullName: "", organization: "", phone: "", email: "" });
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h3 className="font-display text-xl font-semibold text-gray-900">
          {t("registrationInfoTitle")}
        </h3>
        <div className="mt-3 h-0.5 w-8 bg-brand-gold" />
        <p className="mt-6 text-base leading-relaxed text-gray-500">
          {t("registrationInfoDesc")}
        </p>
        <dl className="mt-8 space-y-5 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("registrationCourseLabel")}
            </dt>
            <dd className="mt-2 font-medium text-gray-900">{t("registrationCourseName")}</dd>
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
        </dl>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="font-display text-xl font-semibold text-gray-900">{t("registrationFormTitle")}</h3>
        <div className="mt-3 h-0.5 w-8 bg-brand-gold" />
        {status === "success" && (
          <div className="mt-6 rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
            {t("registrationSuccess")}
          </div>
        )}
        {status === "error" && (
          <div className="mt-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            {t("registrationError")}
          </div>
        )}
        <div className="mt-8 space-y-4">
          <input
            required
            placeholder={`${t("registrationFullName")} *`}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder={`${t("registrationOrganization")} *`}
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
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
            type="email"
            placeholder={`${t("email")} *`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={status === "loading"} className="btn-primary mt-6">
          {status === "loading" ? t("registrationSubmitting") : t("registrationSubmit")}
        </button>
      </form>
    </div>
  );
}
