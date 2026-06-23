import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";

  const members = await prisma.member.findMany({
    where: {
      AND: [
        q ? { OR: [{ name: { contains: q } }, { memberCode: { contains: q } }] } : {},
        country ? { country: { equals: country } } : {},
      ],
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ members });
}

/* PATCH — admin gia hạn hoặc cập nhật hội viên */
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, action, membershipTier, paymentStatus } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  let data: Record<string, unknown> = {};

  if (action === "renew") {
    const current = await prisma.member.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    const base = current.expirationDate > new Date() ? current.expirationDate : new Date();
    const newExpiry = new Date(base);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    data = { expirationDate: newExpiry, paymentStatus: "paid" };
  } else {
    if (membershipTier) data.membershipTier = membershipTier;
    if (paymentStatus) data.paymentStatus = paymentStatus;
  }

  const member = await prisma.member.update({ where: { id }, data });
  return NextResponse.json({ member });
}

/* DELETE — admin xoá hội viên */
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
