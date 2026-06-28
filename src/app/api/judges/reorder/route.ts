import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";
import { sortJudges } from "@/lib/judge-sort";
import type { JudgeLevel } from "@/lib/judge-level";

async function applyOrder(orderedIds: string[]) {
  if (!orderedIds.length) {
    return NextResponse.json({ error: "Danh sách trống." }, { status: 400 });
  }

  const judges = await prisma.judge.findMany({ where: { id: { in: orderedIds } } });
  if (judges.length !== orderedIds.length) {
    return NextResponse.json({ error: "Một hoặc nhiều giám khảo không tồn tại." }, { status: 400 });
  }

  const level = judges[0].level;
  if (!judges.every((j) => j.level === level)) {
    return NextResponse.json({ error: "Chỉ sắp xếp trong cùng nhóm cấp bậc." }, { status: 400 });
  }

  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.judge.update({ where: { id }, data: { sortOrder: i } })
    )
  );

  return NextResponse.json({ judges: sortJudges(await prisma.judge.findMany()) });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await req.json()) as {
      orderedIds?: string[];
      level?: JudgeLevel;
      id?: string;
      direction?: "up" | "down";
    };

    if (body.orderedIds?.length) {
      return applyOrder(body.orderedIds);
    }

    const { id, direction } = body;
    if (!id || (direction !== "up" && direction !== "down")) {
      return NextResponse.json({ error: "Thiếu dữ liệu sắp xếp." }, { status: 400 });
    }

    const judge = await prisma.judge.findUnique({ where: { id } });
    if (!judge) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });

    const peers = sortJudges(await prisma.judge.findMany({ where: { level: judge.level } }));
    const idx = peers.findIndex((p) => p.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= peers.length) {
      return NextResponse.json({ error: "Không thể di chuyển thêm." }, { status: 400 });
    }

    const reordered = [...peers];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

    return applyOrder(reordered.map((j) => j.id));
  } catch (error) {
    console.error("[judges/reorder]", error);
    return NextResponse.json(
      { error: "Không thể cập nhật thứ tự. Hãy chạy: npx prisma generate rồi khởi động lại dev server." },
      { status: 500 }
    );
  }
}
