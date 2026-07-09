export const NAV_ROUTES = [
  { href: "/", key: "home" },
  { href: "/map", key: "network" },
  { href: "/judges", key: "judges" },
  { href: "/members", key: "members" },
  { href: "/news", key: "news" },
  { href: "/partners", key: "partners" },
] as const;

export const SITE = {
  name: "WORLD INDEPENDENT ASSOCIATION OF CHEFS – ASIA",
  org: "WORLD IAC ASIA",
  tagline: "A member of WORLD IAC",
  email: "asia@world-iac.com",
  phone: "+84 975 575 449",
  address: "135/28 Nguyen Huu Canh, Ward 22, Binh Thanh, Ho Chi Minh City, Vietnam",
  worldIacUrl: "https://www.world-iac.com/",
  memberShirtFormUrl: "https://forms.gle/knbEiLjBTr4fnzLX8",
} as const;

/** Danh sách quốc gia châu Á (dùng cho hội viên & giám khảo). */
export const ASIA_COUNTRIES = [
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "China",
  "Cyprus",
  "Georgia",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Israel",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Lebanon",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Myanmar",
  "Nepal",
  "North Korea",
  "Oman",
  "Pakistan",
  "Palestine",
  "Philippines",
  "Qatar",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Sri Lanka",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Timor-Leste",
  "Turkey",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
] as const;

export const MEMBER_COUNTRIES = ASIA_COUNTRIES;

/** Quốc gia cho form giám khảo: châu Á đầy đủ + Italy (khu vực Ý). */
export const JUDGE_COUNTRIES = [...ASIA_COUNTRIES, "Italy"].sort((a, b) =>
  a.localeCompare(b)
) as readonly string[];

const ERROR_KEY_MAP: Record<string, string> = {
  "Email không hợp lệ": "invalidEmail",
  "Vui lòng nhập mật khẩu": "passwordRequired",
  "Email hoặc mật khẩu không đúng": "invalidCredentials",
  "Dữ liệu không hợp lệ": "invalidData",
  "Email đã được sử dụng": "emailInUse",
  "Họ tên phải có ít nhất 2 ký tự": "nameMin",
  "Mật khẩu phải có ít nhất 8 ký tự": "passwordMin",
  "Mật khẩu phải có ít nhất 1 chữ hoa": "passwordUpper",
  "Mật khẩu phải có ít nhất 1 số": "passwordNumber",
  "Mật khẩu xác nhận không khớp": "passwordMismatch",
  "Invalid email address": "invalidEmail",
  "Invalid email or password": "invalidCredentials",
};

export function mapApiError(message: string): string | null {
  return ERROR_KEY_MAP[message] ?? null;
}
