// 站点内容读取 / 保存
import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/site-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  try {
    requirePermission(req, "site:edit");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const body = await req.json();
  const existing = await getSiteContent();
  const merged = { ...existing, ...body };
  const saved = await saveSiteContent(merged);
  return NextResponse.json({ content: saved });
}
