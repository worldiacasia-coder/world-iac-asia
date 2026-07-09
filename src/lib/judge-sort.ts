import { JUDGE_LEVELS, type JudgeLevel } from "@/lib/judge-level";

export type JudgeSortable = {
  level: JudgeLevel;
  sortOrder: number;
  name: string;
};

const levelRank: Record<JudgeLevel, number> = {
  international: 0,
  asia_regional: 1,
  national: 2,
  trainee: 3,
};

export function compareJudges(a: JudgeSortable, b: JudgeSortable): number {
  const levelDiff = levelRank[a.level] - levelRank[b.level];
  if (levelDiff !== 0) return levelDiff;
  const orderDiff = a.sortOrder - b.sortOrder;
  if (orderDiff !== 0) return orderDiff;
  return a.name.localeCompare(b.name);
}

export function sortJudges<T extends JudgeSortable>(judges: T[]): T[] {
  return [...judges].sort(compareJudges);
}

export type JudgesByLevel<T> = Record<JudgeLevel, T[]>;

export function groupJudgesByLevel<T extends JudgeSortable & { id: string }>(
  judges: T[]
): JudgesByLevel<T> {
  const sorted = sortJudges(judges);
  return Object.fromEntries(
    JUDGE_LEVELS.map((level) => [level, sorted.filter((j) => j.level === level)])
  ) as JudgesByLevel<T>;
}
