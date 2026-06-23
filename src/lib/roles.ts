import type { Role } from "@prisma/client";

/** Đại diện quốc gia — chỉ được xem thông tin giám khảo, không truy cập admin */
export function isCountryRep(role: Role | undefined | null) {
  return role === "country_rep" || role === "member";
}

export function canViewSensitiveData(role: Role | undefined | null) {
  return isCountryRep(role) || role === "admin";
}

export function isAdmin(role: Role | undefined | null) {
  return role === "admin";
}

export function getPostLoginPath(role: Role, redirectTo = "/") {
  if (isAdmin(role)) {
    return redirectTo === "/" ? "/admin" : redirectTo;
  }
  if (isCountryRep(role)) {
    if (redirectTo.startsWith("/admin")) return "/judges";
    return redirectTo === "/" ? "/judges" : redirectTo;
  }
  return redirectTo;
}
