"use client";

import { useTranslations } from "next-intl";
import { JUDGE_LEVELS, type JudgeLevel } from "@/lib/judge-level";

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4 16.5V19h16v-2.5l-1.2-7.2-3.3 2.6-2.5-5.1-2.5 5.1-3.3-2.6L4 16.5zm2.1 1.5l.6-3.6 2.2 1.7 1.7-3.4 1.7 3.4 2.2-1.7.6 3.6H6.1z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2c1.7 0 3.3.5 4.6 1.4L12 10.9 7.4 5.4A8 8 0 0112 4zm-6.6 2.9L10.9 12 5.4 16.6A8 8 0 015.4 6.9zM4 12c0-.7.1-1.4.3-2.1L9.1 12l-4.8 2.1A8 8 0 014 12zm2.9 6.6L12 13.1l4.6 5.5A8 8 0 016.9 18.6zM12 20a8 8 0 01-4.6-1.4L12 13.1l4.6 5.5A8 8 0 0112 20zm6.6-2.9L13.1 12l5.5-4.6a8 8 0 010 9.2zM20 12c0 .7-.1 1.4-.3 2.1L14.9 12l4.8-2.1c.2.7.3 1.4.3 2.1z" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5 3v18h2V13h4.2l.8 2h7V5h-6.2l-.8-2H5zm2 2h4.8l.8 2H18v6h-4.8l-.8-2H7V5z" />
    </svg>
  );
}

function AsiaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2c1.5 0 2.9.4 4.1 1.1L12 11.2 7.9 5.1A8 8 0 0112 4zm-5.5 2.6L11.2 12 6.5 16.7A8 8 0 016.5 6.6zM4 12c0-.9.2-1.8.5-2.6L10 12l-5.5 2.6c-.3-.8-.5-1.7-.5-2.6zm2.5 5.4L12 12.8l5.5 4.6A8 8 0 016.5 17.4zM12 20a8 8 0 01-4.1-1.1L12 12.8l4.1 6.1A8 8 0 0112 20zm5.5-2.6L12.8 12l4.7-4.7a8 8 0 010 9.5zM20 12c0 .9-.2 1.8-.5 2.6L14 12l5.5-2.6c.3.8.5 1.7.5 2.6z" />
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

const LEVEL_STYLE: Record<
  JudgeLevel,
  { badge: string; label: string; Icon: typeof CrownIcon }
> = {
  international: {
    badge: "bg-brand-gold text-white",
    label: "border-brand-gold/40 bg-brand-gold-light text-brand-gold",
    Icon: GlobeIcon,
  },
  national: {
    badge: "bg-sky-700 text-white",
    label: "border-sky-300 bg-sky-50 text-sky-800",
    Icon: FlagIcon,
  },
  asia_regional: {
    badge: "bg-emerald-700 text-white",
    label: "border-emerald-300 bg-emerald-50 text-emerald-800",
    Icon: AsiaIcon,
  },
  trainee: {
    badge: "bg-slate-600 text-white",
    label: "border-slate-300 bg-slate-100 text-slate-600",
    Icon: TraineeIcon,
  },
};

const LEVEL_I18N: Record<JudgeLevel, "levelInternational" | "levelNational" | "levelAsiaRegional" | "levelTrainee"> = {
  international: "levelInternational",
  national: "levelNational",
  asia_regional: "levelAsiaRegional",
  trainee: "levelTrainee",
};

type IconProps = {
  level: JudgeLevel;
  size?: "sm" | "md";
  className?: string;
};

export function JudgeLevelAvatarBadge({ level, size = "md", className = "" }: IconProps) {
  const dim = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const style = LEVEL_STYLE[level] ?? LEVEL_STYLE.international;
  const { Icon } = style;

  return (
    <span
      className={`inline-flex ${dim} items-center justify-center rounded-full shadow-md ring-2 ring-white ${style.badge} ${className}`}
    >
      <Icon className={icon} />
    </span>
  );
}

export function JudgeLevelLabel({ level }: { level: JudgeLevel }) {
  const t = useTranslations("judges");
  const style = LEVEL_STYLE[level] ?? LEVEL_STYLE.international;
  const { Icon } = style;
  const key = LEVEL_I18N[level] ?? "levelInternational";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.label}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {t(key)}
    </span>
  );
}

export function JudgeLevelLegend() {
  const t = useTranslations("judges");

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{t("levelLegend")}</span>
      {JUDGE_LEVELS.map((level) => (
        <JudgeLevelLabel key={level} level={level} />
      ))}
    </div>
  );
}

export function judgeLevelAccent(level: JudgeLevel): {
  border: string;
  ring: string;
} {
  switch (level) {
    case "international":
      return { border: "border-brand-gold/35", ring: "ring-brand-gold/50" };
    case "national":
      return { border: "border-sky-300/60", ring: "ring-sky-400/50" };
    case "asia_regional":
      return { border: "border-emerald-300/60", ring: "ring-emerald-400/50" };
    default:
      return { border: "border-white/70", ring: "ring-slate-300/80" };
  }
}
