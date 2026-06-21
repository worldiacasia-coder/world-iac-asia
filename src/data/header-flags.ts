export type HeaderFlag = {
  id: string;
  name: string;
  flagUrl: string;
};

export const headerFlags: HeaderFlag[] = [
  { id: "italy", name: "Italy", flagUrl: "/flags/italy.svg" },
  { id: "vietnam", name: "Vietnam", flagUrl: "/flags/vietnam.png" },
  { id: "laos", name: "Laos", flagUrl: "/flags/laos.svg" },
  { id: "thailand", name: "Thailand", flagUrl: "/flags/thailand.png" },
  { id: "korea", name: "Korea", flagUrl: "/flags/korea.png" },
  { id: "singapore", name: "Singapore", flagUrl: "/flags/singapore.png" },
  { id: "philippines", name: "Philippines", flagUrl: "/flags/philippines.png" },
  { id: "taiwan", name: "Taiwan", flagUrl: "/flags/taiwan.png" },
  { id: "malaysia", name: "Malaysia", flagUrl: "/flags/malaysia.png" },
  { id: "indonesia", name: "Indonesia", flagUrl: "/flags/indonesia.png" },
];
