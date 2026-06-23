import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ROUTES } from "@/lib/constants";
import type { SessionUser } from "@/lib/auth";
import { isAdmin, isCountryRep } from "@/lib/roles";
import LogoutButton from "@/components/auth/LogoutButton";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import HeaderFlagStrip from "@/components/layout/HeaderFlagStrip";

type Props = { user: SessionUser | null };

export default async function Header({ user }: Props) {
  const t = await getTranslations("header");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <header className="glass-header">
      {/* Main row */}
      <div className="container-main flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="relative block h-14 w-14 sm:h-16 sm:w-16">
            <Image
              src="/images/world-iac-asia-logo.png"
              alt="World IAC Asia"
              fill
              sizes="64px"
              className="object-contain"
              priority
            />
          </span>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-bold leading-tight tracking-wide text-[#1a4b8c] md:text-xl">
              {t("brandOrg")}
            </p>
            <p className="mt-0.5 text-xs font-normal tracking-widest text-gray-400/80">
              {t("brandShort")}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ROUTES.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {tNav(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link
                href="/auth"
                className="hidden text-sm text-gray-600 transition-colors hover:text-brand-gold sm:inline"
              >
                {user.fullName}
                {isAdmin(user.role) && (
                  <span className="ml-2 rounded-full border border-white/60 bg-white/30 px-1.5 py-0.5 text-xs font-medium text-brand-gold backdrop-blur-sm">
                    {tCommon("admin")}
                  </span>
                )}
                {isCountryRep(user.role) && (
                  <span className="ml-2 rounded-full border border-white/60 bg-white/30 px-1.5 py-0.5 text-xs font-medium text-blue-700 backdrop-blur-sm">
                    {tCommon("countryRep")}
                  </span>
                )}
              </Link>
              {isAdmin(user.role) && (
                <Link href="/admin" className="btn-outline btn-sm hidden sm:inline-flex">
                  {tCommon("admin")}
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link href="/auth" className="btn-primary btn-sm">
              {t("login")}
            </Link>
          )}
        </div>
      </div>

      {/* Flag strip — desktop */}
      <div className="container-main hidden justify-center pb-3 lg:flex">
        <HeaderFlagStrip />
      </div>

      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-white/40 px-4 py-2 lg:hidden"
        style={{ scrollbarWidth: "none" }}>
        {NAV_ROUTES.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-white/40 hover:text-brand-gold"
          >
            {tNav(link.key)}
          </Link>
        ))}
      </nav>

      {/* Flag strip — mobile */}
      <div className="container-main flex justify-center border-t border-white/30 px-4 py-2 lg:hidden">
        <HeaderFlagStrip className="max-w-none" />
      </div>
    </header>
  );
}
