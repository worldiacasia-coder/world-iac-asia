import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getSession, canViewSensitiveData, isAdmin } from "@/lib/auth";
import JudgeCard from "@/components/judges/JudgeCard";
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
      {/* Page hero with background image */}
      <div className="page-hero">
        <Image
          src="https://images.unsplash.com/photo-1571104508999-893933ded431?w=1920&q=80"
          alt="Culinary judges"
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
          {!session && (
            <Link
              href={{ pathname: "/auth", query: { redirect: "/judges" } }}
              className="btn-primary mt-6 inline-flex"
            >
              {t("loginCta")}
            </Link>
          )}
        </div>
      </div>

      {/* Judges grid */}
      <section className="section">
        <div className="container-main">
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
            <div className="mt-16">
              <AdminJudgePanel
                judges={judges.map((j) => ({
                  id: j.id,
                  name: j.name,
                  country: j.country,
                  stars: j.stars,
                }))}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
