"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { NationalPresident } from "@/data/national-presidents";

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
  president: NationalPresident | null;
  countryName: string;
  onClose: () => void;
};

export default function OrgModal({ org, president, countryName, onClose }: Props) {
  const t = useTranslations("map");
  const tPres = useTranslations("nationalPresidents");
  const tCommon = useTranslations("common");

  if (!org && !president) return null;

  const presidentName = president ? tPres(president.nameKey) : org?.representative;
  const presidentTitle = president ? tPres(president.titleKey) : null;
  const presidentBio = president ? tPres(president.bioKey) : null;
  const presidentImage = president?.image ?? org?.logoUrl;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="my-4 w-full max-w-lg rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            {org && (
              <Image
                src={org.flagUrl}
                alt={countryName}
                width={36}
                height={24}
                className="rounded border border-gray-200"
                unoptimized
              />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{countryName}</p>
              <p className="text-sm font-medium text-gray-500">{org?.orgName ?? `World IAC ${countryName}`}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label={tCommon("close")}
          >
            ✕
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
          {/* Ảnh chủ tịch */}
          {presidentImage && (
            <div className="relative mx-auto h-56 w-44 overflow-hidden rounded-2xl border border-gray-200 shadow-md">
              <Image
                src={presidentImage}
                alt={presidentName ?? countryName}
                fill
                className="object-cover object-top"
                sizes="176px"
              />
            </div>
          )}

          <div className="mt-5 text-center">
            <h2 className="font-display text-xl font-semibold text-gray-900">{presidentName}</h2>
            {presidentTitle && (
              <p className="mt-1 text-sm font-medium text-brand-gold">{presidentTitle}</p>
            )}
          </div>

          {presidentBio && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t("biography")}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{presidentBio}</p>
            </div>
          )}

          {org && (
            <dl className="mt-6 space-y-4 border-t border-gray-100 pt-6 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t("address")}</dt>
                <dd className="mt-1 text-gray-700">{org.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t("phone")}</dt>
                <dd className="mt-1 text-gray-700">
                  <a href={`tel:${org.phone}`} className="hover:text-brand-gold">{org.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t("email")}</dt>
                <dd className="mt-1 text-gray-700">
                  <a href={`mailto:${org.email}`} className="hover:text-brand-gold">{org.email}</a>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
