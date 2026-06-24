"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ImageSlider from "@/components/ui/ImageSlider";
import { judgeCourseSlides } from "@/data/national-presidents";

type Props = {
  showLogin: boolean;
  showCountryRepNotice: boolean;
};

export default function JudgesHero({ showLogin, showCountryRepNotice }: Props) {
  const t = useTranslations("judges");

  const slides = judgeCourseSlides.map((s) => ({
    id: s.id,
    image: s.image,
    alt: s.alt,
  }));

  return (
    <section className="relative min-h-[420px] w-full overflow-hidden md:min-h-[520px] lg:min-h-[560px]">
      {/* Slider làm nền */}
      <div className="absolute inset-0">
        <ImageSlider
          slides={slides}
          aspectClass="h-full min-h-[420px] md:min-h-[520px] lg:min-h-[560px]"
          rounded={false}
          showCaptions={false}
          showControls
        />
      </div>

      {/* Lớp phủ tối để chữ đọc rõ */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Nội dung phía trên nền slider */}
      <div className="relative z-10 flex min-h-[420px] items-center md:min-h-[520px] lg:min-h-[560px]">
        <div className="container-main py-16 md:py-20">
          <p className="section-label text-amber-300">WORLD IAC ASIA</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {t("subtitle")}
          </p>
          {showLogin && (
            <Link
              href={{ pathname: "/auth", query: { redirect: "/judges" } }}
              className="btn-primary mt-8 inline-flex"
            >
              {t("loginCta")}
            </Link>
          )}
          {showCountryRepNotice && (
            <p className="mt-6 max-w-xl rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm text-white/90 backdrop-blur-sm">
              {t("countryRepNotice")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
