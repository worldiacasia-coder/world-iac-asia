import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import prisma from "@/lib/prisma";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params: { slug } }: Props) {
  const item = await prisma.newsItem.findUnique({ where: { slug } });
  if (!item) return { title: "News" };
  return {
    title: item.title,
    description: item.metaDesc ?? item.excerpt,
  };
}

export default async function NewsArticlePage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("newsPage");
  const item = await prisma.newsItem.findUnique({ where: { slug } });
  if (!item) notFound();

  return (
    <>
      <div className="page-hero" style={{ minHeight: 320 }}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="page-hero-content">
          <p className="section-label text-amber-300">WORLD IAC ASIA</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {item.title}
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-brand-gold" />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85">{item.excerpt}</p>
        </div>
      </div>

      <section className="section">
        <div className="container-main max-w-3xl">
          <Link href="/news" className="text-sm font-medium text-brand-gold hover:text-brand-gold-hover">
            {t("backToNews")}
          </Link>
          {item.content ? (
            <div
              className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-600"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="mt-8 text-base leading-relaxed text-gray-600">{item.excerpt}</p>
          )}
        </div>
      </section>
    </>
  );
}
