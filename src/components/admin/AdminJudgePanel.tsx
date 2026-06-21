"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import StarRating from "@/components/ui/StarRating";

type Judge = {
  id: string;
  name: string;
  country: string;
  stars: number;
};

export default function AdminJudgePanel({ judges }: { judges: Judge[] }) {
  const t = useTranslations("judges");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [localStars, setLocalStars] = useState<Record<string, number>>(
    Object.fromEntries(judges.map((j) => [j.id, j.stars]))
  );

  async function saveStars(judgeId: string) {
    setSaving(judgeId);
    const res = await fetch("/api/judges/stars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ judgeId, stars: localStars[judgeId] }),
    });
    setSaving(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="card mt-12 border-brand-gold/20 bg-white/25">
      <h2 className="font-display text-xl font-semibold text-gray-900">{t("adminTitle")}</h2>
      <div className="mt-2 h-0.5 w-8 bg-brand-gold" />
      <p className="mt-3 text-sm text-gray-500">{t("adminSubtitle")}</p>
      <div className="mt-8 space-y-4">
        {judges.map((judge) => (
          <div
            key={judge.id}
            className="card-compact flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div>
              <p className="font-medium text-gray-900">{judge.name}</p>
              <p className="text-sm text-gray-500">{judge.country}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setLocalStars((prev) => ({ ...prev, [judge.id]: star }))
                    }
                    className={`text-xl transition-colors ${
                      star <= (localStars[judge.id] ?? 1) ? "star-active" : "star-inactive"
                    }`}
                    aria-label={`${star} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <StarRating stars={localStars[judge.id] ?? 1} size="sm" />
              <button
                type="button"
                onClick={() => saveStars(judge.id)}
                disabled={saving === judge.id}
                className="btn-primary btn-sm"
              >
                {saving === judge.id ? "..." : tCommon("save")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
