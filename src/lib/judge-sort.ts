import type { JudgeLevel } from "@/lib/judge-level";

export type JudgeSortable = {
  level: JudgeLevel;
  sortOrder: number;
  name: string;
};

const levelRank: Record<JudgeLevel, number> = { chief: 0, trainee: 1 };

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

export function groupJudgesByLevel<T extends JudgeSortable & { id: string }>(
  judges: T[]
): { chief: T[]; trainee: T[] } {
  const sorted = sortJudges(judges);
  return {
    chief: sorted.filter((j) => j.level === "chief"),
    trainee: sorted.filter((j) => j.level === "trainee"),
  };
}
