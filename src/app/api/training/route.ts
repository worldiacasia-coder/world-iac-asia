import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().min(2),
  organization: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  course: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    await prisma.trainingRegistration.create({ data: parsed.data });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gửi đăng ký thất bại" }, { status: 500 });
  }
}
