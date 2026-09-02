// 博客列表 / 新增
import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, normalizePost, savePost } from "@/lib/blog-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  const posts = await getAllPosts(true);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "blog:manage");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const body = await req.json();
  if (!body.title?.en && !body.title?.zh) {
    return NextResponse.json({ error: "标题必填" }, { status: 400 });
  }
  const post = normalizePost(body);
  const saved = await savePost(post);
  return NextResponse.json({ post: saved });
}
