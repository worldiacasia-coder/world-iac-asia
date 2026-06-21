"use client";

import { useRef, useState, useCallback } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleRight?: React.ReactNode;
};

export default function CardSlider({ children, className = "", title, titleRight }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = trackRef.current;
      if (!el) return;
      const amount = el.clientWidth * 0.75;
      el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
      setTimeout(updateButtons, 400);
    },
    [updateButtons]
  );

  return (
    <div className={className}>
      {(title || titleRight) && (
        <div className="mb-6 flex items-end justify-between gap-4">
          {title && (
            <h2 className="font-display text-2xl font-semibold text-gray-900 md:text-3xl">
              {title}
            </h2>
          )}
          <div className="flex items-center gap-2">
            {titleRight}
            {/* Arrow buttons */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div
        ref={trackRef}
        onScroll={updateButtons}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
