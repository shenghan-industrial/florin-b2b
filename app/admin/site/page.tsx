"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import ImageUpload from "../components/ImageUpload";

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

const TABS = [
  { id: "topbar", label: "顶部公告" },
  { id: "hero", label: "首页轮播" },
  { id: "promo", label: "促销横幅" },
  { id: "reviews", label: "客户评价" },
  { id: "contact", label: "联系方式" },
];

export default function SiteAdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState("topbar");
  const [saved, setSaved] = useState("");

  async function load() {
    const r = await fetch("/api/admin/site/");
    if (r.ok) {
      const j = await r.json();
      setContent(j.content);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(patch: Partial<SiteContent>) {
    setSaved("");
    const r = await fetch("/api/admin/site/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (r.ok) {
      setSaved("✅ 已保存");
      setTimeout(() => setSaved(""), 2000);
      load();
    } else {
      setSaved("❌ 保存失败");
    }
  }

  if (!content) return <p style={{ color: "var(--ink-soft)" }}>加载中…</p>;

  const setTopbar = (lang: "en" | "zh") => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent((c) => c && { ...c, topbar: { ...c.topbar, [lang]: e.target.value } });

  const setSlide = (i: number, field: "title" | "sub" | "btn" | "link" | "image", lang: "en" | "zh") => (v: string) =>
    setContent((c) => {
      if (!c) return c;
      const slides = c.hero.slides.map((s, idx) => {
        if (idx !== i) return s;
        if (field === "link") return { ...s, link: v };
        if (field === "image") return { ...s, image: v };
        return { ...s, [field]: { ...s[field], [lang]: v } };
      });
      return { ...c, hero: { slides } };
    });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>站点内容编辑</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--line-strong)",
                background: tab === t.id ? "var(--gold)" : "var(--surface)",
                color: tab === t.id ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: saved.startsWith("✅") ? "#2e7d32" : "#c0392b" }}>{saved}</span>
      </div>

      <div style={{ maxWidth: 860, display: "grid", gap: 14 }}>
        {tab === "topbar" && (
          <>
            <label style={labelStyle}>
              顶部公告（英文）
              <textarea style={{ ...inputStyle, minHeight: 60, fontFamily: "inherit" }} value={content.topbar.en} onChange={setTopbar("en")} />
            </label>
            <label style={labelStyle}>
              顶部公告（中文）
              <textarea style={{ ...inputStyle, minHeight: 60, fontFamily: "inherit" }} value={content.topbar.zh} onChange={setTopbar("zh")} />
            </label>
            <button className="btn btn--gold" style={{ justifySelf: "start" }} onClick={() => save({ topbar: content.topbar })}>保存公告</button>
          </>
        )}

        {tab === "hero" && (
          <>
            {content.hero.slides.map((s, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 14, background: "var(--surface)", display: "grid", gap: 10 }}>
                <b style={{ fontSize: 14 }}>轮播 {i + 1}</b>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 0 }}>
                  <label style={labelStyle}>标题 EN<input style={inputStyle} value={s.title.en} onChange={(e) => setSlide(i, "title", "en")(e.target.value)} /></label>
                  <label style={labelStyle}>标题 中文<input style={inputStyle} value={s.title.zh} onChange={(e) => setSlide(i, "title", "zh")(e.target.value)} /></label>
                  <label style={labelStyle}>副标题 EN<textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} value={s.sub.en} onChange={(e) => setSlide(i, "sub", "en")(e.target.value)} /></label>
                  <label style={labelStyle}>副标题 中文<textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} value={s.sub.zh} onChange={(e) => setSlide(i, "sub", "zh")(e.target.value)} /></label>
                  <label style={labelStyle}>按钮 EN<input style={inputStyle} value={s.btn.en} onChange={(e) => setSlide(i, "btn", "en")(e.target.value)} /></label>
                  <label style={labelStyle}>按钮 中文<input style={inputStyle} value={s.btn.zh} onChange={(e) => setSlide(i, "btn", "zh")(e.target.value)} /></label>
                  <label style={labelStyle}>链接<input style={inputStyle} value={s.link} onChange={(e) => setSlide(i, "link", "en")(e.target.value)} /></label>
                  <div>
                    <span style={{ ...labelStyle, marginBottom: 6 }}>背景图</span>
                    <ImageUpload value={s.image} onChange={(url) => setSlide(i, "image", "en")(url)} />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn--gold" style={{ justifySelf: "start" }} onClick={() => save({ hero: content.hero })}>保存轮播</button>
          </>
        )}

        {tab === "promo" && (
          <>
            <label style={labelStyle}>促销标题 EN<input style={inputStyle} value={content.promoBanner.title.en} onChange={(e) => setContent((c) => c && { ...c, promoBanner: { ...c.promoBanner, title: { ...c.promoBanner.title, en: e.target.value } } })} /></label>
            <label style={labelStyle}>促销标题 中文<input style={inputStyle} value={content.promoBanner.title.zh} onChange={(e) => setContent((c) => c && { ...c, promoBanner: { ...c.promoBanner, title: { ...c.promoBanner.title, zh: e.target.value } } })} /></label>
            <label style={labelStyle}>副标题 EN<textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} value={content.promoBanner.sub.en} onChange={(e) => setContent((c) => c && { ...c, promoBanner: { ...c.promoBanner, sub: { ...c.promoBanner.sub, en: e.target.value } } })} /></label>
            <label style={labelStyle}>副标题 中文<textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} value={content.promoBanner.sub.zh} onChange={(e) => setContent((c) => c && { ...c, promoBanner: { ...c.promoBanner, sub: { ...c.promoBanner.sub, zh: e.target.value } } })} /></label>
            <label style={labelStyle}>链接<input style={inputStyle} value={content.promoBanner.link} onChange={(e) => setContent((c) => c && { ...c, promoBanner: { ...c.promoBanner, link: e.target.value } })} /></label>
            <button className="btn btn--gold" style={{ justifySelf: "start" }} onClick={() => save({ promoBanner: content.promoBanner })}>保存横幅</button>
          </>
        )}

        {tab === "reviews" && (
          <>
            <label style={labelStyle}>
              评分角标 EN / 中文
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 0 }}>
                <input style={inputStyle} value={content.reviews.badge.en} onChange={(e) => setContent((c) => c && { ...c, reviews: { ...c.reviews, badge: { ...c.reviews.badge, en: e.target.value } } })} />
                <input style={inputStyle} value={content.reviews.badge.zh} onChange={(e) => setContent((c) => c && { ...c, reviews: { ...c.reviews, badge: { ...c.reviews.badge, zh: e.target.value } } })} />
              </div>
            </label>
            {content.reviews.items.map((r, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, background: "var(--surface)", display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 0 }}>
                  <input style={inputStyle} placeholder="姓名" value={r.name} onChange={(e) => setContent((c) => {
                    if (!c) return c;
                    const items = c.reviews.items.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x));
                    return { ...c, reviews: { ...c.reviews, items } };
                  })} />
                  <input style={inputStyle} placeholder="地区" value={r.location} onChange={(e) => setContent((c) => {
                    if (!c) return c;
                    const items = c.reviews.items.map((x, idx) => (idx === i ? { ...x, location: e.target.value } : x));
                    return { ...c, reviews: { ...c.reviews, items } };
                  })} />
                </div>
                <textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} placeholder="英文评价" value={r.text.en} onChange={(e) => setContent((c) => {
                  if (!c) return c;
                  const items = c.reviews.items.map((x, idx) => (idx === i ? { ...x, text: { ...x.text, en: e.target.value } } : x));
                  return { ...c, reviews: { ...c.reviews, items } };
                })} />
                <textarea style={{ ...inputStyle, minHeight: 50, fontFamily: "inherit" }} placeholder="中文评价" value={r.text.zh} onChange={(e) => setContent((c) => {
                  if (!c) return c;
                  const items = c.reviews.items.map((x, idx) => (idx === i ? { ...x, text: { ...x.text, zh: e.target.value } } : x));
                  return { ...c, reviews: { ...c.reviews, items } };
                })} />
              </div>
            ))}
            <button className="btn btn--gold" style={{ justifySelf: "start" }} onClick={() => save({ reviews: content.reviews })}>保存评价</button>
          </>
        )}

        {tab === "contact" && (
          <>
            <label style={labelStyle}>WhatsApp 号码（国际格式，如 8613800000000）<input style={inputStyle} value={content.whatsapp} onChange={(e) => setContent((c) => c && { ...c, whatsapp: e.target.value })} /></label>
            <label style={labelStyle}>联系邮箱<input style={inputStyle} value={content.contactEmail} onChange={(e) => setContent((c) => c && { ...c, contactEmail: e.target.value })} /></label>
            <button className="btn btn--gold" style={{ justifySelf: "start" }} onClick={() => save({ whatsapp: content.whatsapp, contactEmail: content.contactEmail })}>保存联系方式</button>
          </>
        )}
      </div>
    </div>
  );
}
