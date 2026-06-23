import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

const schema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
    confirmPassword: z.string(),
    role: z.enum(["country_rep", "member", "admin"]).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    /* Chỉ admin mới được tạo tài khoản đăng nhập */
    const session = await getSession();
    if (!isAdmin(session?.role)) {
      return NextResponse.json({ error: "Chỉ admin mới có thể tạo tài khoản" }, { status: 403 });
    }

    const requestedRole = parsed.data.role ?? "country_rep";
    if (requestedRole === "admin" && !isAdmin(session?.role)) {
      return NextResponse.json({ error: "Không có quyền tạo tài khoản admin" }, { status: 403 });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName: parsed.data.fullName, role: requestedRole },
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Đăng ký thất bại" }, { status: 500 });
  }
}
