import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";
import { deleteFileByUrl } from "@/lib/cloudinary";
import {
  addJudgeYears,
  defaultJudgeExpiration,
  parseJudgeLevel,
  type JudgeLevel,
} from "@/lib/judge-level";

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
  expirationDate?: string;
  paymentStatus?: "paid" | "unpaid";
};

function validateJudge(body: Partial<JudgeInput>) {
  if (!body.name?.trim()) return "Thiếu tên giám khảo.";
  if (!body.avatarUrl?.trim()) return "Thiếu ảnh đại diện.";
  if (!body.title?.trim()) return "Thiếu chức danh.";
  if (!body.country?.trim()) return "Thiếu quốc gia.";
  return null;
}

function parsePaymentStatus(value: unknown): "paid" | "unpaid" | undefined {
  if (value === "paid" || value === "unpaid") return value;
  return undefined;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as JudgeInput;
  const err = validateJudge(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const level = parseJudgeLevel(body.level);
  const expirationDate = body.expirationDate
    ? new Date(body.expirationDate)
    : defaultJudgeExpiration();
  const paymentStatus = parsePaymentStatus(body.paymentStatus) ?? "unpaid";

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
      expirationDate,
      paymentStatus,
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
  const paymentStatus = parsePaymentStatus(body.paymentStatus);

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
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
      paymentStatus,
    },
  });

  return NextResponse.json({ judge });
}

/* PATCH — admin gia hạn (+3 năm) hoặc cập nhật thanh toán */
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, action, paymentStatus, expirationDate } = body as {
    id?: string;
    action?: string;
    paymentStatus?: "paid" | "unpaid";
    expirationDate?: string;
  };

  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const current = await prisma.judge.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });

  let data: Record<string, unknown> = {};

  if (action === "renew") {
    const base = current.expirationDate > new Date() ? current.expirationDate : new Date();
    data = {
      expirationDate: addJudgeYears(base, 3),
      paymentStatus: "paid",
    };
  } else {
    const status = parsePaymentStatus(paymentStatus);
    if (status) data.paymentStatus = status;
    if (expirationDate) data.expirationDate = new Date(expirationDate);
  }

  const judge = await prisma.judge.update({ where: { id }, data });
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
