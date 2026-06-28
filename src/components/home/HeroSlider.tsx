"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SLIDES = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=85",
    alt: "Professional chef plating a dish",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85",
    alt: "Fine dining restaurant",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1571104508999-893933ded431?w=1920&q=85",
    alt: "Culinary arts and competition",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1920&q=85",
    alt: "Professional kitchen",
  },
];

export default function HeroSlider() {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setActive(idx);
      setTimeout(() => setAnimating(false), 800);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((active + 1) % SLIDES.length);
  }, [active, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden lg:h-[90vh]">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover object-center ${i === active ? "hero-slide-img" : ""}`}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-main">
          <div className="max-w-xl">
            <p
              key={`badge-${active}`}
              className="animate-fade-in section-label text-amber-300"
            >
              {t("heroBadge")}
            </p>
            <h1
              key={`title-${active}`}
              className="animate-fade-in animation-delay-200 mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
            >
              {t("heroTitle")}
            </h1>
            <div
              key={`line-${active}`}
              className="animate-fade-in animation-delay-400 mt-5 h-1 w-16 bg-brand-gold"
            />
            <p
              key={`sub-${active}`}
              className="animate-fade-in animation-delay-400 mt-6 max-w-md text-base leading-relaxed text-white/85 md:text-lg"
            >
              {t("heroSubtitle")}
            </p>
            <div
              key={`cta-${active}`}
              className="animate-fade-in animation-delay-600 mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/map"
                className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                {t("ctaNetwork")}
              </Link>
              <Link href="/judges" className="btn-primary">
                {t("ctaJudges")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-10 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        type="button"
        onClick={() => goTo((active - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 lg:left-8"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goTo((active + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 lg:right-8"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-10 font-mono text-xs text-white/60">
        {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
