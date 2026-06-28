"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MemberCard, { type MemberData } from "@/components/members/MemberCard";
import { MEMBER_COUNTRIES } from "@/lib/constants";

export default function MembersDirectory() {
  const t = useTranslations("members");
  const tCommon = useTranslations("common");
  const [members, setMembers] = useState<MemberData[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (country) params.set("country", country);

    setLoading(true);
    fetch(`/api/members?${params}`)
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, [query, country]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field flex-1 rounded-md"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="select-field rounded-md sm:w-48"
        >
          <option value="">{t("allCountries")}</option>
          {MEMBER_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">{tCommon("loading")}</p>
      ) : members.length === 0 ? (
        <p className="text-center text-gray-500">{t("notFound")}</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {t("memberCount", { count: members.length })}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
