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
      {/* Background image */}
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

      {/* Content */}
      <div className="relative z-10">
        <div className="container-main grid gap-12 py-16 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0">
                <Image
                  src="/images/world-iac-asia-logo.png"
                  alt="World IAC Asia"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-white">{SITE.name}</p>
                <p className="text-sm text-white/50">{SITE.org}</p>
              </div>
            </div>
            <div className="mt-5 h-px w-10 bg-brand-gold" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{SITE.address}</p>
          </div>

          {/* Navigation */}
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
                <Link
                  href="/auth"
                  className="text-sm text-white/60 transition-colors hover:text-brand-gold"
                >
                  {t("authLink")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
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

            {/* Flag icons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["vietnam", "korea", "taiwan", "thailand", "singapore", "malaysia", "indonesia", "philippines", "india", "cambodia"].map(
                (flag) => (
                  <div
                    key={flag}
                    className="relative h-5 w-7 overflow-hidden rounded-sm opacity-60 transition-opacity hover:opacity-100"
                  >
                    <Image
                      src={`/flags/${flag}.png`}
                      alt={flag}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/30">
          {tCommon("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
