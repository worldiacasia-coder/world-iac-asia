"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import StarRating from "@/components/ui/StarRating";

export type JudgeData = {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  country: string;
  stars: number;
  phone?: string;
  email?: string;
  certifications?: string;
  history?: string;
};

type Props = {
  judge: JudgeData;
  canViewSensitive: boolean;
};

export default function JudgeCard({ judge, canViewSensitive }: Props) {
  const t = useTranslations("judges");
  const tCommon = useTranslations("common");
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="group glass-panel overflow-hidden p-0">
      {/* Portrait image */}
      <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={judge.avatarUrl}
          alt={judge.name}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Stars overlay */}
        <div className="absolute bottom-4 left-4">
          <StarRating stars={judge.stars} readOnly size="md" />
        </div>

        {/* Country badge */}
        <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {judge.country}
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900">{judge.name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-gold">{judge.title}</p>
        <div className="mt-4 h-px w-8 bg-brand-gold" />

        {/* Sensitive details */}
        <div className="relative mt-5">
          {!canViewSensitive && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
              <p className="max-w-xs px-4 text-center text-xs font-medium text-gray-500">
                {t("lockedMessage")}
              </p>
            </div>
          )}

          <dl
            className={`space-y-2 text-sm ${!canViewSensitive ? "select-none blur-sm" : ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-gray-400">{t("phone")}</dt>
              <dd className="text-right text-gray-800">{judge.phone ?? tCommon("notAvailable")}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-gray-400">{t("email")}</dt>
              <dd className="truncate text-right text-gray-800">
                {judge.email ?? tCommon("notAvailable")}
              </dd>
            </div>
          </dl>

          {expanded && canViewSensitive && (
            <div className="mt-5 space-y-4">
              {judge.certifications && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {t("certifications")}
                  </p>
                  <div className="mt-1 h-px w-8 bg-gray-100" />
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {judge.certifications}
                  </p>
                </div>
              )}
              {judge.history && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {t("history")}
                  </p>
                  <div className="mt-1 h-px w-8 bg-gray-100" />
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{judge.history}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {canViewSensitive && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-hover"
          >
            {expanded ? t("showLess") : t("showMore")}
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
