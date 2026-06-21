import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AsiaMap from "@/components/map/AsiaMap";

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
      {/* Page hero */}
      <div className="page-hero">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="IAC Network"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="page-hero-content text-center">
          <p className="section-label text-amber-300">World IAC Asia</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container-main">
          <AsiaMap />
        </div>
      </section>
    </>
  );
}
