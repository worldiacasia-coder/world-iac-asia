import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

export async function GET() {
  const news = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ news });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, excerpt, content, imageUrl, link, slug, metaDesc, sortOrder } = await req.json();
  if (!title || !excerpt || !imageUrl)
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 });

  const item = await prisma.newsItem.create({
    data: { title, excerpt, content: content ?? "", imageUrl, link: link ?? null, slug: slug ?? null, metaDesc: metaDesc ?? null, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json({ item }, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, title, excerpt, content, imageUrl, link, slug, metaDesc, sortOrder } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  const item = await prisma.newsItem.update({
    where: { id },
    data: { title, excerpt, content: content ?? "", imageUrl, link: link ?? null, slug: slug ?? null, metaDesc: metaDesc ?? null, sortOrder },
  });
  return NextResponse.json({ item });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  await prisma.newsItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
