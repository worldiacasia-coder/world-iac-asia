"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MEMBER_COUNTRIES, SITE } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";

export default function MemberApplicationForm() {
  const t = useTranslations("memberApp");
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setResumeName(file.name);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/member-applications", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? t("error"));
      }
      setStatus("success");
      formRef.current?.reset();
      setAvatarPreview(null);
      setResumeName(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("error"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50/60 p-10 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-gray-900">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-gray-500">{t("successDesc")}</p>
        <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-5">
          <p className="text-sm text-gray-600">{t("successShirtDesc")}</p>
          <a
            href={SITE.memberShirtFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex"
          >
            {t("successShirtBtn")}
          </a>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6 inline-flex"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <p className="section-label">{t("label")}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-gray-900">{t("title")}</h2>
        <div className="mt-3 h-0.5 w-10 bg-brand-gold" />
        <p className="mt-3 text-sm leading-relaxed text-gray-500">{t("desc")}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Họ tên */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("fullName")} *</label>
          <input name="fullName" required className="input-field" placeholder={t("fullNamePlaceholder")} />
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("dob")} *</label>
          <input name="dob" type="date" required className="input-field" />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("phone")} *</label>
          <input name="phone" type="tel" required className="input-field" placeholder="+84..." />
        </div>

        {/* Quốc gia */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("country")} *</label>
          <select name="country" required className="select-field">
            <option value="">{t("countryPlaceholder")}</option>
            {MEMBER_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Kinh nghiệm */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("experience")} *</label>
          <textarea
            name="experience"
            required
            rows={4}
            className="input-field resize-none"
            placeholder={t("experiencePlaceholder")}
          />
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("avatar")}</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/60 bg-white/20 px-4 py-6 text-center transition-colors hover:bg-white/30">
            {avatarPreview ? (
              <img src={avatarPreview} alt="preview" className="h-24 w-24 rounded-xl object-cover" />
            ) : (
              <>
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500">{t("avatarHint")}</span>
              </>
            )}
            <input name="avatar" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
        </div>

        {/* Sơ yếu lý lịch */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("resume")}</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/60 bg-white/20 px-4 py-6 text-center transition-colors hover:bg-white/30">
            {resumeName ? (
              <>
                <svg className="h-8 w-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="max-w-full truncate text-xs font-medium text-brand-gold">{resumeName}</span>
              </>
            ) : (
              <>
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-gray-500">{t("resumeHint")}</span>
              </>
            )}
            <input name="resume" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleResumeChange} />
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold-light p-5">
        <p className="text-xs leading-relaxed text-gray-500">{t("notice")}</p>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
