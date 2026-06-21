"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function LogoutButton() {
  const t = useTranslations("header");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="btn-primary px-4 py-2 text-xs">
      {t("logout")}
    </button>
  );
}
