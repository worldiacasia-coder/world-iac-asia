import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MembersDirectory from "@/components/members/MembersDirectory";
import MemberApplicationForm from "@/components/members/MemberApplicationForm";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "members" });
  return { title: t("title") };
}

export default async function MembersPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("members");

  return (
    <>
      {/* Page hero */}
      <div className="page-hero">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Members"
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

      {/* Đăng ký thành viên */}
      <section id="apply" className="section section-alt">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Giới thiệu */}
            <div className="flex flex-col justify-center">
              <p className="section-label">World IAC Asia</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-gray-900 md:text-4xl">
                {t("applyTitle")}
              </h2>
              <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
              <p className="mt-5 text-base leading-relaxed text-gray-500">{t("applyDesc1")}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">{t("applyDesc2")}</p>

              {/* Quy trình */}
              <div className="mt-8 space-y-4">
                {[
                  { step: "01", text: t("step1") },
                  { step: "02", text: t("step2") },
                  { step: "03", text: t("step3") },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <p className="pt-1.5 text-sm leading-relaxed text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <MemberApplicationForm />
          </div>
        </div>
      </section>

      {/* Danh sách hội viên */}
      <section className="section">
        <div className="container-main">
          <h2 className="section-title">{t("title")}</h2>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="section-subtitle">{t("subtitle")}</p>
          <div className="mt-10">
            <MembersDirectory />
          </div>
        </div>
      </section>
    </>
  );
}
