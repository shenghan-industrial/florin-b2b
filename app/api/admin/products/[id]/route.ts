// 产品详情 / 更新 / 删除
import { NextRequest, NextResponse } from "next/server";
import { getProductById, normalizeProduct, saveProduct, deleteProduct } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProductById(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ product: p });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "product:edit");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json();
  const merged = normalizeProduct({ ...existing, ...body, id: existing.id });
  const saved = await saveProduct(merged);
  return NextResponse.json({ product: saved });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "product:delete");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
