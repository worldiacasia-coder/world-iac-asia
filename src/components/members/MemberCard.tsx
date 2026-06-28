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
    <article className={`group glass-panel overflow-hidden p-0 ${expired ? "opacity-60" : ""}`}>
      {/* Photo */}
      <div className="img-zoom relative aspect-[1/1] w-full overflow-hidden">
        <Image
          src={member.avatarUrl}
          alt={member.name}
          fill
          className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 ${expired ? "grayscale" : ""}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Expired badge */}
        {expired && (
          <div className="absolute right-3 top-3 rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            {t("expired")}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-gray-900 leading-tight">
          {member.name}
        </h3>
        <p className="mt-0.5 font-mono text-xs text-gray-400">{member.memberCode}</p>
        {member.jobTitle && (
          <p className="mt-1 text-sm font-medium text-brand-gold">{member.jobTitle}</p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{member.country}</p>
          <p className="text-xs text-gray-400">
            {t("expires")}: {formatDate(member.expirationDate, dateLocale)}
          </p>
        </div>
      </div>
    </article>
  );
}
