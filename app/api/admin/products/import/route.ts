// CSV 批量导入：name,nameZh,category,series,price,moq,unit,sample,oem,shape
import { NextRequest, NextResponse } from "next/server";
import { normalizeProduct, saveProduct, getAllProducts } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";
import { CATEGORY_LABEL, CATEGORY_CODES, SERIES_LABELS } from "@/data/catalog";
import type { CategoryId } from "@/lib/types";

export const runtime = "edge";

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:create");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  const body = await req.json();
  const rows = parseCsv(String(body.csv || ""));
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV 至少需要表头 + 1 行数据" }, { status: 400 });
  }
  const header = rows[0];
  const col = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

  const iName = col("name");
  const iNameZh = col("namezh");
  const iCat = col("category");
  const iSeries = col("series");
  const iPrice = col("price");
  const iMoq = col("moq");
  const iUnit = col("unit");
  const iSample = col("sample");
  const iOem = col("oem");
  const iShape = col("shape");
  const iImage = col("image");
  if (iName < 0 || iCat < 0) {
    return NextResponse.json({ error: "CSV 至少需要 name 与 category 两列" }, { status: 400 });
  }

  const existing = await getAllProducts(true);
  const created = [];
  let seq = 0;
  for (const row of rows.slice(1)) {
    const nameEn = row[iName];
    if (!nameEn) continue;
    const catRaw = (row[iCat] || "accessories").toLowerCase();
    const category: CategoryId = ["lashes", "nails", "contacts", "accessories"].includes(catRaw)
      ? (catRaw as CategoryId)
      : "accessories";
    const series = row[iSeries] || "";
    seq += 1;
    const id = `FL-${CATEGORY_CODES[category]}-${String(existing.length + seq).padStart(3, "0")}`;
    const product = normalizeProduct({
      id,
      name: { en: nameEn, zh: row[iNameZh] || nameEn },
      category,
      catLabel: CATEGORY_LABEL[category],
      series,
      seriesLabel: SERIES_LABELS[series] || { en: series, zh: series },
      price: Number(row[iPrice]) || 1.0,
      moq: Number(row[iMoq]) || 10,
      unit: row[iUnit] || "pair",
      sample: (row[iSample] || "yes").toLowerCase() !== "no",
      oem: (row[iOem] || "yes").toLowerCase() !== "no",
      shape: row[iShape] || "—",
      custom: true,
      status: "published",
      image: row[iImage] || "",
      alt: nameEn,
    });
    const saved = await saveProduct(product);
    created.push(saved);
  }
  return NextResponse.json({ ok: true, created: created.length });
}
