export const JUDGE_LEVELS = ["chief", "trainee"] as const;
export type JudgeLevel = (typeof JUDGE_LEVELS)[number];

export function parseJudgeLevel(value: unknown): JudgeLevel {
  return value === "trainee" ? "trainee" : "chief";
}
