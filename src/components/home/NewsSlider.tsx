"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CardSlider from "@/components/ui/CardSlider";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  link?: string | null;
};

export default function NewsSlider() {
  const t = useTranslations("home");
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setItems(d.news ?? []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <CardSlider>
      {items.map((item) => (
        <article
          key={item.id}
          className="group glass-panel shrink-0 overflow-hidden p-0"
          style={{ width: "clamp(280px, 38vw, 400px)" }}
        >
          <div className="img-zoom relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-brand-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              {t("newsBadge")}
            </span>
          </div>
          <div className="p-6">
            <h3 className="font-display text-xl font-semibold text-gray-900 line-clamp-2 leading-snug">
              {item.title}
            </h3>
            <div className="mt-3 h-px w-8 bg-brand-gold" />
            <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">
              {item.excerpt}
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-hover"
              >
                Đọc thêm
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </article>
      ))}
    </CardSlider>
  );
}
