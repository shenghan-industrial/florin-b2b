// 产品列表 / 新增
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, normalizeProduct, saveProduct } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";
import { CATEGORY_LABEL, SERIES_LABELS } from "@/data/catalog";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  // GET 允许公开读（middleware PUBLIC_READ）——前台目录也可用
  const list = await getAllProducts(true);
  return NextResponse.json({ products: list });
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:create");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  const body = await req.json();
  const category = body.category as keyof typeof CATEGORY_LABEL;
  if (!CATEGORY_LABEL[category]) {
    return NextResponse.json({ error: "品类无效" }, { status: 400 });
  }
  if (!body.name?.en && !body.name?.zh) {
    return NextResponse.json({ error: "产品名称必填" }, { status: 400 });
  }

  // 从 catalog 补全品类/系列双语标签与默认图
  const raw = {
    ...body,
    catLabel: CATEGORY_LABEL[category],
    seriesLabel:
      body.series && SERIES_LABELS[body.series]
        ? SERIES_LABELS[body.series]
        : { en: body.series || "", zh: body.series || "" },
    image: body.image || "",
  };
  const product = normalizeProduct(raw);
  const saved = await saveProduct(product);
  return NextResponse.json({ product: saved });
}
