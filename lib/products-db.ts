// 产品数据层：KV key "products"，首读时用种子数据初始化
import { kvGetJSON, kvPutJSON, kvSeedIfEmpty } from "./kv-storage";
import type { Product } from "./types";
import { seedProducts } from "@/data/products";
import { buildDescription } from "@/data/pdp-copy";

const KEY = "products";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// 补全缺省字段：slug、状态、品类模板生成的描述/卖点/规格、时间戳
export function normalizeProduct(raw: Partial<Product>): Product {
  const nameEn = raw.name?.en || "";
  const now = new Date().toISOString();
  const p: Product = {
    id: raw.id || `p-${Math.random().toString(36).slice(2, 8)}`,
    slug: raw.slug || (raw.id ? `${raw.id.toLowerCase()}-${slugify(nameEn)}` : slugify(nameEn)),
    name: { en: nameEn, zh: raw.name?.zh || nameEn },
    category: (raw.category as Product["category"]) || "accessories",
    catLabel: raw.catLabel || { en: "Accessories", zh: "配件" },
    series: raw.series || "",
    seriesLabel: raw.seriesLabel || { en: raw.series || "", zh: raw.series || "" },
    price: Number(raw.price) || 0,
    unit: raw.unit || "pc",
    moq: Number(raw.moq) || 1,
    sample: !!raw.sample,
    oem: !!raw.oem,
    shape: raw.shape || "—",
    clearance: !!raw.clearance,
    newArrival: !!raw.newArrival,
    bestSeller: !!raw.bestSeller,
    custom: !!raw.custom,
    region: (raw.region || "") as Product["region"],
    image: raw.image || "",
    alt: raw.alt || nameEn,
    gallery: raw.gallery || [],
    status: raw.status || "draft",
    seoTitle: raw.seoTitle,
    seoDesc: raw.seoDesc,
    createdAt: raw.createdAt || now,
    updatedAt: now,
  };
  // 描述/卖点/规格为空时按品类模板生成
  if (!raw.description || !raw.features || !raw.specs) {
    const built = buildDescription(p);
    p.description = raw.description || built.description;
    p.features = raw.features || built.features;
    p.specs = raw.specs || built.specs;
  }
  return p;
}

export async function getAllProducts(includeDrafts = false): Promise<Product[]> {
  const list = (await kvSeedIfEmpty<Product[]>(KEY, seedProducts())) || [];
  return includeDrafts ? list : list.filter((p) => p.status === "published");
}

export async function getProductById(id: string): Promise<Product | null> {
  const list = await getAllProducts(true);
  return list.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const list = await getAllProducts();
  return list.find((p) => p.slug === slug) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const list = (await getAllProducts(true)) || [];
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.unshift(product);
  await kvPutJSON(KEY, list);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const list = await getAllProducts(true);
  await kvPutJSON(KEY, list.filter((p) => p.id !== id));
}

// 同品类下一个 SKU 序号：FL-LAS-001
export async function nextSku(category: string, prefix: string): Promise<string> {
  const list = await getAllProducts(true);
  const re = new RegExp(`^FL-${prefix}-(\\d{3})$`);
  let max = 0;
  for (const p of list) {
    const m = re.exec(p.id.toUpperCase());
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `FL-${prefix}-${String(max + 1).padStart(3, "0")}`;
}
