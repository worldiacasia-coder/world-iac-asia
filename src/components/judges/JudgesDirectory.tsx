"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import JudgeCard, { type JudgeData } from "@/components/judges/JudgeCard";
import { JudgeLevelLabel } from "@/components/judges/JudgeLevelBadge";
import { JUDGE_LEVELS, type JudgeLevel } from "@/lib/judge-level";
import AdminJudgePanel from "@/components/admin/AdminJudgePanel";

type Props = {
  judges: JudgeData[];
  canViewSensitive: boolean;
  admin?: boolean;
  adminStars?: { id: string; name: string; country: string; stars: number }[];
};

export default function JudgesDirectory({
  judges,
  canViewSensitive,
  admin = false,
  adminStars = [],
}: Props) {
  const t = useTranslations("judges");
  const [activeLevel, setActiveLevel] = useState<JudgeLevel | null>(null);

  const filtered = activeLevel
    ? judges.filter((j) => j.level === activeLevel)
    : judges;

  function toggleLevel(level: JudgeLevel) {
    setActiveLevel((prev) => (prev === level ? null : level));
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {t("judgeCount", { count: filtered.length })}
          {activeLevel && (
            <button
              type="button"
              onClick={() => setActiveLevel(null)}
              className="ml-2 text-brand-gold underline-offset-2 hover:underline"
            >
              {t("filterShowAll")}
            </button>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {t("levelLegend")}
          </span>
          {JUDGE_LEVELS.map((level) => {
            const selected = activeLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                aria-pressed={selected}
                className={`rounded-full transition-all ${
                  selected
                    ? "ring-2 ring-brand-gold ring-offset-2"
                    : activeLevel
                      ? "opacity-50 hover:opacity-100"
                      : "hover:ring-2 hover:ring-brand-gold/40 hover:ring-offset-1"
                }`}
              >
                <JudgeLevelLabel level={level} />
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center text-sm text-gray-500">
          {t("filterEmpty")}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((judge) => (
            <JudgeCard key={judge.id} judge={judge} canViewSensitive={canViewSensitive} />
          ))}
        </div>
      )}

      {admin && <AdminJudgePanel judges={adminStars} />}
    </div>
  );
}
