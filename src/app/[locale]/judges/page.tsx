import { getTranslations, setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getSession, canViewSensitiveData, isAdmin } from "@/lib/auth";
import { isCountryRep } from "@/lib/roles";
import JudgeCard from "@/components/judges/JudgeCard";
import JudgesHero from "@/components/judges/JudgesHero";
import JudgeCourseRegistrationForm from "@/components/judges/JudgeCourseRegistrationForm";
import AdminJudgePanel from "@/components/admin/AdminJudgePanel";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "judges" });
  return { title: t("title") };
}

export default async function JudgesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const session = await getSession();
  const t = await getTranslations("judges");
  const canView = canViewSensitiveData(session?.role);
  const admin = isAdmin(session?.role);
  const judges = await prisma.judge.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <JudgesHero
        showLogin={!session}
        showCountryRepNotice={Boolean(session && isCountryRep(session.role))}
      />

      <section className="section">
        <div className="container-main space-y-12">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <section className="section section-alt">
        <div className="container-main">
          <p className="section-label">WORLD IAC ASIA</p>
          <h2 className="mt-3 section-title">{t("courseSectionTitle")}</h2>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            {t("courseSectionDesc")}
          </p>
          <div className="mt-10">
            <JudgeCourseRegistrationForm />
          </div>
        </div>
      </section>
    </>
  );
}
