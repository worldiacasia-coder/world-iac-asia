import { NextResponse } from "next/server";
import { getSession, isAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return NextResponse.json({ error: "Chưa chọn file." }, { status: 400 });

  const url = await uploadFile(file, "world-iac-asia/judges");
  return NextResponse.json({ url });
}
