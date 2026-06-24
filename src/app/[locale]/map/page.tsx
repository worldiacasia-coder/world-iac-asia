import { getTranslations, setRequestLocale } from "next-intl/server";
import AsiaMap from "@/components/map/AsiaMap";
import MapNetworkHero from "@/components/map/MapNetworkHero";

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
      <MapNetworkHero title={t("title")} subtitle={t("advisorySubtitle")} />

      <section className="section section-alt !pt-0">
        <div className="container-main">
          <AsiaMap />
        </div>
      </section>
    </>
  );
}
