// 博客详情 / 更新 / 删除
import { NextRequest, NextResponse } from "next/server";
import { getPostById, normalizePost, savePost, deletePost } from "@/lib/blog-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPostById(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ post: p });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "blog:manage");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const { id } = await params;
  const existing = await getPostById(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json();
  const merged = normalizePost({ ...existing, ...body, id: existing.id });
  const saved = await savePost(merged);
  return NextResponse.json({ post: saved });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "blog:manage");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ ok: true });
}
