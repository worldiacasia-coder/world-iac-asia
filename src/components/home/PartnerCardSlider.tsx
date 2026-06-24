"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export type PartnerCardData = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type Props = {
  cards: PartnerCardData[];
  emptyMessage?: string;
};

const CARD_W = 340;
const GAP = 20;

export default function PartnerCardSlider({ cards, emptyMessage }: Props) {
  const t = useTranslations("partners");
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<PartnerCardData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  if (cards.length === 0) {
    if (!emptyMessage) return null;
    return <p className="px-4 text-center text-sm text-gray-500">{emptyMessage}</p>;
  }

  const doubled = [...cards, ...cards];
  const scrollDist = cards.length * (CARD_W + GAP);

  return (
    <>
      <div
        className="overflow-hidden px-4 py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex"
          style={{
            gap: GAP,
            animationName: "partner-scroll",
            animationDuration: `${cards.length * 3}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
            ["--scroll-dist" as string]: `-${scrollDist}px`,
          }}
        >
          {doubled.map((card, i) => (
            <button
              key={`${card.id}-${i}`}
              type="button"
              onClick={() => setSelected(card)}
              className="group glass-panel shrink-0 overflow-hidden p-0 text-left transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              style={{ width: CARD_W }}
              aria-label={`${t("cardViewDetail")}: ${card.name}`}
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-base font-semibold leading-tight text-white">
                    {card.name}
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {card.description}
                </p>
                <p className="mt-3 text-xs font-medium text-brand-gold">{t("cardClickHint")}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {mounted &&
        selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="my-4 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selected.imageUrl}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="448px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
                  aria-label={t("cardClose")}
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-display text-xl font-semibold text-white">{selected.name}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-gray-600">{selected.description}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
