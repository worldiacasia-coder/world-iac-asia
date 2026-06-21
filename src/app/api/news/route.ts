import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const news = await prisma.newsItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ news });
}
