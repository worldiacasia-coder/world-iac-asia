import prisma from "@/lib/prisma";

export const HOME_CONTENT_ID = "default";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=640&fit=crop&q=80";

export const HOME_CONTENT_DEFAULTS = {
  id: HOME_CONTENT_ID,
  bannerImageUrl: DEFAULT_BANNER,
  sideImageUrl: "",
  missionEn:
    "Our Mission is to create a network of Professional Chefs in the world; a Professional Association where Cooks, Chefs and Junior Chefs can meet to compare their ideas and passions, discover new raw materials, new companies of excellence, new technologies.\n\nThrough the Events and Congresses organized, Professional Chefs and Chefs, and Junior Chefs will be able to deal with WORLD IAC, with Partner Companies, with colleagues, in days of conviviality, aggregation and comparison, receiving information and training dedicated exclusively to improving the Knowledge and Expertise.",
  missionVi:
    "Sứ mệnh của chúng tôi là xây dựng mạng lưới Đầu bếp Chuyên nghiệp trên toàn thế giới — một Hiệp hội Chuyên nghiệp nơi Cook, Chef và Junior Chef gặp gỡ, trao đổi ý tưởng và đam mê, khám phá nguyên liệu thô mới, các công ty xuất sắc và công nghệ tiên tiến.\n\nThông qua các Sự kiện và Hội nghị được tổ chức, Professional Chef, Chef và Junior Chef có thể làm việc cùng WORLD IAC, các Công ty Đối tác và đồng nghiệp trong những ngày giao lưu, kết nối và học hỏi, nhận thông tin và đào tạo nhằm nâng cao Kiến thức và Chuyên môn.",
  visionEn:
    "Full Support: IAC supports the entire category in front of organizations and institutions, aimed at improving the professional working quality of all members.\n\nProtect: WORLD IAC safeguards the quality of Italian cuisine, of Cooks and Chefs. WORLD IAC is committed to protecting the restaurant scene and the entire Italian food and wine sector.",
  visionVi:
    "Hỗ trợ toàn diện: IAC hỗ trợ toàn bộ ngành trước các tổ chức và cơ quan, nhằm cải thiện chất lượng làm việc chuyên nghiệp của tất cả hội viên.\n\nBảo vệ: WORLD IAC bảo vệ chất lượng ẩm thực Ý, của Cook và Chef. WORLD IAC cam kết bảo vệ cảnh quan nhà hàng và toàn bộ ngành ẩm thực – rượu vang Ý.",
  valuesEn:
    "All our chefs will be able to participate in our information and training events, meet new work colleagues to start a new adventure.",
  valuesVi:
    "Tất cả đầu bếp của chúng tôi có thể tham gia các sự kiện thông tin và đào tạo, gặp gỡ đồng nghiệp mới để bắt đầu một hành trình mới.",
};

export type HomeContentData = typeof HOME_CONTENT_DEFAULTS;

export async function getHomeContent(): Promise<HomeContentData> {
  const existing = await prisma.homeContent.findUnique({
    where: { id: HOME_CONTENT_ID },
  });

  if (existing) return existing;

  return prisma.homeContent.create({ data: HOME_CONTENT_DEFAULTS });
}

export function pickHomeContentText(
  content: HomeContentData,
  locale: string
): { vision: string; mission: string; values: string } {
  const isVi = locale === "vi";
  return {
    vision: isVi ? content.visionVi : content.visionEn,
    mission: isVi ? content.missionVi : content.missionEn,
    values: isVi ? content.valuesVi : content.valuesEn,
  };
}
