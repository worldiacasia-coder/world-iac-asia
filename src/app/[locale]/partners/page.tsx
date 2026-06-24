import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import PartnerCardSlider from "@/components/home/PartnerCardSlider";
import PartnerMarquee from "@/components/partners/PartnerMarquee";
import ContactForm from "@/components/partners/ContactForm";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "partners" });
  return { title: t("title") };
}

export default async function PartnersPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("partners");
  const partnerCards = await prisma.partnerCard.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      {/* Page hero */}
      <div className="page-hero">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
          alt="Restaurant partners"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="page-hero-content">
          <p className="section-label text-amber-300">World IAC Asia</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Partner cards — ảnh công nhận / lợi ích */}
      <section className="section section-alt">
        <div className="container-main mb-8">
          <h2 className="section-title">{t("cardsTitle")}</h2>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-2xl text-base text-gray-500">{t("cardsSubtitle")}</p>
        </div>
        <PartnerCardSlider cards={partnerCards} emptyMessage={t("cardsEmpty")} />
      </section>

      {/* Partners marquee — logo đối tác */}
      <section className="py-10">
        <div className="container-main mb-6">
          <h2 className="font-display text-xl font-semibold text-gray-900">{t("logosTitle")}</h2>
        </div>
        <PartnerMarquee emptyMessage={t("logosEmpty")} />
      </section>

      {/* Editorial divider image */}
      <div className="relative h-56 overflow-hidden md:h-72">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
          alt="Partner event"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <p className="font-display text-2xl font-semibold text-white md:text-3xl">
            {t("contactInfo")}
          </p>
        </div>
      </div>

      {/* Contact section */}
      <section className="section">
        <div className="container-main">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
