import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { getAdminNewsItems } from "@/lib/news-defaults";
import prisma from "@/lib/prisma";
import AdminJudgePanel from "@/components/admin/AdminJudgePanel";
import AdminPartnerCards from "@/components/admin/AdminPartnerCards";
import AdminApplications from "@/components/admin/AdminApplications";
import AdminCreateUser from "@/components/admin/AdminCreateUser";
import AdminNewsPanel from "@/components/admin/AdminNewsPanel";
import AdminMembersPanel from "@/components/admin/AdminMembersPanel";
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

  const [judges, messages, training, partnerCards, applications, newsItems, allMembers] = await Promise.all([
    prisma.judge.findMany({ orderBy: { name: "asc" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.trainingRegistration.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.partnerCard.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } }),
    getAdminNewsItems(),
    prisma.member.findMany({ orderBy: { expirationDate: "asc" } }),
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
            membershipTier: m.membershipTier,
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

          {/* Training + Contact */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card-compact">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                {t("trainingTitle")} ({training.length})
              </h2>
              <div className="mt-2 h-px w-8 bg-brand-gold" />
              <ul className="mt-5 max-h-80 space-y-3 overflow-y-auto text-sm">
                {training.map((item) => (
                  <li key={item.id} className="border-b border-white/30 pb-3 last:border-0">
                    <p className="font-medium text-gray-900">{item.fullName}</p>
                    <p className="text-gray-500">{item.course}</p>
                    <p className="text-xs text-gray-400">{item.email}</p>
                  </li>
                ))}
                {training.length === 0 && <li className="text-gray-400">Chưa có đăng ký.</li>}
              </ul>
            </div>
            <div className="card-compact">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                {t("contactTitle")} ({messages.length})
              </h2>
              <div className="mt-2 h-px w-8 bg-brand-gold" />
              <ul className="mt-5 max-h-80 space-y-3 overflow-y-auto text-sm">
                {messages.map((m) => (
                  <li key={m.id} className="border-b border-white/30 pb-3 last:border-0">
                    <p className="font-medium text-gray-900">{m.subject}</p>
                    <p className="text-gray-500">
                      {m.fullName} — {m.email}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">{m.message}</p>
                  </li>
                ))}
                {messages.length === 0 && <li className="text-gray-400">Chưa có liên hệ.</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
