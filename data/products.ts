// 18 个种子产品（由静态站 js/products.js 转换，补齐中文名）
// description/features/specs 由 lib/products-db.ts 的 normalizeProduct 按品类模板自动补齐
import type { Product } from "@/lib/types";
import { CATEGORY_LABEL, SERIES_LABELS, PLACEHOLDER_IMG } from "./catalog";

type SeedProduct = Omit<
  Product,
  "slug" | "catLabel" | "seriesLabel" | "status" | "image" | "alt" | "description" | "features" | "specs"
> & { image?: string; alt?: string };

const RAW: SeedProduct[] = [
  // ---- 假睫毛 ----
  { id: "L01", name: { en: "Natural Daily 3D Lashes", zh: "自然日常3D假睫毛" }, category: "lashes", series: "Natural Daily Lashes", price: 1.20, unit: "pair", moq: 10, sample: true, oem: true, shape: "Medium", clearance: false, newArrival: true, bestSeller: false, custom: true },
  { id: "L02", name: { en: "Volume Fluffy 5D Lashes", zh: "浓密蓬松5D假睫毛" }, category: "lashes", series: "Volume Lashes", price: 1.65, unit: "pair", moq: 10, sample: true, oem: true, shape: "Long", clearance: false, newArrival: false, bestSeller: true, custom: true },
  { id: "L03", name: { en: "Cat-Eye Charm Lashes", zh: "猫眼魅力假睫毛" }, category: "lashes", series: "Cat-Eye Lashes", price: 1.45, unit: "pair", moq: 10, sample: true, oem: true, shape: "Cat-eye", clearance: false, newArrival: false, bestSeller: true, custom: true },
  { id: "L04", name: { en: "Short Daily 3D Lashes", zh: "短款日常3D假睫毛" }, category: "lashes", series: "Natural Daily Lashes", price: 1.05, unit: "pair", moq: 5, sample: true, oem: true, shape: "Short", clearance: true, newArrival: false, bestSeller: false, custom: true },
  { id: "L05", name: { en: "Premium Mink Blend Lashes", zh: "高级貂毛混合假睫毛" }, category: "lashes", series: "Volume Lashes", price: 2.10, unit: "pair", moq: 10, sample: true, oem: true, shape: "Medium", clearance: false, newArrival: false, bestSeller: false, custom: true },

  // ---- 穿戴甲 ----
  { id: "N01", name: { en: "3D Art Sculpted French Tips", zh: "3D艺术浮雕法式甲" }, category: "nails", series: "3D Art Sculpted", price: 0.95, unit: "set", moq: 10, sample: true, oem: true, shape: "Almond", clearance: false, newArrival: true, bestSeller: false, custom: true },
  { id: "N02", name: { en: "Cat-Eye Gel Nails", zh: "猫眼凝胶穿戴甲" }, category: "nails", series: "Cat-Eye", price: 1.10, unit: "set", moq: 10, sample: true, oem: true, shape: "Coffin", clearance: false, newArrival: false, bestSeller: true, custom: true },
  { id: "N03", name: { en: "Solid Color Daily Set", zh: "纯色日常套装" }, category: "nails", series: "Solid-color", price: 0.80, unit: "set", moq: 30, sample: true, oem: true, shape: "Square", clearance: false, newArrival: false, bestSeller: true, custom: true },
  { id: "N04", name: { en: "Rhinestone Luxury Nails", zh: "水钻奢华穿戴甲" }, category: "nails", series: "Rhinestone Luxury", price: 1.35, unit: "set", moq: 10, sample: true, oem: true, shape: "Stiletto", clearance: false, newArrival: false, bestSeller: false, custom: true },
  { id: "N05", name: { en: "Short Daily Casual Nails", zh: "短款日常休闲穿戴甲" }, category: "nails", series: "Short Daily Casual", price: 0.85, unit: "set", moq: 5, sample: true, oem: true, shape: "Round", clearance: true, newArrival: false, bestSeller: false, custom: true },

  // ---- 美瞳 ----
  { id: "C01", name: { en: "Natural Enhancement 1-Day", zh: "自然放大日抛美瞳" }, category: "contacts", series: "Natural Enhancement", price: 1.50, unit: "pc", moq: 50, sample: true, oem: false, shape: "—", clearance: false, newArrival: true, bestSeller: true, custom: false },
  { id: "C02", name: { en: "Soft Hybrid Weekly", zh: "柔和混血周抛美瞳" }, category: "contacts", series: "Soft Hybrid", price: 1.35, unit: "pc", moq: 50, sample: true, oem: false, shape: "—", clearance: false, newArrival: false, bestSeller: true, custom: false },
  { id: "C03", name: { en: "Honey Brown Weekly", zh: "蜂蜜棕周抛美瞳" }, category: "contacts", series: "Natural Enhancement", price: 1.35, unit: "pc", moq: 50, sample: true, oem: false, shape: "—", clearance: false, newArrival: false, bestSeller: false, custom: false },
  { id: "C04", name: { en: "Bold Cosplay Yearly", zh: "大胆Cosplay年抛美瞳" }, category: "contacts", series: "Bold Cosplay", price: 2.20, unit: "pc", moq: 3, sample: true, oem: false, shape: "—", clearance: true, newArrival: false, bestSeller: false, custom: false },

  // ---- 配件 ----
  { id: "A01", name: { en: "Latex-Free Lash Glue", zh: "无乳胶睫毛胶水" }, category: "accessories", series: "Tools", price: 0.45, unit: "pc", moq: 100, sample: true, oem: true, shape: "—", clearance: false, newArrival: false, bestSeller: true, custom: true },
  { id: "A02", name: { en: "Private-Label Gift Box", zh: "贴牌礼盒" }, category: "accessories", series: "Packaging", price: 0.30, unit: "box", moq: 100, sample: false, oem: true, shape: "—", clearance: false, newArrival: false, bestSeller: false, custom: true },
  { id: "A03", name: { en: "Applicator Tool Kit", zh: "睫毛镊子工具套装" }, category: "accessories", series: "Tools", price: 0.60, unit: "set", moq: 50, sample: true, oem: true, shape: "—", clearance: false, newArrival: true, bestSeller: false, custom: true },
  { id: "A04", name: { en: "Nail File & Buffer Set", zh: "指甲锉与抛光条套装" }, category: "accessories", series: "Tools", price: 0.40, unit: "set", moq: 100, sample: true, oem: true, shape: "—", clearance: true, newArrival: false, bestSeller: false, custom: true },
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function seedProducts(): Product[] {
  return RAW.map((p) => ({
    ...p,
    slug: `${p.id.toLowerCase()}-${slugify(p.name.en)}`,
    catLabel: CATEGORY_LABEL[p.category],
    seriesLabel: SERIES_LABELS[p.series] || { en: p.series, zh: p.series },
    status: "published",
    image: p.image || PLACEHOLDER_IMG[p.category],
    alt: p.alt || p.name.en,
  }));
}
