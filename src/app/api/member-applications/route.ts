import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

/* POST — nộp đơn xin thành viên (public) */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName  = (formData.get("fullName")   as string)?.trim();
    const dob       = (formData.get("dob")         as string)?.trim();
    const phone     = (formData.get("phone")       as string)?.trim();
    const country   = (formData.get("country")     as string)?.trim();
    const experience = (formData.get("experience") as string)?.trim();

    if (!fullName || !dob || !phone || !country || !experience) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc." }, { status: 400 });
    }

    /* Lưu ảnh đại diện */
    let avatarPath: string | null = null;
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const ext = avatarFile.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await writeFile(
        join(process.cwd(), "public", "uploads", "avatars", filename),
        Buffer.from(bytes)
      );
      avatarPath = `/uploads/avatars/${filename}`;
    }

    /* Lưu sơ yếu lý lịch */
    let resumePath: string | null = null;
    const resumeFile = formData.get("resume") as File | null;
    if (resumeFile && resumeFile.size > 0) {
      const bytes = await resumeFile.arrayBuffer();
      const ext = resumeFile.name.split(".").pop() ?? "pdf";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await writeFile(
        join(process.cwd(), "public", "uploads", "resumes", filename),
        Buffer.from(bytes)
      );
      resumePath = `/uploads/resumes/${filename}`;
    }

    const application = await prisma.memberApplication.create({
      data: { fullName, dob, phone, country, experience, avatarPath, resumePath },
    });

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi máy chủ." }, { status: 500 });
  }
}

/* GET — admin xem danh sách đơn */
export async function GET() {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const applications = await prisma.memberApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ applications });
}

/* PATCH — admin duyệt / từ chối — nếu duyệt thì TỰ ĐỘNG tạo Member */
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id, status, adminNote } = await req.json();
  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  /* Cập nhật trạng thái đơn */
  const app = await prisma.memberApplication.update({
    where: { id },
    data: { status, adminNote: adminNote ?? null },
  });

  /* Nếu duyệt → tự động tạo Member trong danh mục */
  if (status === "approved") {
    /* Sinh mã hội viên: IAC-[2 ký tự quốc gia]-[năm][số thứ tự] */
    const countryCode = (app.country ?? "XX").slice(0, 2).toUpperCase();
    const year = new Date().getFullYear().toString().slice(2);
    const count = await prisma.member.count();
    const seq = String(count + 1).padStart(3, "0");
    const memberCode = `IAC-${countryCode}-${year}${seq}`;

    /* Avatar: dùng ảnh đã upload, nếu không có thì ảnh placeholder */
    const avatarUrl =
      app.avatarPath ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(app.fullName)}&background=C5A059&color=fff&size=256`;

    /* Ngày hết hạn: 1 năm kể từ hôm nay */
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    /* Kiểm tra tránh trùng memberCode */
    const existing = await prisma.member.findUnique({ where: { memberCode } });
    if (!existing) {
      await prisma.member.create({
        data: {
          memberCode,
          name: app.fullName,
          avatarUrl,
          country: app.country,
          membershipTier: "Standard",
          expirationDate,
          paymentStatus: "unpaid",
        },
      });
    }
  }

  return NextResponse.json({ application: app });
}
