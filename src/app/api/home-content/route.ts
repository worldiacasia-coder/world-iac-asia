import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";
import { getHomeContent, HOME_CONTENT_DEFAULTS, HOME_CONTENT_ID } from "@/lib/home-content";

export async function GET() {
  const content = await getHomeContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    bannerImageUrl,
    sideImageUrl,
    visionVi,
    visionEn,
    missionVi,
    missionEn,
    valuesVi,
    valuesEn,
  } = body;

  const content = await prisma.homeContent.upsert({
    where: { id: HOME_CONTENT_ID },
    create: { ...HOME_CONTENT_DEFAULTS, ...body, id: HOME_CONTENT_ID },
    update: {
      ...(bannerImageUrl !== undefined && { bannerImageUrl }),
      ...(sideImageUrl !== undefined && { sideImageUrl }),
      ...(visionVi !== undefined && { visionVi }),
      ...(visionEn !== undefined && { visionEn }),
      ...(missionVi !== undefined && { missionVi }),
      ...(missionEn !== undefined && { missionEn }),
      ...(valuesVi !== undefined && { valuesVi }),
      ...(valuesEn !== undefined && { valuesEn }),
    },
  });

  return NextResponse.json({ content });
}
