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
    <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-gold/30 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20">
          <Image
            src={judge.avatarUrl}
            alt={judge.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                {judge.name}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-brand-gold">{judge.title}</p>
            </div>
            <StarRating stars={judge.stars} readOnly size="sm" />
          </div>

          <p className="mt-2 inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {judge.country}
          </p>
        </div>
      </div>

      <div className="relative mt-4 border-t border-gray-100 pt-4">
        {!canViewSensitive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border border-white/50 bg-white/40 backdrop-blur-sm">
            <p className="max-w-xs px-4 text-center text-xs font-medium text-gray-500">
              {t("lockedMessage")}
            </p>
          </div>
        )}

        <dl className={`space-y-1.5 text-sm ${!canViewSensitive ? "select-none blur-sm" : ""}`}>
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
          <div className="mt-4 space-y-3">
            {judge.certifications && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  {t("certifications")}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{judge.certifications}</p>
              </div>
            )}
            {judge.history && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  {t("history")}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{judge.history}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {canViewSensitive && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-hover"
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
    </article>
  );
}
