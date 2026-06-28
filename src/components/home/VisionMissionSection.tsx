import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { pickHomeContentText, type HomeContentData } from "@/lib/home-content";

type Props = {
  content: HomeContentData;
  locale: string;
};

export default async function VisionMissionSection({ content, locale }: Props) {
  const t = await getTranslations("home");
  const { vision, mission, values } = pickHomeContentText(content, locale);

  return (
    <section className="section section-alt">
      <div className="container-main">
        {/* Banner 1920×640 — tỉ lệ 3:1 */}
        <div className="relative mb-12 aspect-[3/1] w-full overflow-hidden rounded-3xl glass-panel">
          {content.bannerImageUrl ? (
            <Image
              src={content.bannerImageUrl}
              alt={t("visionMissionBannerAlt")}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-50/60">
              <p className="text-sm text-gray-400">{t("imagePlaceholder")}</p>
            </div>
          )}
        </div>

        <p className="section-label">{t("heroBadge")}</p>
        <h2 className="mt-3 section-title">{t("visionMissionTitle")}</h2>
        <div className="mt-4 h-0.5 w-12 bg-brand-gold" />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Cột trái: Tầm nhìn + Giá trị */}
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-xl font-semibold text-gray-900 md:text-2xl">
                {t("visionTitle")}
              </h3>
              <div className="mt-3 h-0.5 w-8 bg-brand-gold/60" />
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-500">{vision}</p>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-gray-900 md:text-2xl">
                {t("valuesTitle")}
              </h3>
              <div className="mt-3 h-0.5 w-8 bg-brand-gold/60" />
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-500">
                {values}
              </p>
            </div>
          </div>

          {/* Cột phải: Sứ mệnh + ảnh */}
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-xl font-semibold text-gray-900 md:text-2xl">
                {t("missionBlockTitle")}
              </h3>
              <div className="mt-3 h-0.5 w-8 bg-brand-gold/60" />
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-500">{mission}</p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl glass-panel">
              {content.sideImageUrl ? (
                <Image
                  src={content.sideImageUrl}
                  alt={t("valuesImageAlt")}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-50 via-white to-amber-50/50 px-6 text-center">
                  <p className="text-sm text-gray-400">{t("imagePlaceholder")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
