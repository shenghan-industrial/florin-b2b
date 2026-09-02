import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog-db";
import BlogArticleContent from "@/components/BlogArticleContent";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle?.en || post.title.en,
    description: post.seoDesc?.en || post.lead.en,
    alternates: { canonical: `/blog/${slug}/` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <BlogArticleContent post={post} />
      </div>
    </section>
  );
}
