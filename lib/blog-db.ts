// 博客数据层：KV key "blog"，首读时用种子数据初始化
import { kvPutJSON, kvSeedIfEmpty } from "./kv-storage";
import type { BlogPost } from "./types";
import { seedBlog } from "@/data/blog";

const KEY = "blog";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function normalizePost(raw: Partial<BlogPost>): BlogPost {
  const now = new Date().toISOString();
  const titleEn = raw.title?.en || "";
  return {
    id: raw.id || `b-${Math.random().toString(36).slice(2, 8)}`,
    slug: raw.slug || slugify(titleEn).slice(0, 80),
    title: { en: titleEn, zh: raw.title?.zh || titleEn },
    lead: { en: raw.lead?.en || "", zh: raw.lead?.zh || raw.lead?.en || "" },
    bodyHtml: { en: raw.bodyHtml?.en || "", zh: raw.bodyHtml?.zh || raw.bodyHtml?.en || "" },
    category: raw.category || "General",
    cover: raw.cover,
    seoTitle: raw.seoTitle,
    seoDesc: raw.seoDesc,
    status: raw.status || "draft",
    publishedAt: raw.publishedAt || now,
    createdAt: raw.createdAt || now,
    updatedAt: now,
  };
}

export async function getAllPosts(includeDrafts = false): Promise<BlogPost[]> {
  const list = (await kvSeedIfEmpty<BlogPost[]>(KEY, seedBlog())) || [];
  const sorted = [...list].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  return includeDrafts ? sorted : sorted.filter((p) => p.status === "published");
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const list = await getAllPosts(true);
  return list.find((p) => p.id === id) || null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const list = await getAllPosts();
  return list.find((p) => p.slug === slug) || null;
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  const list = await getAllPosts(true);
  const idx = list.findIndex((p) => p.id === post.id);
  if (idx >= 0) list[idx] = post;
  else list.unshift(post);
  await kvPutJSON(KEY, list);
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const list = await getAllPosts(true);
  await kvPutJSON(KEY, list.filter((p) => p.id !== id));
}
