"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export type OrganizationData = {
  countryId: string;
  orgName: string;
  logoUrl: string;
  flagUrl: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
};

type Props = {
  org: OrganizationData | null;
  countryName: string;
  onClose: () => void;
};

export default function OrgModal({ org, countryName, onClose }: Props) {
  const t = useTranslations("map");
  const tCommon = useTranslations("common");

  if (!org) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-white/50 pb-6">
          <div className="flex items-center justify-center gap-3">
            <Image
              src={org.flagUrl}
              alt={countryName}
              width={40}
              height={28}
              className="rounded border border-white/50"
            />
            <p className="text-sm font-medium text-brand-gold">{countryName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-400 transition-colors hover:text-gray-900"
            aria-label={tCommon("close")}
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <Image
            src={org.logoUrl}
            alt={org.orgName}
            width={112}
            height={112}
            className="h-28 w-28 rounded-full border-2 border-white/60 object-cover shadow-sm"
          />
        </div>

        <h2 className="mt-5 text-center font-display text-xl font-semibold text-gray-900">{org.orgName}</h2>

        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("representative")}
            </dt>
            <dd className="mt-1 text-gray-900">{org.representative}</dd>
          </div>
          <hr className="divider" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("biography")}
            </dt>
            <dd className="mt-1 text-gray-600">{org.address}</dd>
          </div>
          <hr className="divider" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("information")}
            </dt>
            <dd className="mt-1 text-gray-600">{`${org.phone} • ${org.email}`}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
