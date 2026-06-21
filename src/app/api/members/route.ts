import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";

  const members = await prisma.member.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q } },
                { memberCode: { contains: q } },
              ],
            }
          : {},
        country ? { country: { equals: country } } : {},
      ],
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ members });
}
