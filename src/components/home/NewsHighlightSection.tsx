"use client";

import { useTranslations } from "next-intl";
import NewsSlider from "@/components/home/NewsSlider";

export default function NewsHighlightSection() {
  const t = useTranslations("home");

  return (
    <section className="section section-alt">
      <div className="container-main">
        <p className="section-label">{t("heroBadge")}</p>
        <h2 className="mt-3 section-title">{t("newsTitle")}</h2>
        <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">{t("iacIntroDesc")}</p>
        <div className="mt-8">
          <NewsSlider />
        </div>
      </div>
    </section>
  );
}
