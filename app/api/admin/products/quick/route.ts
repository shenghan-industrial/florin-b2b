// 快速批量新增：粘贴 "中文名称，简要描述" 行 → 自动生成中英双语产品
import { NextRequest, NextResponse } from "next/server";
import { normalizeProduct, saveProduct, getAllProducts } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";
import { CATEGORY_LABEL, CATEGORY_CODES, SERIES_LABELS } from "@/data/catalog";
import type { CategoryId } from "@/lib/types";

export const runtime = "edge";

// 中文关键词 → 英文名翻译（词典兜底，无需 AI）
const ZH2EN: [RegExp, string][] = [
  [/假睫毛|睫毛/g, "Lashes"],
  [/穿戴甲|美甲|甲片/g, "Nails"],
  [/美瞳|隐形眼镜|镜片/g, "Contacts"],
  [/胶水|胶/g, "Glue"],
  [/礼盒|包装盒|盒/g, "Box"],
  [/镊子|工具/g, "Tool Kit"],
  [/指甲锉|锉/g, "File"],
  [/抛光/g, "Buffer"],
  [/自然|日常/g, "Natural Daily"],
  [/浓密|蓬松|5D/g, "Volume Fluffy 5D"],
  [/猫眼/g, "Cat-Eye"],
  [/短款|短/g, "Short"],
  [/高级|貂毛/g, "Premium Mink Blend"],
  [/3D艺术|浮雕/g, "3D Art Sculpted"],
  [/法式/g, "French Tips"],
  [/凝胶/g, "Gel"],
  [/纯色|单色/g, "Solid Color"],
  [/水钻/g, "Rhinestone"],
  [/日抛/g, "1-Day"],
  [/周抛/g, "Weekly"],
  [/年抛/g, "Yearly"],
  [/混血/g, "Hybrid"],
  [/蜂蜜棕|棕色/g, "Honey Brown"],
  [/cosplay|角色扮演/gi, "Cosplay"],
  [/无乳胶/g, "Latex-Free"],
  [/贴牌/g, "Private-Label"],
  [/套装|套/g, "Set"],
];

function guessEnName(zh: string): string {
  let en = zh;
  for (const [re, enWord] of ZH2EN) en = en.replace(re, (m) => `${enWord} `);
  en = en.replace(/[一-龥，。、！？]/g, "").replace(/\s+/g, " ").trim();
  if (!en || en === zh) return "New Style";
  return en.split(" ").filter((w, i, a) => a.indexOf(w) === i).join(" ");
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:create");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  const body = await req.json();
  const category = (body.category as CategoryId) || "lashes";
  const price = Number(body.price) || 1.0;
  const moq = Number(body.moq) || 10;
  const unit = String(body.unit || "pair");
  const lines = String(body.lines || "")
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return NextResponse.json({ error: "请粘贴至少一行：中文名称，简要描述" }, { status: 400 });
  }

  const catLabel = CATEGORY_LABEL[category];
  const code = CATEGORY_CODES[category];
  const created = [];
  let seq = 0;
  const existing = await getAllProducts(true);
  for (const line of lines.slice(0, 50)) {
    const [zhPart, ...descParts] = line.split(/[,，]/);
    const nameZh = zhPart.trim();
    if (!nameZh) continue;
    const descZh = descParts.join("，").trim();
    const nameEn = guessEnName(nameZh);
    seq += 1;
    const id = `FL-${code}-${String(existing.length + seq).padStart(3, "0")}`;
    const product = normalizeProduct({
      id,
      name: { en: nameEn, zh: nameZh },
      category,
      catLabel,
      series: body.series || "Tools",
      seriesLabel: body.series && SERIES_LABELS[body.series] ? SERIES_LABELS[body.series] : { en: body.series || "", zh: body.series || "" },
      price,
      moq,
      unit,
      sample: !!body.sample,
      oem: !!body.oem,
      shape: body.shape || "—",
      custom: true,
      status: "published",
      description: descZh ? { en: `Factory-direct wholesale ${catLabel.en.toLowerCase()} — ${nameEn}. ${descZh}`, zh: descZh } : undefined,
      image: body.imagePrefix || "",
      alt: nameEn,
    });
    const saved = await saveProduct(product);
    created.push(saved);
  }
  return NextResponse.json({ ok: true, created: created.length, products: created });
}
