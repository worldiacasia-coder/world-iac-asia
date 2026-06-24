"use client";

import { useTranslations } from "next-intl";
import ImageSlider from "@/components/ui/ImageSlider";
import { advisoryBoardSlides } from "@/data/national-presidents";

export default function AdvisoryBoardSlider() {
  const t = useTranslations("map");

  const slides = advisoryBoardSlides.map((s) => ({
    id: s.id,
    image: s.image,
    alt: t(s.nameKey),
    caption: t(s.nameKey),
    subcaption: t(s.roleKey),
    objectPosition: s.objectPosition,
  }));

  return (
    <ImageSlider
      slides={slides}
      aspectClass="aspect-[16/9] min-h-[320px] md:min-h-[420px]"
      defaultObjectPosition="center 15%"
    />
  );
}
