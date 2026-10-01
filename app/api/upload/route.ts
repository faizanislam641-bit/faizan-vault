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

  const data = await req.formData();
  const file = data.get("file") as File;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "vault",
    resource_type: "image",
    quality: "100",
  });

  return NextResponse.json({
    url: result.secure_url,
    public_id: result.public_id,
  });
}