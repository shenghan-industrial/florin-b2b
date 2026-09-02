"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch("/api/admin/blog/");
    if (r.ok) {
      const j = await r.json();
      setPosts(j.posts || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(p: BlogPost) {
    if (!confirm(`确定删除《${p.title.en}》？`)) return;
    await fetch(`/api/admin/blog/${p.id}/`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>博客文章（{posts.length}）</h2>
        <Link className="btn btn--gold" href="/admin/blog/new" style={{ textDecoration: "none", fontSize: 13 }}>＋ 新建文章</Link>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>加载中…</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {posts.map((p) => (
            <div
              key={p.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                  {p.category} · {new Date(p.publishedAt).toLocaleDateString("zh-CN")} ·{" "}
                  <span style={{ color: p.status === "published" ? "#2e7d32" : "var(--ink-faint)" }}>
                    {p.status === "published" ? "已发布" : "草稿"}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.title.en}
                </div>
              </div>
              <Link
                href={`/admin/blog/${p.id}/edit`}
                style={{ background: "var(--ink)", color: "#fff", borderRadius: 6, padding: "7px 14px", fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}
              >
                编辑
              </Link>
              {p.status === "published" && (
                <Link
                  href={`/blog/${p.slug}/`}
                  target="_blank"
                  style={{ border: "1px solid var(--line)", color: "var(--ink)", borderRadius: 6, padding: "7px 14px", fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  查看
                </Link>
              )}
              <button
                onClick={() => remove(p)}
                style={{ background: "none", border: "1px solid #e0c3c3", color: "#c0392b", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
