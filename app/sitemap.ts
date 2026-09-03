// 动态 sitemap：所有公开页面（产品/博客/政策/营销/表单）
import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products-db";
import { getAllPosts } from "@/lib/blog-db";
import { PAGE_SLUGS } from "@/data/pages";

// 与其他页面保持一致：edge 运行时 + 每次请求生成。
// 否则会在构建期静态生成，而构建环境没有 KV 绑定，会回落到 data/products.ts 的
// 种子数据，导致 sitemap 里全是 KV 中不存在的失效 slug。
export const runtime = "edge";
export const dynamic = "force-dynamic";

const BASE = "https://www.florinwholesale.com";

const COLLECTIONS = [
  "/wholesale/",
  "/false-lashes-wholesale/",
  "/press-on-nails-wholesale/",
  "/colored-contacts-wholesale/",
  "/new-arrivals/",
  "/best-sellers/",
  "/flash-deals-clearance/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getAllProducts(), getAllPosts()]);

  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    ...COLLECTIONS.map((p) => ({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${BASE}/product/${p.slug}/`,
      lastModified: new Date(p.updatedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/blog/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((b) => ({
      url: `${BASE}/blog/${b.slug}/`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...PAGE_SLUGS.filter((s) => s !== "thank-you").map((s) => ({
      url: `${BASE}/${s}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
  return urls;
}
