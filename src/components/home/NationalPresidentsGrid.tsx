"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { nationalPresidents } from "@/data/national-presidents";

export default function NationalPresidentsGrid() {
  const t = useTranslations("nationalPresidents");

  return (
    <section className="section section-alt">
      <div className="container-main">
        <p className="section-label">{t("label")}</p>
        <h2 className="mt-3 section-title">{t("title")}</h2>
        <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">{t("subtitle")}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nationalPresidents.map((p) => (
            <article key={p.id} className="glass-panel overflow-hidden p-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={t(p.nameKey)}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-sm font-semibold text-white">{t(p.nameKey)}</p>
                  <p className="mt-0.5 text-xs text-white/75">{t(p.titleKey)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-gray-600 line-clamp-6">{t(p.bioKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
