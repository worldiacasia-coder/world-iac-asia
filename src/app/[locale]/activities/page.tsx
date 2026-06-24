import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "activities" });
  return { title: t("title") };
}

export default async function ActivitiesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("activities");

  return (
    <>
      <div className="page-hero" style={{ minHeight: 280 }}>
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="IAC Activities"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="page-hero-content">
          <p className="section-label text-amber-300">WORLD IAC ASIA</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">{t("title")}</h1>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{t("subtitle")}</p>
        </div>
      </div>

      <section className="section">
        <div className="container-main max-w-3xl space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-gray-900">{t("question")}</h2>
            <div className="mt-3 h-px w-8 bg-brand-gold" />
            <p className="mt-4 text-base leading-relaxed text-gray-500">{t("answer")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/news" className="glass-panel block p-6 transition-all hover:bg-white/50">
              <p className="font-display text-lg font-semibold text-gray-900">{t("channelNewsTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("channelNewsDesc")}</p>
            </Link>
            <Link href="/partners" className="glass-panel block p-6 transition-all hover:bg-white/50">
              <p className="font-display text-lg font-semibold text-gray-900">{t("channelPartnersTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("channelPartnersDesc")}</p>
            </Link>
            <Link href="/map" className="glass-panel block p-6 transition-all hover:bg-white/50">
              <p className="font-display text-lg font-semibold text-gray-900">{t("channelMapTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("channelMapDesc")}</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
