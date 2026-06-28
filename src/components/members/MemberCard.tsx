import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { isMemberExpired, formatDate } from "@/lib/utils";

export type MemberData = {
  id: string;
  memberCode: string;
  name: string;
  avatarUrl: string;
  country: string;
  jobTitle: string;
  expirationDate: string | Date;
  paymentStatus: "paid" | "unpaid";
};

export default function MemberCard({ member }: { member: MemberData }) {
  const t = useTranslations("members");
  const locale = useLocale();
  const expired = isMemberExpired(member.expirationDate, member.paymentStatus);
  const dateLocale = locale === "vi" ? "vi-VN" : "en-US";

  return (
    <article
      className={`flex items-start gap-3 rounded-xl border border-white/70 bg-white/90 p-3 shadow-sm transition-shadow hover:shadow-md sm:gap-3.5 sm:p-4 ${
        expired ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-gold/25 sm:h-12 sm:w-12">
        <Image
          src={member.avatarUrl}
          alt={member.name}
          fill
          className={`object-cover object-top ${expired ? "grayscale" : ""}`}
          sizes="48px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-snug text-gray-900 sm:text-[15px]">
            {member.name}
          </h3>
          {expired && (
            <span className="shrink-0 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t("expired")}
            </span>
          )}
        </div>

        {member.jobTitle && (
          <p className="mt-0.5 text-xs font-medium text-brand-gold sm:text-sm">{member.jobTitle}</p>
        )}

        <p className="mt-0.5 truncate text-xs text-gray-500">{member.country}</p>

        <p className="mt-1 font-mono text-[10px] text-gray-400">{member.memberCode}</p>
        <p className="text-[10px] text-gray-400">
          {t("expires")}: {formatDate(member.expirationDate, dateLocale)}
        </p>
      </div>
    </article>
  );
}
