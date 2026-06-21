import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import AuthForm from "@/components/auth/AuthForm";

type Props = {
  params: { locale: string };
  searchParams: { redirect?: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("title") };
}

export default async function AuthPage({ params: { locale }, searchParams }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const session = await getSession();

  if (session) {
    const target = searchParams.redirect ?? "/";
    redirect({ href: target.startsWith("/") ? target : `/${target}`, locale });
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1571104508999-893933ded431?w=1920&q=80"
        alt="Restaurant background"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Form centered */}
      <div className="relative z-10 flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="section-label text-amber-300">World IAC Asia</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
              {t("title")}
            </h1>
            <div className="mx-auto mt-3 h-0.5 w-10 bg-brand-gold" />
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t("subtitle")}</p>
          </div>
          <AuthForm redirectTo={searchParams.redirect ?? "/"} />
        </div>
      </div>
    </div>
  );
}
