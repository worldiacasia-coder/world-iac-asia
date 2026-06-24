import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HeroSlider from "@/components/home/HeroSlider";
import NewsHighlightSection from "@/components/home/NewsHighlightSection";
import PartnerCardSlider from "@/components/home/PartnerCardSlider";
import prisma from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { getHomeNewsItems } from "@/lib/news-defaults";

type Props = { params: { locale: string } };

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tP = await getTranslations("president");
  const tPA = await getTranslations("presidentAsia");
  const partnerCards = await prisma.partnerCard.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const newsItems = await getHomeNewsItems();

  const stats = [
    { n: "13", l: t("statCountries") },
    { n: "5", l: t("statStars") },
    { n: "100+", l: t("statMembers") },
    { n: "50+", l: t("statJudges") },
  ];

  return (
    <>
      <HeroSlider />

      <section className="border-y border-white/50 bg-white/60 backdrop-blur-lg">
        <div className="container-main grid grid-cols-2 divide-x divide-white/40 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.l} className="px-6 py-8 text-center first:pl-4 last:pr-4">
              <p className="font-display text-3xl font-semibold text-brand-gold lg:text-4xl">{stat.n}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-gray-500">{stat.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global President */}
      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="img-zoom glass-panel overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/leadership/simone-falcini.jpg"
                  alt="Chef Simone Falcini"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg font-semibold text-white drop-shadow">Chef Simone Falcini</p>
                  <p className="mt-0.5 text-sm text-white/80 drop-shadow">{tP("role")}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="section-label">{tP("label")}</p>
              <h2 className="mt-3 section-title">{tP("title")}</h2>
              <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
              <p className="mt-6 text-base leading-relaxed text-gray-500">{tP("p1")}</p>
              <blockquote className="mt-6 border-l-4 border-brand-gold pl-4 text-base italic leading-relaxed text-gray-600">
                {tP("quote")}
              </blockquote>
              <div className="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-6">
                <h3 className="font-display text-xl font-semibold text-gray-900">{tP("ctaTitle")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{tP("ctaDesc")}</p>
                <a
                  href={SITE.worldIacUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 inline-flex"
                >
                  {tP("ctaBtn")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asia President */}
      <section className="section section-alt">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-label">{tPA("label")}</p>
              <h2 className="mt-3 section-title">{tPA("title")}</h2>
              <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
              <p className="mt-6 text-base leading-relaxed text-gray-500">{tPA("p1")}</p>
              <Link href="/map" className="btn-primary mt-8 inline-flex">{tPA("ctaBtn")}</Link>
            </div>
            <div className="img-zoom glass-panel overflow-hidden rounded-3xl">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/leadership/tran-le-thanh-thien.jpg"
                  alt="Tran Le Thanh Thien"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg font-semibold text-white drop-shadow">Tran Le Thanh Thien</p>
                  <p className="mt-0.5 text-sm text-white/80 drop-shadow">{tPA("role")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsHighlightSection
        items={newsItems.map((item) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          imageUrl: item.imageUrl,
          slug: item.slug,
          link: item.link,
        }))}
      />

      <section className="section section-alt">
        <div className="container-main max-w-3xl">
          <p className="section-label">{t("heroBadge")}</p>
          <h2 className="mt-3 section-title">{t("missionTitle")}</h2>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-6 text-base leading-relaxed text-gray-500">{t("missionP1")}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">{t("missionP2")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-main">
          <div className="mb-8">
            <h2 className="section-title">{t("partnersTitle")}</h2>
            <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          </div>
        </div>
        <PartnerCardSlider cards={partnerCards} />
      </section>
    </>
  );
}
