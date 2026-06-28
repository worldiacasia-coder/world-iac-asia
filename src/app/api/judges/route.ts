import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";
import { deleteFileByUrl } from "@/lib/cloudinary";
import { parseJudgeLevel, type JudgeLevel } from "@/lib/judge-level";

async function nextSortOrder(level: JudgeLevel) {
  const max = await prisma.judge.aggregate({
    where: { level },
    _max: { sortOrder: true },
  });
  return (max._max.sortOrder ?? -1) + 1;
}

type JudgeInput = {
  name: string;
  avatarUrl: string;
  title: string;
  country: string;
  stars?: number;
  level?: JudgeLevel;
  phone?: string;
  email?: string;
  certifications?: string;
  history?: string;
};

function validateJudge(body: Partial<JudgeInput>) {
  if (!body.name?.trim()) return "Thiếu tên giám khảo.";
  if (!body.avatarUrl?.trim()) return "Thiếu ảnh đại diện.";
  if (!body.title?.trim()) return "Thiếu chức danh.";
  if (!body.country?.trim()) return "Thiếu quốc gia.";
  return null;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as JudgeInput;
  const err = validateJudge(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const level = parseJudgeLevel(body.level);
  const judge = await prisma.judge.create({
    data: {
      name: body.name.trim(),
      avatarUrl: body.avatarUrl.trim(),
      title: body.title.trim(),
      country: body.country.trim(),
      stars: Math.min(5, Math.max(1, body.stars ?? 1)),
      level,
      sortOrder: await nextSortOrder(level),
      phone: body.phone?.trim() ?? "",
      email: body.email?.trim() ?? "",
      certifications: body.certifications?.trim() ?? "",
      history: body.history?.trim() ?? "",
    },
  });

  return NextResponse.json({ judge });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as JudgeInput & { id: string };
  if (!body.id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const err = validateJudge(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const existing = await prisma.judge.findUnique({ where: { id: body.id } });
  if (!existing) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });

  if (
    existing.avatarUrl.includes("cloudinary.com") &&
    body.avatarUrl !== existing.avatarUrl
  ) {
    await deleteFileByUrl(existing.avatarUrl);
  }

  const newLevel = body.level !== undefined ? parseJudgeLevel(body.level) : existing.level;
  const levelChanged = newLevel !== existing.level;

  const judge = await prisma.judge.update({
    where: { id: body.id },
    data: {
      name: body.name.trim(),
      avatarUrl: body.avatarUrl.trim(),
      title: body.title.trim(),
      country: body.country.trim(),
      stars: body.stars !== undefined ? Math.min(5, Math.max(1, body.stars)) : undefined,
      level: levelChanged ? newLevel : undefined,
      sortOrder: levelChanged ? await nextSortOrder(newLevel) : undefined,
      phone: body.phone?.trim() ?? "",
      email: body.email?.trim() ?? "",
      certifications: body.certifications?.trim() ?? "",
      history: body.history?.trim() ?? "",
    },
  });

  return NextResponse.json({ judge });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const judge = await prisma.judge.findUnique({ where: { id } });
  if (judge?.avatarUrl.includes("cloudinary.com")) {
    await deleteFileByUrl(judge.avatarUrl);
  }

  await prisma.judge.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
