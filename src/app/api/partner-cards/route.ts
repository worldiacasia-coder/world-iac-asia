import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

/* GET — public */
export async function GET() {
  const cards = await prisma.partnerCard.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ cards });
}

/* POST — admin only: tạo card mới */
export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { name, description, imageUrl, sortOrder } = await req.json();
  if (!name || !imageUrl) {
    return NextResponse.json({ error: "name và imageUrl là bắt buộc" }, { status: 400 });
  }
  const card = await prisma.partnerCard.create({
    data: { name, description: description ?? "", imageUrl, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json({ card }, { status: 201 });
}

/* PUT — admin only: cập nhật card */
export async function PUT(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id, name, description, imageUrl, sortOrder } = await req.json();
  if (!id) return NextResponse.json({ error: "id bắt buộc" }, { status: 400 });
  const card = await prisma.partnerCard.update({
    where: { id },
    data: { name, description, imageUrl, sortOrder },
  });
  return NextResponse.json({ card });
}

/* DELETE — admin only */
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id bắt buộc" }, { status: 400 });
  await prisma.partnerCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
