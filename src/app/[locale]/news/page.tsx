import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getHomeNewsItems } from "@/lib/news-defaults";
import NewsHighlightSection from "@/components/home/NewsHighlightSection";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "newsPage" });
  return { title: t("title") };
}

export default async function NewsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("newsPage");
  const newsItems = await getHomeNewsItems();

  return (
    <>
      <div className="page-hero" style={{ minHeight: 280 }}>
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt="News"
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

      <section className="section">
        <div className="container-main grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article key={item.id} className="glass-panel overflow-hidden p-0 transition-all hover:shadow-lg">
              {item.slug ? (
                <Link href={`/news/${item.slug}`} className="block">
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="400px" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold text-gray-900 transition-colors hover:text-brand-gold">
                      {item.title}
                    </h2>
                    <div className="mt-3 h-px w-8 bg-brand-gold" />
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">{item.excerpt}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="400px" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold text-gray-900">{item.title}</h2>
                    <div className="mt-3 h-px w-8 bg-brand-gold" />
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{item.excerpt}</p>
                  </div>
                </>
              )}
            </article>
          ))}
          {newsItems.length === 0 && (
            <p className="text-gray-500 md:col-span-3">{t("empty")}</p>
          )}
        </div>
      </section>
    </>
  );
}
