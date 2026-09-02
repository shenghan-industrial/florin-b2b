import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products-db";
import { getAllPosts } from "@/lib/blog-db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search | Florin Wholesale",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();

  let productResults: { name: string; href: string; cat: string }[] = [];
  let postResults: { title: string; href: string; cat: string }[] = [];

  if (query.length >= 2) {
    const products = await getAllProducts();
    const posts = await getAllPosts();
    productResults = products
      .filter(
        (p) =>
          p.name.en.toLowerCase().includes(query) ||
          p.name.zh.includes(query) ||
          p.series.toLowerCase().includes(query) ||
          p.catLabel.en.toLowerCase().includes(query)
      )
      .map((p) => ({ name: p.name.en, href: `/product/${p.slug}/`, cat: p.catLabel.en }));
    postResults = posts
      .filter((b) => b.title.en.toLowerCase().includes(query) || b.title.zh.includes(query) || b.category.toLowerCase().includes(query))
      .map((b) => ({ title: b.title.en, href: `/blog/${b.slug}/`, cat: b.category }));
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="eyebrow">Search</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>Search the Catalog</h1>
        <form method="get" style={{ display: "flex", gap: 10, margin: "24px 0" }}>
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search products, series, guides…"
            style={{
              flex: 1,
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              fontSize: 15,
              background: "var(--bg)",
              color: "var(--ink)",
            }}
          />
          <button className="btn btn--gold" type="submit">Search</button>
        </form>

        {query.length >= 2 ? (
          <>
            <h2 className="h-sub">Products ({productResults.length})</h2>
            <ul className="doc-list">
              {productResults.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.name}</Link>
                  <span className="muted" style={{ fontSize: 12 }}> · {r.cat}</span>
                </li>
              ))}
              {productResults.length === 0 && <li className="muted">No products match.</li>}
            </ul>
            <h2 className="h-sub" style={{ marginTop: 24 }}>Guides & Articles ({postResults.length})</h2>
            <ul className="doc-list">
              {postResults.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.title}</Link>
                  <span className="muted" style={{ fontSize: 12 }}> · {r.cat}</span>
                </li>
              ))}
              {postResults.length === 0 && <li className="muted">No articles match.</li>}
            </ul>
          </>
        ) : (
          <p className="muted">Type at least 2 characters to search.</p>
        )}
      </div>
    </section>
  );
}
