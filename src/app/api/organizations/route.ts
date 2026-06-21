import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const organizations = await prisma.organization.findMany({
    orderBy: { orgName: "asc" },
  });
  return NextResponse.json({ organizations });
}
