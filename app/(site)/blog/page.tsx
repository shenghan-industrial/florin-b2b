import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio & Insights | Florin Wholesale",
  description:
    "B2B buying guides and sourcing insights for lashes, nails and colored contacts.",
};

export default async function BlogHubPage() {
  const posts = await getAllPosts();
  return (
    <section className="section">
      <div className="container">
        <div className="eyebrow">Resources</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>Studio & Insights</h1>
        <p className="muted" style={{ margin: "14px 0 28px", fontSize: 16 }}>
          B2B buying guides and sourcing insights for lashes, nails and colored contacts.
        </p>
        <div className="blog-grid">
          {posts.map((b) => (
            <Link key={b.id} className="blog-card" href={`/blog/${b.slug}/`} style={{ textDecoration: "none" }}>
              <div
                className="blog-card__media"
                role="img"
                aria-label={`Blog cover: ${b.title.en}`}
                style={{
                  backgroundImage: `url('${b.cover || "/assets/images/placeholders/blog.svg"}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="blog-card__body">
                <div className="blog-card__cat">{b.category}</div>
                <h4>{b.title.en}</h4>
                <p>{b.lead.en}</p>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && <p className="muted">No articles yet.</p>}
      </div>
    </section>
  );
}
