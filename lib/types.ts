// 全站数据模型（中英双语）

export interface MultiLangText {
  en: string;
  zh: string;
}

export interface MultiLangArray {
  en: string[];
  zh: string[];
}

export interface MultiLangSpecs {
  en: { label: string; value: string }[];
  zh: { label: string; value: string }[];
}

export type CategoryId = "lashes" | "nails" | "contacts" | "accessories";

export type RegionId = "" | "apac" | "eu-na" | "ru-me";

export interface Product {
  id: string; // 'L01'
  slug: string; // 'l01-natural-daily-3d-lashes'
  name: MultiLangText;
  category: CategoryId;
  catLabel: MultiLangText;
  series: string; // 系列 id
  seriesLabel: MultiLangText;
  price: number;
  unit: string; // pair | set | pc | box
  moq: number;
  sample: boolean;
  oem: boolean;
  shape: string;
  clearance: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  custom: boolean;
  region?: RegionId; // 畅销分区：apac 亚太 / eu-na 欧美 / ru-me 俄中东（空 = 未分区）
  image: string; // 图片 URL（占位或 Cloudinary）
  alt: string;
  gallery?: string[];
  description?: MultiLangText;
  features?: MultiLangArray;
  specs?: MultiLangSpecs;
  status: "draft" | "published" | "archived";
  seoTitle?: MultiLangText;
  seoDesc?: MultiLangText;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: MultiLangText;
  lead: MultiLangText;
  bodyHtml: MultiLangText; // {en,zh} 各自完整 HTML
  category: string;
  cover?: string;
  seoTitle?: MultiLangText;
  seoDesc?: MultiLangText;
  status: "draft" | "published";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadType = "inquiry" | "sample" | "live-selection" | "catalog" | "newsletter";

export interface Lead {
  id: string;
  type: LeadType;
  company?: string;
  name: string;
  whatsapp?: string;
  email: string;
  country?: string;
  quantity?: string;
  categories?: string[];
  message?: string;
  product?: string;
  status: "new" | "contacted" | "quoted" | "won" | "closed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  image: string;
  link: string;
  title: MultiLangText;
  sub: MultiLangText;
  btn: MultiLangText;
}

export interface ReviewItem {
  name: string;
  location: string;
  rating: number;
  text: MultiLangText;
}

export interface SiteContent {
  topbar: MultiLangText;
  hero: { slides: HeroSlide[] };
  promoBanner: { title: MultiLangText; sub: MultiLangText; link: string };
  reviews: { badge: MultiLangText; items: ReviewItem[] };
  whatsapp: string;
  contactEmail: string;
}
