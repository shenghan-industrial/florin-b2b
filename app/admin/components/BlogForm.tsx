"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import ImageUpload from "./ImageUpload";

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line-strong)",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  background: "var(--bg)",
  color: "var(--ink)",
  width: "100%",
  minWidth: 0,
};
const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 12,
  fontWeight: 600,
  color: "var(--ink-soft)",
  minWidth: 0,
};

export default function BlogForm({ post, isNew }: { post?: BlogPost; isNew?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    titleEn: post?.title?.en || "",
    titleZh: post?.title?.zh || "",
    leadEn: post?.lead?.en || "",
    leadZh: post?.lead?.zh || "",
    bodyEn: post?.bodyHtml?.en || "",
    bodyZh: post?.bodyHtml?.zh || "",
    category: post?.category || "Press-On Nails",
    cover: post?.cover || "",
    status: post?.status || "draft",
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.titleEn.trim() && !f.titleZh.trim()) {
      setError("标题必填");
      return;
    }
    setBusy(true);
    setError("");
    const payload = {
      title: { en: f.titleEn.trim(), zh: f.titleZh.trim() },
      lead: { en: f.leadEn.trim(), zh: f.leadZh.trim() },
      bodyHtml: { en: f.bodyEn, zh: f.bodyZh || f.bodyEn },
      category: f.category,
      cover: f.cover || undefined,
      status: f.status,
    };
    try {
      const r = await fetch(isNew ? "/api/admin/blog" : `/api/admin/blog/${post!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "保存失败");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, maxWidth: 900 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>{isNew ? "新建文章" : `编辑文章：${post?.id || ""}`}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
        <label style={labelStyle}>
          英文标题 *
          <input style={inputStyle} value={f.titleEn} onChange={set("titleEn")} />
        </label>
        <label style={labelStyle}>
          中文标题
          <input style={inputStyle} value={f.titleZh} onChange={set("titleZh")} />
        </label>
        <label style={labelStyle}>
          英文摘要
          <textarea style={{ ...inputStyle, minHeight: 56, fontFamily: "inherit" }} value={f.leadEn} onChange={set("leadEn")} />
        </label>
        <label style={labelStyle}>
          中文摘要
          <textarea style={{ ...inputStyle, minHeight: 56, fontFamily: "inherit" }} value={f.leadZh} onChange={set("leadZh")} />
        </label>
        <label style={labelStyle}>
          分类
          <select style={inputStyle} value={f.category} onChange={set("category")}>
            <option>False Lashes</option>
            <option>Press-On Nails</option>
            <option>Colored Contacts</option>
            <option>Sourcing Guide</option>
          </select>
        </label>
        <label style={labelStyle}>
          状态
          <select style={inputStyle} value={f.status} onChange={set("status")}>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </label>
      </div>
      <div>
        <span style={{ ...labelStyle, marginBottom: 6 }}>封面图</span>
        <ImageUpload value={f.cover} onChange={(url) => setF((prev) => ({ ...prev, cover: url }))} />
      </div>
      <label style={labelStyle}>
        英文正文（HTML：p / h2 / ul / li）
        <textarea style={{ ...inputStyle, minHeight: 260, fontFamily: "monospace" }} value={f.bodyEn} onChange={set("bodyEn")} />
      </label>
      <label style={labelStyle}>
        中文正文（HTML，留空则回退英文）
        <textarea style={{ ...inputStyle, minHeight: 260, fontFamily: "monospace" }} value={f.bodyZh} onChange={set("bodyZh")} />
      </label>
      {error && <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn--gold" type="submit" disabled={busy} style={{ minWidth: 160, justifyContent: "center" }}>
          {busy ? "保存中…" : "保存文章"}
        </button>
        <button className="btn btn--line" type="button" onClick={() => router.push("/admin/blog")}>取消</button>
      </div>
    </form>
  );
}
