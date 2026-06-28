import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { getAdminNewsItems } from "@/lib/news-defaults";
import { getHomeContent } from "@/lib/home-content";
import prisma from "@/lib/prisma";
import AdminHomeContent from "@/components/admin/AdminHomeContent";
import AdminJudgePanel from "@/components/admin/AdminJudgePanel";
import AdminPartnerCards from "@/components/admin/AdminPartnerCards";
import AdminApplications from "@/components/admin/AdminApplications";
import AdminCreateUser from "@/components/admin/AdminCreateUser";
import AdminNewsPanel from "@/components/admin/AdminNewsPanel";
import AdminMembersPanel from "@/components/admin/AdminMembersPanel";
import AdminContactMessages from "@/components/admin/AdminContactMessages";
import AdminTrainingRegistrations from "@/components/admin/AdminTrainingRegistrations";
import AdminMemberProfiles from "@/components/admin/AdminMemberProfiles";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("title") };
}

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const session = await getSession();

  if (!isAdmin(session?.role)) {
    redirect({ href: "/auth?redirect=/admin", locale });
  }

  const [judges, messages, training, partnerCards, applications, newsItems, allMembers, homeContent] = await Promise.all([
    prisma.judge.findMany({ orderBy: { name: "asc" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.trainingRegistration.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.partnerCard.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } }),
    getAdminNewsItems(),
    prisma.member.findMany({ orderBy: { expirationDate: "asc" } }),
    getHomeContent(),
  ]);

  return (
    <>
      {/* Page hero */}
      <div className="page-hero" style={{ minHeight: 240 }}>
        <Image
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1920&q=80"
          alt="Admin dashboard"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="page-hero-content" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <p className="section-label text-amber-300">World IAC Asia</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            {t("title")}
          </h1>
          <div className="mt-3 h-0.5 w-10 bg-brand-gold" />
          <p className="mt-3 text-sm text-white/70">{t("subtitle")}</p>
        </div>
      </div>

      <section className="section">
        <div className="container-main space-y-12">
          <AdminHomeContent initial={homeContent} />

          {/* Judge ratings panel */}
          <AdminJudgePanel
            judges={judges.map((j) => ({
              id: j.id,
              name: j.name,
              country: j.country,
              stars: j.stars,
            }))}
          />

          {/* Hồ sơ thành viên được duyệt */}
          <AdminMemberProfiles profiles={applications.map((a) => ({
            id: a.id,
            fullName: a.fullName,
            dob: a.dob,
            phone: a.phone,
            country: a.country,
            experience: a.experience,
            avatarPath: a.avatarPath,
            resumePath: a.resumePath,
            status: a.status as "pending" | "approved" | "rejected",
            createdAt: a.createdAt.toISOString(),
          }))} />

          {/* Quản lý Hội viên */}
          <AdminMembersPanel initial={allMembers.map((m) => ({
            id: m.id,
            memberCode: m.memberCode,
            name: m.name,
            avatarUrl: m.avatarUrl,
            country: m.country,
            expirationDate: m.expirationDate.toISOString(),
            paymentStatus: m.paymentStatus as "paid" | "unpaid",
          }))} />

          {/* Quản lý Tin tức */}
          <AdminNewsPanel initial={newsItems.map((n) => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            content: n.content,
            imageUrl: n.imageUrl,
            link: n.link,
            slug: n.slug,
            metaDesc: n.metaDesc,
            sortOrder: n.sortOrder,
          }))} />

          {/* Tạo tài khoản */}
          <AdminCreateUser />

          {/* Đơn xin thành viên */}
          <AdminApplications initial={applications.map((a) => ({
            id: a.id,
            fullName: a.fullName,
            dob: a.dob,
            phone: a.phone,
            country: a.country,
            experience: a.experience,
            avatarPath: a.avatarPath,
            resumePath: a.resumePath,
            status: a.status as "pending" | "approved" | "rejected",
            adminNote: a.adminNote,
            createdAt: a.createdAt.toISOString(),
          }))} />

          {/* Partner Cards manager */}
          <AdminPartnerCards initial={partnerCards.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            imageUrl: c.imageUrl,
            sortOrder: c.sortOrder,
          }))} />

          {/* Liên hệ từ form Đối tác */}
          <AdminContactMessages
            initial={messages.map((m) => ({
              id: m.id,
              fullName: m.fullName,
              email: m.email,
              phone: m.phone,
              subject: m.subject,
              message: m.message,
              isRead: m.isRead,
              createdAt: m.createdAt.toISOString(),
            }))}
          />

          <AdminTrainingRegistrations
            initial={training.map((item) => ({
              id: item.id,
              fullName: item.fullName,
              organization: item.organization,
              phone: item.phone,
              email: item.email,
              course: item.course,
              isRead: item.isRead,
              createdAt: item.createdAt.toISOString(),
            }))}
          />
        </div>
      </section>
    </>
  );
}
