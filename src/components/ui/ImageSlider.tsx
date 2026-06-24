"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

type Slide = {
  id: string;
  image: string;
  alt: string;
  caption?: string;
  subcaption?: string;
  objectPosition?: string;
};

type Props = {
  slides: Slide[];
  aspectClass?: string;
  intervalMs?: number;
  rounded?: boolean;
  showCaptions?: boolean;
  showControls?: boolean;
  /** Mặc định căn ảnh — dùng center top cho ảnh chân dung */
  defaultObjectPosition?: string;
};

export default function ImageSlider({
  slides,
  aspectClass = "aspect-[21/9]",
  intervalMs = 5000,
  rounded = true,
  showCaptions = true,
  showControls = true,
  defaultObjectPosition = "center center",
}: Props) {
  const [active, setActive] = useState(0);

  const goTo = useCallback((idx: number) => {
    setActive((idx + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(active + 1), intervalMs);
    return () => clearInterval(timer);
  }, [active, goTo, intervalMs, slides.length]);

  if (!slides.length) return null;

  const slide = slides[active];

  return (
    <div className={`relative w-full overflow-hidden ${rounded ? "rounded-3xl" : ""} ${aspectClass}`}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            className="object-cover"
            style={{ objectPosition: s.objectPosition ?? defaultObjectPosition }}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {(slide.caption || slide.subcaption) && showCaptions && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {slide.caption && (
            <p className="font-display text-xl font-semibold text-white md:text-2xl">{slide.caption}</p>
          )}
          {slide.subcaption && (
            <p className="mt-1 text-sm text-white/80 md:text-base">{slide.subcaption}</p>
          )}
        </div>
      )}
      {slides.length > 1 && showControls && (
        <>
          <div className="absolute bottom-4 right-4 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-white" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
