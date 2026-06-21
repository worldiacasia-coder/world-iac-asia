import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import TrainingForm from "@/components/training/TrainingForm";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "training" });
  return { title: t("title") };
}

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
];

export default async function TrainingPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("training");
  const courses = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      {/* Page hero */}
      <div className="page-hero">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="Culinary training"
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

      {/* Courses + form */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
            {/* Course cards */}
            <div className="space-y-6">
              {courses.length === 0 ? (
                <p className="text-gray-500">Chưa có khóa học.</p>
              ) : (
                courses.map((course, i) => (
                  <article
                    key={course.id}
                    className="group glass-panel overflow-hidden p-0 md:flex"
                  >
                    <div className="img-zoom relative aspect-video shrink-0 overflow-hidden md:aspect-auto md:h-auto md:w-52 lg:w-64">
                      <Image
                        src={COURSE_IMAGES[i % COURSE_IMAGES.length]}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:bg-gradient-to-b" />
                    </div>
                    <div className="flex flex-col justify-center p-6">
                      <h2 className="font-display text-xl font-semibold text-gray-900">
                        {course.name}
                      </h2>
                      <div className="mt-2 h-px w-8 bg-brand-gold" />
                      <p className="mt-3 text-sm leading-relaxed text-gray-500">
                        {course.description}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Registration form */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <TrainingForm courses={courses} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
