import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

const patchSchema = z.object({
  isRead: z.boolean(),
});

async function requireAdmin() {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return null;
  }
  return session;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const message = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { isRead: parsed.data.isRead },
  });

  return NextResponse.json({ message });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
