"use client";

import { useTranslations } from "next-intl";
import ImageSlider from "@/components/ui/ImageSlider";
import { judgeCourseSlides } from "@/data/national-presidents";

export default function JudgeCourseSlider() {
  const t = useTranslations("judges");

  const slides = judgeCourseSlides.map((s) => ({
    id: s.id,
    image: s.image,
    alt: s.alt,
    caption: s.id === "poster" ? t("coursePosterTitle") : t("regulationsTitle"),
    subcaption: s.id === "poster" ? t("coursePosterDesc") : t("regulationsDesc"),
  }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-gray-900 md:text-3xl">
          {t("courseSectionTitle")}
        </h2>
        <div className="mt-3 h-px w-10 bg-brand-gold" />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
          {t("courseSectionDesc")}
        </p>
      </div>
      <ImageSlider slides={slides} aspectClass="aspect-[16/9] md:aspect-[21/9] min-h-[280px] md:min-h-[360px]" />
    </div>
  );
}
