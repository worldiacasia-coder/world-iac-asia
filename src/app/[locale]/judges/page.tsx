import { getTranslations, setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getSession, canViewSensitiveData, isAdmin } from "@/lib/auth";
import { isCountryRep } from "@/lib/roles";
import JudgeCard from "@/components/judges/JudgeCard";
import JudgeCourseSlider from "@/components/judges/JudgeCourseSlider";
import AdminJudgePanel from "@/components/admin/AdminJudgePanel";
import { Link } from "@/i18n/navigation";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "judges" });
  return { title: t("title") };
}

export default async function JudgesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("judges");
  const session = await getSession();
  const canView = canViewSensitiveData(session?.role);
  const admin = isAdmin(session?.role);
  const judges = await prisma.judge.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      {/* Khóa giám khảo IAC — slider thay ảnh bìa hero */}
      <section className="border-b border-white/50 bg-white/40 pt-8 pb-12 lg:pt-10">
        <div className="container-main space-y-8">
          <div>
            <p className="section-label">WORLD IAC ASIA</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
              {t("subtitle")}
            </p>
            {!session && (
              <Link
                href={{ pathname: "/auth", query: { redirect: "/judges" } }}
                className="btn-primary mt-6 inline-flex"
              >
                {t("loginCta")}
              </Link>
            )}
            {session && isCountryRep(session.role) && (
              <p className="mt-6 max-w-2xl rounded-xl border border-brand-gold/30 bg-brand-gold-light px-4 py-3 text-sm text-gray-600">
                {t("countryRepNotice")}
              </p>
            )}
          </div>

          <JudgeCourseSlider />
        </div>
      </section>

      {/* Danh sách giám khảo */}
      <section className="section">
        <div className="container-main space-y-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {judges.map((judge) => (
              <JudgeCard
                key={judge.id}
                judge={{
                  id: judge.id,
                  name: judge.name,
                  avatarUrl: judge.avatarUrl,
                  title: judge.title,
                  country: judge.country,
                  stars: judge.stars,
                  phone: judge.phone,
                  email: judge.email,
                  certifications: judge.certifications,
                  history: judge.history,
                }}
                canViewSensitive={canView}
              />
            ))}
          </div>

          {admin && (
            <AdminJudgePanel
              judges={judges.map((j) => ({
                id: j.id,
                name: j.name,
                country: j.country,
                stars: j.stars,
              }))}
            />
          )}
        </div>
      </section>
    </>
  );
}
