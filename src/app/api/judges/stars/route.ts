import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

const schema = z.object({
  judgeId: z.string(),
  stars: z.number().int().min(1).max(5),
});

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const judge = await prisma.judge.update({
      where: { id: parsed.data.judgeId },
      data: { stars: parsed.data.stars },
    });

    return NextResponse.json({ judge });
  } catch {
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
  }
}
