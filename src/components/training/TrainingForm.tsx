"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Course = { id: string; name: string; description: string };

export default function TrainingForm({ courses }: { courses: Course[] }) {
  const t = useTranslations("training");
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    course: courses[0]?.name ?? "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await fetch("/api/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("error"));
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ fullName: "", organization: "", phone: "", email: "", course: courses[0]?.name ?? "" });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="font-display text-xl font-semibold text-gray-900">{t("formTitle")}</h3>
      <div className="mt-3 h-0.5 w-8 bg-brand-gold" />

      {status === "success" && (
        <div className="mt-6 rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
          {t("success")}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("fullName")} *</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("organization")} *
          </label>
          <input
            required
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("phone")} *</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("email")} *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
        </div>
      </div>
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("course")} *</label>
        <select
          required
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="select-field"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary mt-8">
        {status === "loading" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
