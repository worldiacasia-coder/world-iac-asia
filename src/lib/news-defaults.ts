import prisma from "@/lib/prisma";

export const SECRETARY_NEWS_SLUG = "tong-thu-ky-khoi-chau-a";

const SECRETARY_NEWS = {
  title: "Tổng thư ký Khối Châu Á",
  excerpt:
    "Chef Trịnh Lệ Thanh, Tổng thư ký World IAC Asia, là bậc thầy nghệ nhân và nhà giáo dục có tầm nhìn, chuyên môn sâu rộng trong nghệ thuật bánh Việt và tinh hoa ẩm thức Hoa.",
  content: `<p>Chef Trịnh Lệ Thanh, Tổng thư ký World IAC Asia, là một nhân vật ẩm thực danh tiếng, bậc thầy nghệ nhân và là nhà giáo dục có tầm nhìn, nổi tiếng với chuyên môn sâu rộng trong nghệ thuật bánh Việt và tinh hoa ẩm thức Hoa.</p>
<p>Là một động lực mạnh mẽ trong bối cảnh ngành F&amp;B quốc tế, bà luôn tận tâm cống hiến cho việc phát triển các cộng đồng ẩm thực toàn cầu và thúc đẩy sự tăng trưởng chiến lược của ngành.</p>
<p>Với tư cách là một Giám khảo quốc tế uy tín và Phó Trưởng ban tổ chức tại các đấu trường đẳng cấp thế giới—bao gồm Master Chef of Foodex 2026 và World Bakery and Confectionery Competition 2026—Chef Trịnh Lệ Thanh đóng vai trò như một cầu nối văn hóa và người cố vấn thiết yếu, không ngừng nỗ lực chuẩn hóa các tiêu chuẩn chuyên môn và truyền cảm hứng cho thế hệ tài năng tiếp theo của ngành nhà hàng - khách sạn tự tin tỏa sáng trên trường quốc tế.</p>`,
  imageUrl: "/images/leadership/trinh-le-thanh.jpg",
  slug: SECRETARY_NEWS_SLUG,
  metaDesc:
    "Giới thiệu Chef Trịnh Lệ Thanh — Tổng thư ký World IAC Asia, giám khảo quốc tế và nhà giáo dục ẩm thực hàng đầu châu Á.",
  sortOrder: 0,
};

export type NewsRecord = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  link: string | null;
  slug: string | null;
  metaDesc: string | null;
  sortOrder: number;
  createdAt: Date;
};

function fallbackSecretaryNews(): NewsRecord {
  return {
    id: "fallback-secretary",
    ...SECRETARY_NEWS,
    link: null,
    createdAt: new Date(0),
  };
}

/** Tạo bài Tổng thư ký mặc định nếu chưa có — không ghi đè bài admin đã chỉnh sửa. */
async function ensureSecretaryNewsItem() {
  await prisma.newsItem.upsert({
    where: { slug: SECRETARY_NEWS_SLUG },
    create: SECRETARY_NEWS,
    update: {},
  });
}

export async function getHomeNewsItems(): Promise<NewsRecord[]> {
  try {
    await ensureSecretaryNewsItem();
    return prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("[news] Failed to load news items:", error);
    return [fallbackSecretaryNews()];
  }
}

export async function getAdminNewsItems(): Promise<NewsRecord[]> {
  try {
    return prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("[news] Failed to load admin news items:", error);
    return [];
  }
}
