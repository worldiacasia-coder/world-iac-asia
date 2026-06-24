"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NewsSlider, { type NewsSliderItem } from "@/components/home/NewsSlider";

type Props = {
  items: NewsSliderItem[];
};

export default function NewsHighlightSection({ items }: Props) {
  const t = useTranslations("home");

  return (
    <section className="section section-alt">
      <div className="container-main">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">{t("heroBadge")}</p>
            <h2 className="mt-3 section-title">{t("newsTitle")}</h2>
            <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">{t("iacIntroDesc")}</p>
          </div>
          <Link href="/news" className="btn-outline btn-sm shrink-0">
            {t("viewAllNews")}
          </Link>
        </div>
        <div className="mt-8">
          <NewsSlider items={items} />
        </div>
      </div>
    </section>
  );
}
