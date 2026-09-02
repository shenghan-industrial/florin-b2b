// 图片上传：Cloudinary 优先（folder=florin），本地 public/uploads 兜底
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { validateImage, saveLocal, extForMime } from "@/lib/image-service";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:create");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  let file: File;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (!(f instanceof File)) throw new Error("no file");
    file = f;
  } catch {
    return NextResponse.json({ error: "缺少文件字段" }, { status: 400 });
  }

  const v = validateImage(file);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  // 先试 Cloudinary
  const cloud = await uploadToCloudinary(file);
  if (cloud) {
    return NextResponse.json({
      ok: true,
      url: cloud.url,
      original: cloud.original,
      thumbnail: cloud.thumbnail,
      medium: cloud.medium,
      large: cloud.large,
    });
  }

  // 本地兜底（dev）
  const bytes = new Uint8Array(await file.arrayBuffer());
  const localUrl = await saveLocal(bytes, extForMime(file.type));
  if (!localUrl) {
    return NextResponse.json({ error: "上传服务未配置（缺少 Cloudinary 凭证）" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, url: localUrl, original: localUrl, thumbnail: localUrl, medium: localUrl, large: localUrl });
}
