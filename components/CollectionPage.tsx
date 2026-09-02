"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// 集合页：筛选条（品类/MOQ/形状/贴牌/拿样）+ 产品网格 + 计数（静态站 initProductFilter 的 React 版）
export default function CollectionPage({
  products,
  pageSlug,
  showCategoryFilter = false,
  breadcrumb,
}: {
  products: Product[];
  pageSlug: string;
  showCategoryFilter?: boolean;
  breadcrumb: { name: string; href: string }[];
}) {
  const { t, lang } = useT();
  const title = t(`page.${pageSlug}.h1`);
  const eyebrow = t(`page.${pageSlug}.eyebrow`);
  const lead = t(`page.${pageSlug}.lead`);
  const [fCat, setFCat] = useState("all");
  const [fSeries, setFSeries] = useState("all");
  const [fMoq, setFMoq] = useState("all");
  const [fShape, setFShape] = useState("all");
  const [fOem, setFOem] = useState(false);
  const [fSample, setFSample] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 48;

  const shapes = useMemo(() => {
    const s = new Set(products.map((p) => p.shape).filter((x) => x && x !== "—"));
    return Array.from(s).sort();
  }, [products]);

  const series = useMemo(() => {
    const s = new Set(products.map((p) => p.series).filter(Boolean));
    return Array.from(s).sort();
  }, [products]);

  const seriesLabel = (id: string) => {
    const p = products.find((x) => x.series === id);
    if (!p) return id;
    return lang === "zh" ? p.seriesLabel.zh : p.seriesLabel.en;
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (fCat !== "all" && p.category !== fCat) return false;
      if (fSeries !== "all" && p.series !== fSeries) return false;
      if (fMoq !== "all" && p.moq > Number(fMoq)) return false;
      if (fShape !== "all" && p.shape !== fShape) return false;
      if (fOem && !p.oem) return false;
      if (fSample && !p.sample) return false;
      return true;
    });
  }, [products, fCat, fSeries, fMoq, fShape, fOem, fSample]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 筛选变化时回到第 1 页
  const setFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const goPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setFCat("all");
    setFMoq("all");
    setFShape("all");
    setFOem(false);
    setFSample(false);
    setPage(1);
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {breadcrumb.map((b, i) => (
            <span key={i}>
              <span>/</span>
              {i === breadcrumb.length - 1 ? <span>{b.name}</span> : <Link href={b.href}>{b.name}</Link>}
            </span>
          ))}
        </nav>
        <div className="eyebrow">{eyebrow}</div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>{title}</h1>
        <p className="muted" style={{ margin: "14px 0 28px", fontSize: 16 }}>{lead}</p>

        <div className="filters" data-filter="">
          <div className="filters__group">
            <label>{t("filter.category")}</label>
            <select value={fCat} onChange={(e) => setFilter(() => setFCat(e.target.value))}>
              <option value="all">{t("filter.all")}</option>
              {showCategoryFilter && (
                <>
                  <option value="lashes">{lang === "zh" ? "假睫毛" : "False Lashes"}</option>
                  <option value="nails">{lang === "zh" ? "穿戴甲" : "Press-On Nails"}</option>
                  <option value="contacts">{lang === "zh" ? "美瞳" : "Colored Contacts"}</option>
                  <option value="accessories">{lang === "zh" ? "配件" : "Accessories"}</option>
                </>
              )}
            </select>
          </div>
          <div className="filters__group">
            <label>{lang === "zh" ? "系列" : "Series"}</label>
            <select value={fSeries} onChange={(e) => setFilter(() => setFSeries(e.target.value))}>
              <option value="all">{t("filter.all")}</option>
              {series.map((s) => (
                <option key={s} value={s}>{seriesLabel(s)}</option>
              ))}
            </select>
          </div>
          <div className="filters__group">
            <label>{t("filter.moq")}</label>
            <select value={fMoq} onChange={(e) => setFilter(() => setFMoq(e.target.value))}>
              <option value="all">{t("filter.all")}</option>
              {[1, 3, 5, 10, 30, 50, 100].map((m) => (
                <option key={m} value={m}>≤ {m}</option>
              ))}
            </select>
          </div>
          <div className="filters__group">
            <label>{t("filter.shape")}</label>
            <select value={fShape} onChange={(e) => setFilter(() => setFShape(e.target.value))}>
              <option value="all">{t("filter.all")}</option>
              {shapes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="filters__group filters__group--chk">
            <label className="chk">
              <input type="checkbox" checked={fOem} onChange={(e) => setFilter(() => setFOem(e.target.checked))} />
              {t("filter.oem")}
            </label>
            <label className="chk">
              <input type="checkbox" checked={fSample} onChange={(e) => setFilter(() => setFSample(e.target.checked))} />
              {t("filter.sample")}
            </label>
          </div>
          <button className="filters__reset btn btn--line" onClick={reset}>{t("filter.reset")}</button>
        </div>

        <p className="filters__count" data-count="">
          {t("filter.showing")} {filtered.length} / {products.length}
          {totalPages > 1 && (
            <span style={{ marginLeft: 12, fontSize: 12 }}>
              · {lang === "zh" ? `第 ${page} / ${totalPages} 页` : `Page ${page} / ${totalPages}`}
            </span>
          )}
        </p>

        <div className="product-grid" data-grid="">
          {pageItems.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="muted" style={{ textAlign: "center", padding: 40 }}>
            {lang === "zh" ? "暂无可匹配的产品，试试重置筛选条件。" : "No products match this filter yet."}
          </p>
        )}

        {totalPages > 1 && (
          <div className="pagination" style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn--line" style={{ padding: "8px 14px", fontSize: 13 }} disabled={page === 1} onClick={() => goPage(page - 1)}>
              {lang === "zh" ? "‹ 上一页" : "‹ Prev"}
            </button>
            {(() => {
              const pages = new Set<number>([1, 2, totalPages - 1, totalPages, page - 2, page - 1, page, page + 1, page + 2]);
              const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
              const out: (number | string)[] = [];
              let prev = 0;
              for (const n of sorted) {
                if (prev && n - prev > 1) out.push("...");
                out.push(n);
                prev = n;
              }
              return out;
            })().map((n, i) =>
              n === "..." ? (
                <span key={`e${i}`} style={{ padding: "8px 4px", color: "var(--ink-faint)" }}>…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => goPage(n as number)}
                  className={page === n ? "btn btn--gold" : "btn btn--line"}
                  style={{ padding: "8px 14px", fontSize: 13, minWidth: 44, justifyContent: "center" }}
                >
                  {n}
                </button>
              )
            )}
            <button className="btn btn--line" style={{ padding: "8px 14px", fontSize: 13 }} disabled={page === totalPages} onClick={() => goPage(page + 1)}>
              {lang === "zh" ? "下一页 ›" : "Next ›"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
