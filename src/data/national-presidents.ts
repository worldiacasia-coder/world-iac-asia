export type NationalPresident = {
  id: string;
  image: string;
  nameKey: string;
  titleKey: string;
  bioKey: string;
};

/** Ánh xạ mã quốc gia (pin trên bản đồ) → id chủ tịch */
export const COUNTRY_CODE_TO_PRESIDENT_ID: Record<string, string> = {
  VN: "vietnam",
  KR: "south-korea",
  TW: "taiwan",
  PH: "philippines",
  SG: "singapore",
  ID: "indonesia",
  IN: "india",
  MY: "malaysia",
};

export const nationalPresidents: NationalPresident[] = [
  { id: "vietnam", image: "/images/leadership/tran-le-thanh-thien.jpg", nameKey: "vietnamName", titleKey: "vietnamTitle", bioKey: "vietnamBio" },
  { id: "philippines", image: "/images/leadership/arwin-gragasin.png", nameKey: "philippinesName", titleKey: "philippinesTitle", bioKey: "philippinesBio" },
  { id: "singapore", image: "/images/leadership/judy-koh.jpg", nameKey: "singaporeName", titleKey: "singaporeTitle", bioKey: "singaporeBio" },
  { id: "indonesia", image: "/images/leadership/roy-lesmana.jpg", nameKey: "indonesiaName", titleKey: "indonesiaTitle", bioKey: "indonesiaBio" },
  { id: "india", image: "/images/leadership/kaninika.jpg", nameKey: "indiaName", titleKey: "indiaTitle", bioKey: "indiaBio" },
  { id: "sri-lanka", image: "/images/leadership/chamodh-peiris.jpg", nameKey: "sriLankaName", titleKey: "sriLankaTitle", bioKey: "sriLankaBio" },
  { id: "south-korea", image: "/images/leadership/dong-yeon-park.jpg", nameKey: "southKoreaName", titleKey: "southKoreaTitle", bioKey: "southKoreaBio" },
  { id: "malaysia", image: "/images/leadership/william-surianath.jpg", nameKey: "malaysiaName", titleKey: "malaysiaTitle", bioKey: "malaysiaBio" },
  { id: "taiwan", image: "/images/leadership/ho-chen-hsiung.jpg", nameKey: "taiwanName", titleKey: "taiwanTitle", bioKey: "taiwanBio" },
];

export function getPresidentByCountryCode(countryCode: string): NationalPresident | undefined {
  const id = COUNTRY_CODE_TO_PRESIDENT_ID[countryCode];
  if (!id) return undefined;
  return nationalPresidents.find((p) => p.id === id);
}

export const advisoryBoardSlides = [
  { id: "simone", image: "/images/leadership/simone-falcini.jpg", nameKey: "simoneName", roleKey: "simoneRole", objectPosition: "center 18%" },
  { id: "thien", image: "/images/leadership/tran-le-thanh-thien.jpg", nameKey: "thienName", roleKey: "thienRole", objectPosition: "center 12%" },
  { id: "trinh", image: "/images/leadership/trinh-le-thanh.jpg", nameKey: "trinhName", roleKey: "trinhRole", objectPosition: "center 10%" },
  { id: "judy", image: "/images/leadership/judy-koh.jpg", nameKey: "judyName", roleKey: "judyRole", objectPosition: "center 15%" },
  { id: "roy", image: "/images/leadership/roy-lesmana.jpg", nameKey: "royName", roleKey: "royRole", objectPosition: "center 20%" },
];

export const judgeCourseSlides = [
  { id: "poster", image: "/images/logos/world-iac-5stars.jpg", alt: "IAC Judge Course" },
  { id: "regulations-1", image: "/images/leadership/simone-falcini.jpg", alt: "Judge regulations" },
  { id: "regulations-2", image: "/images/leadership/tran-le-thanh-thien.jpg", alt: "Judge standards" },
];
