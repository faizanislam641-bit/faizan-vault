import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  try {
    jwt.verify(token!, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { public_id } = await req.json();
  await cloudinary.uploader.destroy(public_id);
  return NextResponse.json({ ok: true });
}