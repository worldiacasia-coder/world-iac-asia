export function isMemberExpired(
  expirationDate: Date | string,
  paymentStatus: "paid" | "unpaid"
) {
  const exp = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  return today > exp && paymentStatus === "unpaid";
}

export function formatDate(date: Date | string, locale = "vi-VN") {
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
