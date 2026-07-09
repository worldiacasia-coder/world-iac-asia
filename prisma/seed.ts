import { JudgeLevel, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { HOME_CONTENT_DEFAULTS } from "../src/lib/home-content";

const prisma = new PrismaClient();

const organizations = [
  {
    countryId: "KR",
    orgName: "World IAC Asia - Korea",
    flagUrl: "/flags/korea.png",
    representative: "Chef Dong Yeon Park",
    address: "Seoul, South Korea",
    phone: "+82 2 1234 5678",
    email: "korea@worldiacasia.com",
    logoUrl: "/images/leadership/dong-yeon-park.jpg",
  },
  {
    countryId: "TW",
    orgName: "World IAC Asia - Taiwan",
    flagUrl: "/flags/taiwan.png",
    logoUrl: "/images/leadership/ho-chen-hsiung.jpg",
    representative: "Chef Ho Chen Hsiung",
    address: "Taipei, Taiwan",
    phone: "+886 2 2345 6789",
    email: "taiwan@worldiacasia.com",
  },
  {
    countryId: "VN",
    orgName: "World IAC Asia - Viet Nam",
    flagUrl: "/flags/vietnam.png",
    logoUrl: "/images/leadership/tran-le-thanh-thien.jpg",
    representative: "Tran Le Thanh Thien",
    address: "135/28 Nguyen Huu Canh, Binh Thanh, Ho Chi Minh City",
    phone: "+84 975 575 449",
    email: "vietnam@worldiacasia.com",
  },
  {
    countryId: "PH",
    orgName: "World IAC Asia - Philippine",
    flagUrl: "/flags/philippines.png",
    logoUrl: "/images/leadership/arwin-gragasin.png",
    representative: "Chef Arwin \"Zek\" Gragasin",
    address: "Manila, Philippines",
    phone: "+63 2 8765 4321",
    email: "philippines@worldiacasia.com",
  },
  {
    countryId: "TH",
    orgName: "World IAC Asia - Thailand",
    flagUrl: "https://flagcdn.com/w80/th.png",
    logoUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
    representative: "Somchai Prasert",
    address: "Bangkok, Thailand",
    phone: "+66 2 123 4567",
    email: "thailand@worldiacasia.com",
  },
  {
    countryId: "KH",
    orgName: "World IAC Asia - Cambodia",
    flagUrl: "https://flagcdn.com/w80/kh.png",
    logoUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
    representative: "Sok Pisey",
    address: "Phnom Penh, Cambodia",
    phone: "+855 23 456 789",
    email: "cambodia@worldiacasia.com",
  },
  {
    countryId: "MY",
    orgName: "World IAC Asia - Malaysia",
    flagUrl: "/flags/malaysia.png",
    logoUrl: "/images/leadership/william-surianath.jpg",
    representative: "Chef William Surianath",
    address: "Kuala Lumpur, Malaysia",
    phone: "+60 3 1234 5678",
    email: "malaysia@worldiacasia.com",
  },
  {
    countryId: "SG",
    orgName: "World IAC Asia - Singapore",
    flagUrl: "/flags/singapore.png",
    logoUrl: "/images/leadership/judy-koh.jpg",
    representative: "Chef Judy Koh",
    address: "Singapore",
    phone: "+65 6123 4567",
    email: "singapore@worldiacasia.com",
  },
  {
    countryId: "ID",
    orgName: "World IAC Asia - Indonesia",
    flagUrl: "/flags/indonesia.png",
    logoUrl: "/images/leadership/roy-lesmana.jpg",
    representative: "Chef Roy Lesmana",
    address: "Jakarta, Indonesia",
    phone: "+62 21 1234 5678",
    email: "indonesia@worldiacasia.com",
  },
  {
    countryId: "IN",
    orgName: "World IAC Asia - India",
    flagUrl: "/flags/india.png",
    logoUrl: "/images/leadership/kaninika.jpg",
    representative: "Chef Kaninika",
    address: "New Delhi, India",
    phone: "+91 11 2345 6789",
    email: "india@worldiacasia.com",
  },
];

async function main() {
  await prisma.contactMessage.deleteMany();
  await prisma.trainingRegistration.deleteMany();
  await prisma.course.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.partnerCard.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.member.deleteMany();
  await prisma.judge.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Admin@123456",
    12
  );
  const memberPassword = await bcrypt.hash("Member@123456", 12);

  await prisma.user.createMany({
    data: [
      {
        email: process.env.ADMIN_EMAIL ?? "admin@worldiacasia.com",
        passwordHash: adminPassword,
        fullName: "IAC Admin",
        role: Role.admin,
      },
      {
        email: "rep@worldiacasia.com",
        passwordHash: memberPassword,
        fullName: "Demo Country Rep",
        role: Role.country_rep,
      },
    ],
  });

  for (const org of organizations) {
    await prisma.organization.create({ data: org });
  }

  const now = new Date();
  const inThreeYears = new Date(now);
  inThreeYears.setFullYear(inThreeYears.getFullYear() + 3);
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  await prisma.judge.createMany({
    data: [
      {
        name: "Simone Falcin",
        avatarUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=200&h=200&fit=crop&crop=face",
        title: "World Associazione Italiana Cuochi President",
        country: "Italy",
        stars: 5,
        level: JudgeLevel.international,
        sortOrder: 0,
        phone: "+39 02 1234 5678",
        email: "simone.falcin@iac.org",
        certifications: "Michelin Star Consultant, GCU Certified Judge",
        history: "30+ years in culinary excellence across Europe and Asia.",
        expirationDate: inThreeYears,
        paymentStatus: "paid",
      },
      {
        name: "Arthur Lim",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        title: "Global Chefs Union President",
        country: "Singapore",
        stars: 5,
        level: JudgeLevel.international,
        sortOrder: 1,
        phone: "+65 6123 4567",
        email: "arthur.lim@gcu.org",
        certifications: "GCU Master Judge, ASEAN Culinary Board",
        history: "Leading culinary standards across Asia-Pacific region.",
        expirationDate: inThreeYears,
        paymentStatus: "paid",
      },
      {
        name: "Nguyen Duy Thinh",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        title: "Food Expert",
        country: "Vietnam",
        stars: 4,
        level: JudgeLevel.national,
        sortOrder: 0,
        phone: "+84 90 123 4567",
        email: "duy.thinh@worldiacasia.com",
        certifications: "Vietnamese Culinary Heritage Specialist",
        history: "Expert in traditional and modern Vietnamese cuisine.",
        expirationDate: inThreeYears,
        paymentStatus: "paid",
      },
      {
        name: "Judy Koh",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        title: "International Judge / Chef",
        country: "Malaysia",
        stars: 4,
        level: JudgeLevel.asia_regional,
        sortOrder: 0,
        phone: "+60 12 345 6789",
        email: "judy.koh@worldiacasia.com",
        certifications: "ASEAN Master Chef, IAC Senior Judge",
        history: "Specialist in fusion and traditional Asian cuisines.",
        expirationDate: inThreeYears,
        paymentStatus: "paid",
      },
      {
        name: "Mike Fleming",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        title: "International Judge / Chef",
        country: "Australia",
        stars: 3,
        level: JudgeLevel.trainee,
        sortOrder: 0,
        phone: "+61 2 9876 5432",
        email: "mike.fleming@worldiacasia.com",
        certifications: "Culinary Arts Diploma, IAC Judge Certification",
        history: "Decades of experience in hotel and restaurant kitchens.",
        expirationDate: lastMonth,
        paymentStatus: "unpaid",
      },
    ],
  });

  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await prisma.member.createMany({
    data: [
      {
        memberCode: "IAC-VN-001",
        name: "Nguyen Van A",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        country: "Vietnam",
        jobTitle: "Executive Chef",
        expirationDate: nextYear,
        paymentStatus: "paid",
      },
      {
        memberCode: "IAC-SG-002",
        name: "Tan Wei Ming",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        country: "Singapore",
        jobTitle: "Pastry Chef",
        expirationDate: nextYear,
        paymentStatus: "paid",
      },
      {
        memberCode: "IAC-KR-003",
        name: "Park Ji-hoon",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
        country: "Korea",
        jobTitle: "Sous Chef",
        expirationDate: lastMonth,
        paymentStatus: "unpaid",
      },
      {
        memberCode: "IAC-TH-004",
        name: "Somchai Prasert",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
        country: "Thailand",
        jobTitle: "Head Chef",
        expirationDate: lastMonth,
        paymentStatus: "unpaid",
      },
      {
        memberCode: "IAC-PH-005",
        name: "Maria Santos",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
        country: "Philippines",
        jobTitle: "Chef de Partie",
        expirationDate: nextYear,
        paymentStatus: "paid",
      },
      {
        memberCode: "IAC-IN-006",
        name: "Rajesh Kumar",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
        country: "India",
        jobTitle: "Commis Chef",
        expirationDate: nextYear,
        paymentStatus: "paid",
      },
    ],
  });

  await prisma.newsItem.createMany({
    data: [
      {
        title: "Tổng thư ký Khối Châu Á",
        excerpt:
          "Chef Trịnh Lệ Thanh, Tổng thư ký World IAC Asia, là bậc thầy nghệ nhân và nhà giáo dục có tầm nhìn, chuyên môn sâu rộng trong nghệ thuật bánh Việt và tinh hoa ẩm thức Hoa.",
        content: `<p>Chef Trịnh Lệ Thanh, Tổng thư ký World IAC Asia, là một nhân vật ẩm thực danh tiếng, bậc thầy nghệ nhân và là nhà giáo dục có tầm nhìn, nổi tiếng với chuyên môn sâu rộng trong nghệ thuật bánh Việt và tinh hoa ẩm thức Hoa.</p>
<p>Là một động lực mạnh mẽ trong bối cảnh ngành F&amp;B quốc tế, bà luôn tận tâm cống hiến cho việc phát triển các cộng đồng ẩm thực toàn cầu và thúc đẩy sự tăng trưởng chiến lược của ngành.</p>
<p>Với tư cách là một Giám khảo quốc tế uy tín và Phó Trưởng ban tổ chức tại các đấu trường đẳng cấp thế giới—bao gồm Master Chef of Foodex 2026 và World Bakery and Confectionery Competition 2026—Chef Trịnh Lệ Thanh đóng vai trò như một cầu nối văn hóa và người cố vấn thiết yếu, không ngừng nỗ lực chuẩn hóa các tiêu chuẩn chuyên môn và truyền cảm hứng cho thế hệ tài năng tiếp theo của ngành nhà hàng - khách sạn tự tin tỏa sáng trên trường quốc tế.</p>`,
        imageUrl: "/images/leadership/trinh-le-thanh.jpg",
        slug: "tong-thu-ky-khoi-chau-a",
        metaDesc:
          "Giới thiệu Chef Trịnh Lệ Thanh — Tổng thư ký World IAC Asia, giám khảo quốc tế và nhà giáo dục ẩm thực hàng đầu châu Á.",
        sortOrder: 0,
      },
      {
        title: "Food & Hospitality Hanoi 2025",
        excerpt: "Cơ hội giao thương và phát triển sáng tạo trong ngành F&B và Nhà hàng – Khách sạn.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
        slug: "food-hospitality-hanoi-2025",
        sortOrder: 1,
      },
      {
        title: "World IAC Asia Annual Summit",
        excerpt: "Hội nghị thường niên các đầu bếp và chuyên gia ẩm thực châu Á.",
        imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=450&fit=crop",
        slug: "world-iac-asia-annual-summit",
        sortOrder: 2,
      },
      {
        title: "New Accreditation Standards 2025",
        excerpt: "Tiêu chuẩn công nhận mới cho các khóa đào tạo ẩm thực chuyên nghiệp.",
        imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=450&fit=crop",
        slug: "new-accreditation-standards-2025",
        sortOrder: 3,
      },
    ],
  });

  await prisma.partner.createMany({
    data: [
      { name: "Global Chefs Union", logoUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66e48?w=200&h=80&fit=crop", sortOrder: 1 },
      { name: "Associazione Italiana Cuochi", logoUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=80&fit=crop", sortOrder: 2 },
      { name: "UNESCO Chair", logoUrl: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=200&h=80&fit=crop", sortOrder: 3 },
      { name: "Food & Hospitality", logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=80&fit=crop", sortOrder: 4 },
      { name: "Asia Culinary Board", logoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=80&fit=crop", sortOrder: 5 },
      { name: "World Gastronomy Institute", logoUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=80&fit=crop", sortOrder: 6 },
    ],
  });

  await prisma.partnerCard.createMany({
    data: [
      {
        name: "Sự công nhận",
        description: "Khẳng định chất lượng và sáng tạo trong ngành ẩm thực thông qua tiêu chuẩn World IAC.",
        imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
        sortOrder: 1,
      },
      {
        name: "Truyền thông",
        description: "Xây dựng thương hiệu cá nhân và doanh nghiệp mạnh mẽ trên nền tảng mạng lưới quốc tế.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        sortOrder: 2,
      },
      {
        name: "Tăng trưởng",
        description: "Thu hút khách hàng và mở rộng cơ hội hợp tác trong ngành F&B châu Á.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        sortOrder: 3,
      },
      {
        name: "Giá trị thương hiệu",
        description: "Nâng cao vị thế dẫn đầu trong ngành F&B với chứng nhận và công nhận quốc tế.",
        imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
        sortOrder: 4,
      },
    ],
  });

  await prisma.course.createMany({
    data: [
      {
        name: "Professional Chef Certification",
        description: "Chương trình chứng nhận đầu bếp chuyên nghiệp cấp quốc tế.",
        sortOrder: 1,
      },
      {
        name: "Food Safety & Hygiene",
        description: "Khóa đào tạo an toàn thực phẩm và vệ sinh nhà bếp chuyên nghiệp.",
        sortOrder: 2,
      },
      {
        name: "Asian Culinary Arts Masterclass",
        description: "Masterclass nghệ thuật ẩm thực châu Á với các đầu bếp hàng đầu.",
        sortOrder: 3,
      },
      {
        name: "Restaurant Management Accreditation",
        description: "Chứng nhận quản lý nhà hàng và vận hành F&B chuyên nghiệp.",
        sortOrder: 4,
      },
    ],
  });

  await prisma.homeContent.upsert({
    where: { id: "default" },
    create: HOME_CONTENT_DEFAULTS,
    update: {
      visionVi: HOME_CONTENT_DEFAULTS.visionVi,
      visionEn: HOME_CONTENT_DEFAULTS.visionEn,
      missionVi: HOME_CONTENT_DEFAULTS.missionVi,
      missionEn: HOME_CONTENT_DEFAULTS.missionEn,
      valuesVi: HOME_CONTENT_DEFAULTS.valuesVi,
      valuesEn: HOME_CONTENT_DEFAULTS.valuesEn,
    },
  });

  console.log("Seed completed successfully.");
  console.log("Admin:", process.env.ADMIN_EMAIL ?? "admin@worldiacasia.com");
  console.log("Password:", process.env.ADMIN_PASSWORD ?? "Admin@123456");
  console.log("Country rep demo: rep@worldiacasia.com / Member@123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
