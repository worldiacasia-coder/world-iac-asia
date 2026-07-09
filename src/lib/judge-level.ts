export const JUDGE_LEVELS = [
  "international",
  "asia_regional",
  "national",
  "trainee",
] as const;

export type JudgeLevel = (typeof JUDGE_LEVELS)[number];

/** Legacy DB value `chief` maps to international. */
export function parseJudgeLevel(value: unknown): JudgeLevel {
  if (value === "national") return "national";
  if (value === "asia_regional") return "asia_regional";
  if (value === "trainee") return "trainee";
  return "international";
}

export function addJudgeYears(from: Date, years = 3): Date {
  const next = new Date(from);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

export function defaultJudgeExpiration(from: Date = new Date()): Date {
  return addJudgeYears(from, 3);
}
