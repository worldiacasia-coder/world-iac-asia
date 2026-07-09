"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import {
  JudgeLevelAvatarBadge,
  JudgeLevelLabel,
  judgeLevelAccent,
} from "@/components/judges/JudgeLevelBadge";
import type { JudgeLevel } from "@/lib/judge-level";
import { formatDate, isJudgeExpired } from "@/lib/utils";

export type JudgeData = {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  country: string;
  stars: number;
  level: JudgeLevel;
  phone?: string;
  email?: string;
  certifications?: string;
  history?: string;
  expirationDate: string | Date;
  paymentStatus: "paid" | "unpaid";
};

type Props = {
  judge: JudgeData;
  canViewSensitive: boolean;
};

export default function JudgeCard({ judge, canViewSensitive }: Props) {
  const t = useTranslations("judges");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const expired = isJudgeExpired(judge.expirationDate, judge.paymentStatus);
  const accent = judgeLevelAccent(judge.level);
  const dateLocale = locale === "vi" ? "vi-VN" : "en-US";

  return (
    <article
      className={`rounded-2xl border bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${accent.border} ${
        expired ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative shrink-0">
          <div
            className={`relative h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32 ${accent.ring} ring-2 ${
              expired ? "opacity-60 grayscale" : ""
            }`}
          >
            <Image
              src={judge.avatarUrl}
              alt={judge.name}
              fill
              className="object-cover object-top"
              sizes="128px"
            />
          </div>
          <div className="absolute -right-0.5 -top-0.5">
            <JudgeLevelAvatarBadge level={judge.level} />
          </div>
        </div>

        <div className="mt-4 w-full min-w-0">
          <div className="flex flex-col items-center gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h3 className="font-display text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                  {judge.name}
                </h3>
                {expired && (
                  <span className="shrink-0 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {t("expired")}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium text-brand-gold">{judge.title}</p>
            </div>
            <StarRating stars={judge.stars} readOnly size="sm" />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <JudgeLevelLabel level={judge.level} />
            <p className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {judge.country}
            </p>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            {t("expires")}: {formatDate(judge.expirationDate, dateLocale)}
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
