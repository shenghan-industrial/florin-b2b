"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { pickLang } from "@/lib/localize";
import type { BlogPost } from "@/lib/types";

export default function BlogArticleContent({ post }: { post: BlogPost }) {
  const lang = useLang();
  const title = pickLang(post.title, lang);
  const lead = pickLang(post.lead, lang);
  const body = pickLang(post.bodyHtml, lang) || post.bodyHtml.en;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="article">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blog/">Blog</Link>
        <span>/</span>
        <span>{post.category}</span>
      </nav>
      <div className="article__hero">
        <span>{post.category}</span>
        <h1>{title}</h1>
        {date && <time>{date}</time>}
      </div>
      <div className="article__body">
        <p className="article__lead">{lead}</p>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      <div className="article__links">
        <Link className="btn btn--line" href="/blog/">{lang === "zh" ? "← 返回博客" : "← Back to Blog"}</Link>
        <Link className="btn btn--gold" href="/business-inquiry/">{lang === "zh" ? "商务咨询 →" : "Business Inquiry →"}</Link>
      </div>
    </article>
  );
}
