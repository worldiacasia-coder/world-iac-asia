export type HeaderFlag = {
  id: string;
  name: string;
  flagUrl: string;
};

/** Thứ tự: Ý – Việt Nam – Đài Loan – Ấn Độ – Indonesia – Malaysia – Singapore – Sri Lanka – Philippines – Hàn Quốc – Thái Lan – Campuchia – China */
export const headerFlags: HeaderFlag[] = [
  { id: "italy", name: "Italy", flagUrl: "/flags/italy.svg" },
  { id: "vietnam", name: "Vietnam", flagUrl: "/flags/vietnam.png" },
  { id: "taiwan", name: "Taiwan", flagUrl: "/flags/taiwan.png" },
  { id: "india", name: "India", flagUrl: "/flags/india.png" },
  { id: "indonesia", name: "Indonesia", flagUrl: "/flags/indonesia.png" },
  { id: "malaysia", name: "Malaysia", flagUrl: "/flags/malaysia.png" },
  { id: "singapore", name: "Singapore", flagUrl: "/flags/singapore.png" },
  { id: "sri-lanka", name: "Sri Lanka", flagUrl: "/flags/sri-lanka.png" },
  { id: "philippines", name: "Philippines", flagUrl: "/flags/philippines.png" },
  { id: "korea", name: "South Korea", flagUrl: "/flags/korea.png" },
  { id: "thailand", name: "Thailand", flagUrl: "/flags/thailand.png" },
  { id: "cambodia", name: "Cambodia", flagUrl: "/flags/cambodia.png" },
  { id: "china", name: "China", flagUrl: "/flags/china.svg" },
];
