import { getTranslations, setRequestLocale } from "next-intl/server";
import AsiaMap from "@/components/map/AsiaMap";
import AdvisoryBoardSlider from "@/components/map/AdvisoryBoardSlider";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "map" });
  return { title: t("title") };
}

export default async function MapPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("map");

  return (
    <>
      {/* Ban cố vấn — slider thay hero tĩnh */}
      <section className="section !pt-8">
        <div className="container-main space-y-8">
          <div className="text-center">
            <p className="section-label">WORLD IAC ASIA</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-gray-900 md:text-4xl">{t("title")}</h1>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-brand-gold" />
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">{t("advisorySubtitle")}</p>
          </div>
          <AdvisoryBoardSlider />
        </div>
      </section>

      <section className="section section-alt !pt-0">
        <div className="container-main">
          <AsiaMap />
        </div>
      </section>
    </>
  );
}
