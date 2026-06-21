import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <div className="section">
      <div className="container-main flex flex-col items-center py-16 text-center">
        <p className="font-display text-7xl font-semibold text-brand-gold">404</p>
        <h1 className="mt-6 font-display text-2xl font-semibold text-gray-900">
          {t("notFoundTitle")}
        </h1>
        <div className="mt-4 h-0.5 w-8 bg-brand-gold" />
        <Link href="/" className="btn-primary mt-10">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
