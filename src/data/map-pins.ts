export interface MapPin {
  id: string;
  countryName: string;
  label: string;
  flagUrl: string;
  top: string;
  left: string;
}

export const iacMapPins: MapPin[] = [
  {
    id: "korea",
    countryName: "Korea",
    label: "World IAC Asia - Korea",
    flagUrl: "/flags/korea.png",
    top: "24.2%",
    left: "78.1%",
  },
  {
    id: "taiwan",
    countryName: "Taiwan",
    label: "World IAC Asia - Taiwan",
    flagUrl: "/flags/taiwan.png",
    top: "44.9%",
    left: "82%",
  },
  {
    id: "vietnam",
    countryName: "Vietnam",
    label: "World IAC Asia - Viet Nam",
    flagUrl: "/flags/vietnam.png",
    top: "54.3%",
    left: "64%",
  },
  {
    id: "philippines",
    countryName: "Philippines",
    label: "World IAC Asia - Philippine",
    flagUrl: "/flags/philippines.png",
    top: "60.1%",
    left: "84%",
  },
  {
    id: "thailand",
    countryName: "Thailand",
    label: "World IAC Asia - Thailand",
    flagUrl: "/flags/thailand.png",
    top: "58%",
    left: "45.7%",
  },
  {
    id: "cambodia",
    countryName: "Cambodia",
    label: "World IAC Asia - Cambodia",
    flagUrl: "/flags/cambodia.png",
    top: "68.8%",
    left: "46%",
  },
  {
    id: "malaysia",
    countryName: "Malaysia",
    label: "World IAC Asia - Malaysia",
    flagUrl: "/flags/malaysia.png",
    top: "77.1%",
    left: "45.6%",
  },
  {
    id: "singapore",
    countryName: "Singapore",
    label: "World IAC Asia - Singapore",
    flagUrl: "/flags/singapore.png",
    top: "70.3%",
    left: "58.7%",
  },
  {
    id: "indonesia",
    countryName: "Indonesia",
    label: "World IAC Asia - Indonesia",
    flagUrl: "/flags/indonesia.png",
    top: "88%",
    left: "46.2%",
  },
  {
    id: "india",
    countryName: "India",
    label: "World IAC Asia - India",
    flagUrl: "/flags/india.png",
    top: "65.6%",
    left: "26.4%",
  },
];

export const MAP_BASE = {
  image: "/images/iac-network-map.png",
  width: 1024,
  height: 724,
} as const;

export const COUNTRY_CODE_BY_PIN_ID: Record<string, string> = {
  korea: "KR",
  taiwan: "TW",
  vietnam: "VN",
  philippines: "PH",
  thailand: "TH",
  cambodia: "KH",
  malaysia: "MY",
  singapore: "SG",
  indonesia: "ID",
  india: "IN",
};

export function getPinById(id: string): MapPin | undefined {
  return iacMapPins.find((pin) => pin.id === id);
}
