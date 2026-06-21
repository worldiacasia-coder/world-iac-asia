"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-white/60 bg-white/30 text-xs font-semibold uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`px-2.5 py-1.5 transition-colors duration-200 ${
            locale === loc
              ? "bg-brand-gold text-white"
              : "text-gray-500 hover:bg-white/40 hover:text-gray-900"
          }`}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
