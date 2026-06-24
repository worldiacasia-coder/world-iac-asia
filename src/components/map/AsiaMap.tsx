"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { COUNTRY_CODE_BY_PIN_ID, MAP_BASE, iacMapPins } from "@/data/map-pins";
import { getPresidentByCountryCode, type NationalPresident } from "@/data/national-presidents";
import MapPinButton from "./MapPinButton";
import OrgModal, { type OrganizationData } from "./OrgModal";

export default function AsiaMap() {
  const t = useTranslations("map");
  const tCountries = useTranslations("countries");
  const tPres = useTranslations("nationalPresidents");

  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    org: OrganizationData | null;
    president: NationalPresident | null;
    name: string;
    flagUrl: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((data) => setOrganizations(data.organizations ?? []));
  }, []);

  const getOrg = useCallback(
    (countryCode: string) => organizations.find((o) => o.countryId === countryCode),
    [organizations]
  );

  function handlePinClick(countryCode: string) {
    const org = getOrg(countryCode) ?? null;
    const president = getPresidentByCountryCode(countryCode) ?? null;
    const pin = iacMapPins.find((p) => COUNTRY_CODE_BY_PIN_ID[p.id] === countryCode);
    if (org || president) {
      setSelected({
        org,
        president,
        name: tCountries(countryCode),
        flagUrl: org?.flagUrl ?? pin?.flagUrl ?? null,
      });
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="relative w-full overflow-hidden glass-panel p-0">
        <Image
          src={MAP_BASE.image}
          alt={t("ariaLabel")}
          width={MAP_BASE.width}
          height={MAP_BASE.height}
          className="block h-auto w-full select-none"
          priority
        />

        <div className="pointer-events-none absolute inset-0">
          {iacMapPins.map((pin) => {
            const countryCode = COUNTRY_CODE_BY_PIN_ID[pin.id] ?? "";
            const org = getOrg(countryCode);
            const president = getPresidentByCountryCode(countryCode);
            const hasData = Boolean(org || president);
            const countryName = tCountries(countryCode);
            const presidentName = president ? tPres(president.nameKey) : org?.representative;

            return (
              <MapPinButton
                key={pin.id}
                pin={pin}
                isHovered={hoveredPinId === pin.id}
                isActive={selected?.name === countryName}
                hasOrg={hasData}
                ariaLabel={`${countryName}${presidentName ? ` — ${presidentName}` : ""}`}
                onHover={setHoveredPinId}
                onClick={() => handlePinClick(countryCode)}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">{t("mapPinHint")}</p>

      <OrgModal
        org={selected?.org ?? null}
        president={selected?.president ?? null}
        countryName={selected?.name ?? ""}
        flagUrl={selected?.flagUrl ?? null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
