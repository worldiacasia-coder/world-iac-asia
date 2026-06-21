import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HeroSlider from "@/components/home/HeroSlider";
import NewsSlider from "@/components/home/NewsSlider";
import PartnerCardSlider from "@/components/home/PartnerCardSlider";
import prisma from "@/lib/prisma";

type Props = { params: { locale: string } };

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tP = await getTranslations("president");
  const tPA = await getTranslations("presidentAsia");

  const partnerCards = await prisma.partnerCard.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const stats = [
    { n: "10", l: t("statCountries") },
    { n: "5", l: t("statStars") },
    { n: "100+", l: t("statMembers") },
    { n: "50+", l: t("statJudges") },
  ];

  return (
    <>
      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Stats bar ── */}
      <section className="border-y border-white/50 bg-white/60 backdrop-blur-lg">
        <div className="container-main grid grid-cols-2 divide-x divide-white/40 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.l} className="px-6 py-8 text-center first:pl-4 last:pr-4">
              <p className="font-display text-3xl font-semibold text-brand-gold lg:text-4xl">
                {stat.n}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                {stat.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chủ tịch World IAC ── */}
      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Ảnh chủ tịch */}
            <div className="img-zoom glass-panel overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/simone-falcini.png"
                  alt="Chef Simone Falcini — World President of World IAC"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg font-semibold text-white drop-shadow">
                    Chef Simone Falcini
                  </p>
                  <p className="mt-0.5 text-sm text-white/80 drop-shadow">
                    World President — World IAC
                  </p>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div>
              <p className="section-label">{tP("label")}</p>
              <h2 className="mt-3 section-title">{tP("title")}</h2>
              <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
              <p className="mt-6 text-base leading-relaxed text-gray-500">{tP("p1")}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">{tP("p2")}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">{tP("p3")}</p>

              {/* CTA sang trang giám khảo */}
              <div className="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
                  {tP("ctaLabel")}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-gray-900">
                  {tP("ctaTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {tP("ctaDesc")}
                </p>
                <Link href="/judges" className="btn-primary mt-4 inline-flex">
                  {tP("ctaBtn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chủ tịch World IAC Châu Á ── */}
      <section className="section section-alt">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Nội dung — trái */}
            <div>
              <p className="section-label">{tPA("label")}</p>
              <h2 className="mt-3 section-title">{tPA("title")}</h2>
              <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
              <p className="mt-6 text-base leading-relaxed text-gray-500">{tPA("p1")}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">{tPA("p2")}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">{tPA("p3")}</p>

              {/* CTA sang bản đồ */}
              <div className="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-gold-light p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
                  {tPA("ctaLabel")}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-gray-900">
                  {tPA("ctaTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {tPA("ctaDesc")}
                </p>
                <Link href="/map" className="btn-primary mt-4 inline-flex">
                  {tPA("ctaBtn")}
                </Link>
              </div>
            </div>

            {/* Ảnh — phải */}
            <div className="img-zoom glass-panel overflow-hidden rounded-3xl">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/tran-le-thanh-thien.png"
                  alt="Chef Trần Lê Thanh Thiện — President of World IAC Asia"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg font-semibold text-white drop-shadow">
                    Chef Trần Lê Thanh Thiện
                  </p>
                  <p className="mt-0.5 text-sm text-white/80 drop-shadow">
                    President — World IAC Asia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-3xl">
            <p className="section-label">{t("heroBadge")}</p>
            <h2 className="mt-3 section-title">{t("missionTitle")}</h2>
            <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
            <p className="mt-6 text-base leading-relaxed text-gray-500">{t("missionP1")}</p>
            <p className="mt-4 text-base leading-relaxed text-gray-500">{t("missionP2")}</p>
            <Link href="/map" className="btn-primary mt-8 inline-flex">
              {t("ctaMap")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Full-width image divider ── */}
      <section className="relative h-64 overflow-hidden md:h-80 lg:h-96">
        <Image
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1920&q=80"
          alt="Chef at work"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <p className="section-label text-amber-300">{t("heroBadge")}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h2>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold mx-auto" />
        </div>
      </section>

      {/* ── News Slider ── */}
      <section className="section section-alt">
        <div className="container-main">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t("newsTitle")}</h2>
              <div className="mt-3 h-0.5 w-10 bg-brand-gold" />
            </div>
          </div>
          <NewsSlider />
        </div>
      </section>

      {/* ── Đối tác — auto-scroll cards ── */}
      <section className="section">
        <div className="container-main">
          <div className="mb-8">
            <p className="section-label">{t("heroBadge")}</p>
            <h2 className="mt-3 section-title">{t("partnersTitle")}</h2>
            <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          </div>
        </div>
        <PartnerCardSlider cards={partnerCards} />
      </section>

      {/* ── CTA section ── */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Restaurant ambiance"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-main py-24 text-center">
          <p className="section-label text-amber-300">{t("heroBadge")}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">
            {t("ctaRegister")}
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-brand-gold" />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/members#apply" className="btn-primary">
              {t("ctaRegister")}
            </Link>
            <Link
              href="/judges"
              className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              Xem giám khảo →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
