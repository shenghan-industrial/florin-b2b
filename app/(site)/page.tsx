// 首页：服务端取数据 → 客户端渲染 18 模块
import { getAllProducts } from "@/lib/products-db";
import { getSiteContent } from "@/lib/site-db";
import { getAllPosts } from "@/lib/blog-db";
import HomeContent from "@/components/HomeContent";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, site, posts] = await Promise.all([
    getAllProducts(),
    getSiteContent(),
    getAllPosts(),
  ]);
  return <HomeContent products={products} site={site} posts={posts} />;
}
