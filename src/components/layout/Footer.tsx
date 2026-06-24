import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ROUTES, SITE } from "@/lib/constants";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=60"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gray-950/88 backdrop-blur-sm" />
      </div>

      <div className="relative z-10">
        <div className="container-main grid gap-12 py-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex flex-col items-start gap-4">
              <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
                <Image
                  src="/images/world-iac-asia-logo.png"
                  alt="WORLD IAC ASIA"
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-white md:text-base">
                  {SITE.name}
                </p>
                <p className="mt-1 text-sm text-white/50">{SITE.org}</p>
              </div>
            </div>
            <div className="mt-5 h-px w-10 bg-brand-gold" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {t("addressLabel")}: {SITE.address}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              {t("links")}
            </p>
            <ul className="mt-5 space-y-2.5">
              {NAV_ROUTES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-brand-gold"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/auth" className="text-sm text-white/60 transition-colors hover:text-brand-gold">
                  {t("authLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              {t("contact")}
            </p>
            <div className="mt-5 space-y-3">
              <p className="text-sm text-white/60">
                {t("tel")}:{" "}
                <a href={`tel:${SITE.phone}`} className="text-white/80 hover:text-brand-gold">
                  {SITE.phone}
                </a>
              </p>
              <p className="text-sm text-white/60">
                {t("email")}:{" "}
                <a href={`mailto:${SITE.email}`} className="text-white/80 hover:text-brand-gold">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-white/30">
          {tCommon("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
