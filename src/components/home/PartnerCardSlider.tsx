"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [paused, setPaused] = useState(false);

  if (cards.length === 0) {
    if (!emptyMessage) return null;
    return (
      <p className="px-4 text-center text-sm text-gray-500">{emptyMessage}</p>
    );
  }

  /* Nhân đôi để loop mượt */
  const doubled = [...cards, ...cards];
  /* Khoảng cần dịch chuyển để loop = 1 bộ cards */
  const scrollDist = cards.length * (CARD_W + GAP);

  return (
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
          /* CSS variable để keyframe dùng */
          ["--scroll-dist" as string]: `-${scrollDist}px`,
        }}
      >
        {doubled.map((card, i) => (
          <article
            key={`${card.id}-${i}`}
            className="group glass-panel shrink-0 overflow-hidden p-0"
            style={{ width: CARD_W }}
          >
            {/* Ảnh */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-base font-semibold text-white leading-tight">
                  {card.name}
                </p>
              </div>
            </div>

            {/* Mô tả */}
            <div className="p-5">
              <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">
                {card.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
