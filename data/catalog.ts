// 品类/系列双语静态目录（后台可改的名称存于 KV 的 site-content，这里是编译期兜底）
import type { CategoryId, MultiLangText } from "@/lib/types";

export interface CategoryDef {
  id: CategoryId;
  name: MultiLangText;
  url: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "lashes", name: { en: "False Lashes", zh: "假睫毛" }, url: "/false-lashes-wholesale/" },
  { id: "nails", name: { en: "Press-On Nails", zh: "穿戴甲" }, url: "/press-on-nails-wholesale/" },
  { id: "contacts", name: { en: "Colored Contacts", zh: "美瞳" }, url: "/colored-contacts-wholesale/" },
  { id: "accessories", name: { en: "Accessories", zh: "配件" }, url: "/wholesale/" },
];

export const CATEGORY_LABEL: Record<CategoryId, MultiLangText> = {
  lashes: { en: "False Lashes", zh: "假睫毛" },
  nails: { en: "Press-On Nails", zh: "穿戴甲" },
  contacts: { en: "Colored Contacts", zh: "美瞳" },
  accessories: { en: "Accessories", zh: "配件" },
};

export const SERIES_LABELS: Record<string, MultiLangText> = {
  "Natural Daily Lashes": { en: "Natural Daily Lashes", zh: "自然日常系列" },
  "Volume Lashes": { en: "Volume Lashes", zh: "浓密系列" },
  "Cat-Eye Lashes": { en: "Cat-Eye Lashes", zh: "猫眼系列" },
  "3D Art Sculpted": { en: "3D Art Sculpted", zh: "3D艺术浮雕" },
  "Cat-Eye": { en: "Cat-Eye", zh: "猫眼" },
  "Solid-color": { en: "Solid Color", zh: "纯色" },
  "Rhinestone Luxury": { en: "Rhinestone Luxury", zh: "水钻奢华" },
  "Short Daily Casual": { en: "Short Daily Casual", zh: "短款日常休闲" },
  "Natural Enhancement": { en: "Natural Enhancement", zh: "自然放大" },
  "Soft Hybrid": { en: "Soft Hybrid", zh: "柔和混血" },
  "Bold Cosplay": { en: "Bold Cosplay", zh: "大胆Cosplay" },
  Tools: { en: "Tools", zh: "工具" },
  Packaging: { en: "Packaging", zh: "包装" },
};

export const PLACEHOLDER_IMG: Record<CategoryId, string> = {
  lashes: "/assets/images/placeholders/product-lashes.svg",
  nails: "/assets/images/placeholders/product-nails.svg",
  contacts: "/assets/images/placeholders/product-contacts.svg",
  accessories: "/assets/images/placeholders/product-accessories.svg",
};

export const UNIT_LABEL: Record<string, MultiLangText> = {
  pair: { en: "pair", zh: "对" },
  set: { en: "set", zh: "套" },
  pc: { en: "pc", zh: "片" },
  box: { en: "box", zh: "盒" },
};

// SKU 品类前缀
export const CATEGORY_CODES: Record<CategoryId, string> = {
  lashes: "LAS",
  nails: "NAT",
  contacts: "CON",
  accessories: "ACC",
};
