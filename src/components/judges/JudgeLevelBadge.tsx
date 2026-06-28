"use client";

import { useTranslations } from "next-intl";
import type { JudgeLevel } from "@/lib/judge-level";

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4 16.5V19h16v-2.5l-1.2-7.2-3.3 2.6-2.5-5.1-2.5 5.1-3.3-2.6L4 16.5zm2.1 1.5l.6-3.6 2.2 1.7 1.7-3.4 1.7 3.4 2.2-1.7.6 3.6H6.1z" />
    </svg>
  );
}

function TraineeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3L1 9l4 2.2V17h14v-5.8L23 9 12 3zm0 2.8l6.9 3.8L12 13.4 5.1 9.6 12 5.8zM7 17v-4.2l5 2.8 5-2.8V17H7z" />
    </svg>
  );
}

type IconProps = {
  level: JudgeLevel;
  size?: "sm" | "md";
  className?: string;
};

export function JudgeLevelAvatarBadge({ level, size = "md", className = "" }: IconProps) {
  const dim = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (level === "chief") {
    return (
      <span
        className={`inline-flex ${dim} items-center justify-center rounded-full bg-brand-gold text-white shadow-md ring-2 ring-white ${className}`}
        title="Chief judge"
      >
        <CrownIcon className={icon} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex ${dim} items-center justify-center rounded-full bg-slate-600 text-white shadow-md ring-2 ring-white ${className}`}
      title="Trainee judge"
    >
      <TraineeIcon className={icon} />
    </span>
  );
}

export function JudgeLevelLabel({ level }: { level: JudgeLevel }) {
  const t = useTranslations("judges");

  if (level === "chief") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold-light px-2.5 py-0.5 text-xs font-semibold text-brand-gold">
        <CrownIcon className="h-3.5 w-3.5" />
        {t("levelChief")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      <TraineeIcon className="h-3.5 w-3.5" />
      {t("levelTrainee")}
    </span>
  );
}

export function JudgeLevelLegend() {
  const t = useTranslations("judges");

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{t("levelLegend")}</span>
      <JudgeLevelLabel level="chief" />
      <JudgeLevelLabel level="trainee" />
    </div>
  );
}
