// 批量操作：批量删除 / 批量更新（系列、长短、状态、MOQ 等）
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, normalizeProduct, saveProduct } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";
import { kvPutJSON } from "@/lib/kv-storage";
import type { Product } from "@/lib/types";

export const runtime = "edge";

const KEY = "products";

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:edit");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  const body = await req.json();
  const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String) : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "未选择产品" }, { status: 400 });
  }
  const list = (await getAllProducts(true)) || [];
  const idSet = new Set(ids);
  const targets = list.filter((p) => idSet.has(p.id));

  if (body.action === "delete") {
    const rest = list.filter((p) => !idSet.has(p.id));
    await kvPutJSON(KEY, rest);
    return NextResponse.json({ ok: true, deleted: targets.length });
  }

  if (body.action === "update") {
    const patch = body.patch || {};
    let updated = 0;
    const rest = list.map((p) => {
      if (!idSet.has(p.id)) return p;
      updated++;
      return normalizeProduct({ ...p, ...patch, id: p.id, slug: p.slug });
    });
    await kvPutJSON(KEY, rest);
    return NextResponse.json({ ok: true, updated });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
