"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { COUNTRY_CODE_BY_PIN_ID, MAP_BASE, iacMapPins } from "@/data/map-pins";
import MapPinButton from "./MapPinButton";
import OrgModal, { type OrganizationData } from "./OrgModal";

export default function AsiaMap() {
  const t = useTranslations("map");
  const tCountries = useTranslations("countries");

  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    org: OrganizationData;
    name: string;
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
    const org = getOrg(countryCode);
    if (org) {
      setSelected({ org, name: tCountries(countryCode) });
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
            const countryName = tCountries(countryCode);

            return (
              <MapPinButton
                key={pin.id}
                pin={pin}
                isHovered={hoveredPinId === pin.id}
                isActive={selected?.org.countryId === countryCode}
                hasOrg={Boolean(org)}
                ariaLabel={`${countryName} - ${org?.orgName ?? t("noData")}`}
                onHover={setHoveredPinId}
                onClick={() => handlePinClick(countryCode)}
              />
            );
          })}
        </div>
      </div>

      <OrgModal
        org={selected?.org ?? null}
        countryName={selected?.name ?? ""}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
