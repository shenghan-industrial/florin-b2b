"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

const CAT_TABS = [
  { id: "all", label: "全部" },
  { id: "lashes", label: "假睫毛" },
  { id: "nails", label: "穿戴甲" },
  { id: "contacts", label: "美瞳" },
  { id: "accessories", label: "配件" },
];
const PAGE_SIZE = 24;

// 窗口式页码：1 … 4 5 [6] 7 8 … 63
function pageList(cur: number, total: number): (number | "...")[] {
  const pages = new Set<number>([1, 2, total - 1, total, cur - 2, cur - 1, cur, cur + 1, cur + 2]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push("...");
    out.push(n);
    prev = n;
  }
  return out;
}

export default function AdminHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [series, setSeries] = useState("all");
  const [shape, setShape] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/products/");
    if (r.ok) {
      const j = await r.json();
      setProducts(j.products || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  async function remove(p: Product) {
    if (!confirm(`确定删除 ${p.name.en} ？此操作不可恢复。`)) return;
    await fetch(`/api/admin/products/${p.id}/`, { method: "DELETE" });
    load();
  }

  // ===== 批量选择与批量操作 =====
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchBusy, setBatchBusy] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = shown.length > 0 && shown.every((p) => selected.has(p.id));
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(shown.map((p) => p.id)));
    }
  };

  async function batch(action: "delete" | "update", patch?: Record<string, unknown>) {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`确定删除选中的 ${selected.size} 个产品？此操作不可恢复。`)) return;
    setBatchBusy(true);
    const r = await fetch("/api/admin/products/batch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids: [...selected], patch }),
    });
    const j = await r.json();
    if (!r.ok) alert(j.error || "操作失败");
    setSelected(new Set());
    setBatchBusy(false);
    load();
  }

  // 从产品数据派生系列/长短选项
  const seriesOptions = Array.from(new Set(products.map((p) => p.series).filter(Boolean))).sort();
  const shapeOptions = Array.from(new Set(products.map((p) => p.shape).filter((x) => x && x !== "—"))).sort();
  const seriesLabel = (id: string) => {
    const p = products.find((x) => x.series === id);
    return p ? p.seriesLabel.zh : id;
  };

  const shown = products.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (series !== "all" && p.series !== series) return false;
    if (shape !== "all" && p.shape !== shape) return false;
    if (q && !(p.name.en + p.name.zh + p.id).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const allFilteredSelected = shown.length > 0 && shown.every((p) => selected.has(p.id));
  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const pageItems = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>产品管理（{products.length}）</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {CAT_TABS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCat(c.id); setPage(1); }}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--line-strong)",
                background: cat === c.id ? "var(--gold)" : "var(--surface)",
                color: cat === c.id ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="搜索名称 / ID…"
          style={{ flex: 1, minWidth: 160, border: "1px solid var(--line-strong)", borderRadius: 8, padding: "7px 12px", fontSize: 13 }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-soft)" }}>
          系列
          <select
            value={series}
            onChange={(e) => { setSeries(e.target.value); setPage(1); }}
            style={{ border: "1px solid var(--line-strong)", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "var(--bg)", color: "var(--ink)" }}
          >
            <option value="all">全部系列</option>
            {seriesOptions.map((s) => (
              <option key={s} value={s}>{seriesLabel(s)}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-soft)" }}>
          长短
          <select
            value={shape}
            onChange={(e) => { setShape(e.target.value); setPage(1); }}
            style={{ border: "1px solid var(--line-strong)", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "var(--bg)", color: "var(--ink)" }}
          >
            <option value="all">全部长短</option>
            {shapeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          当前筛选 {shown.length} 个产品
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", cursor: "pointer", marginLeft: "auto" }}>
          <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} />
          全选当前筛选结果
        </label>
      </div>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>加载中…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {pageItems.map((p) => (
            <div
              key={p.id}
              style={{
                ...cardStyle,
                position: "relative",
                outline: selected.has(p.id) ? "2px solid var(--gold)" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleSelect(p.id)}
            >
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggleSelect(p.id)}
                onClick={(e) => e.stopPropagation()}
                style={{ position: "absolute", top: 10, left: 10, zIndex: 5, width: 18, height: 18, cursor: "pointer" }}
              />
              <div style={{ height: 150, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name.en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 40 }}>👁️</span>
                )}
              </div>
              <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{p.id} · {p.catLabel.zh || p.catLabel.en}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name.zh}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{p.name.en}</div>
                <div style={{ fontSize: 13, color: "var(--gold-deep)", fontWeight: 700 }}>
                  ${p.price.toFixed(2)} / {p.unit} · MOQ {p.moq}
                </div>
                <div style={{ fontSize: 11, color: p.status === "published" ? "#2e7d32" : "var(--ink-faint)" }}>
                  {p.status === "published" ? "● 已发布" : p.status === "draft" ? "○ 草稿" : "✕ 归档"}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }} onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    style={{ flex: 1, textAlign: "center", background: "var(--ink)", color: "#fff", borderRadius: 6, padding: "7px 0", fontSize: 12, textDecoration: "none" }}
                  >
                    编辑
                  </Link>
                  <Link
                    href={`/product/${p.slug}/`}
                    target="_blank"
                    style={{ flex: 1, textAlign: "center", background: "var(--bg-2)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 6, padding: "7px 0", fontSize: 12, textDecoration: "none" }}
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => remove(p)}
                    style={{ background: "none", border: "1px solid #e0c3c3", color: "#c0392b", borderRadius: 6, padding: "0 12px", fontSize: 12, cursor: "pointer" }}
                  >
                    删
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "1px solid var(--line-strong)",
              background: "var(--surface)", color: page === 1 ? "var(--ink-faint)" : "var(--ink)",
              cursor: page === 1 ? "default" : "pointer",
            }}
          >
            ‹ 上一页
          </button>
          {pageList(page, totalPages).map((n, i) =>
            n === "..." ? (
              <span key={`e${i}`} style={{ padding: "6px 2px", color: "var(--ink-faint)" }}>…</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  padding: "6px 11px", borderRadius: 6, border: "1px solid var(--line-strong)",
                  background: page === n ? "var(--gold)" : "var(--surface)",
                  color: page === n ? "#fff" : "var(--ink)",
                  cursor: "pointer", fontWeight: 600,
                }}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "1px solid var(--line-strong)",
              background: "var(--surface)", color: page === totalPages ? "var(--ink-faint)" : "var(--ink)",
              cursor: page === totalPages ? "default" : "pointer",
            }}
          >
            下一页 ›
          </button>
          <span style={{ padding: "6px 8px", fontSize: 12, color: "var(--ink-soft)" }}>共 {totalPages} 页</span>
        </div>
      )}

      {/* ===== 批量操作栏 ===== */}
      {selected.size > 0 && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 24,
            zIndex: 60,
            background: "var(--ink)",
            color: "#fff",
            borderRadius: 14,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,.35)",
            maxWidth: "94vw",
          }}
        >
          <b style={{ fontSize: 13 }}>已选 {selected.size} 个</b>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                batch("update", { series: e.target.value });
                e.target.value = "";
              }
            }}
            disabled={batchBusy}
            style={{ border: "1px solid rgba(255,255,255,.4)", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "var(--ink)", color: "#fff" }}
          >
            <option value="">批量改系列…</option>
            {seriesOptions.map((s) => (
              <option key={s} value={s}>{seriesLabel(s)}</option>
            ))}
          </select>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                batch("update", { shape: e.target.value });
                e.target.value = "";
              }
            }}
            disabled={batchBusy}
            style={{ border: "1px solid rgba(255,255,255,.4)", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "var(--ink)", color: "#fff" }}
          >
            <option value="">批量改长短…</option>
            {["短", "中", "长"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                batch("update", { region: e.target.value === "none" ? "" : e.target.value });
                e.target.value = "";
              }
            }}
            disabled={batchBusy}
            style={{ border: "1px solid rgba(255,255,255,.4)", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "var(--ink)", color: "#fff" }}
          >
            <option value="">批量改分区…</option>
            <option value="apac">亚太</option>
            <option value="eu-na">欧美</option>
            <option value="ru-me">俄中东</option>
            <option value="none">未分区</option>
          </select>
          <button
            onClick={() => batch("update", { status: "published" })}
            disabled={batchBusy}
            style={{ background: "rgba(46,125,50,.9)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
          >
            批量上架
          </button>
          <button
            onClick={() => batch("update", { status: "archived" })}
            disabled={batchBusy}
            style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
          >
            批量下架
          </button>
          <button
            onClick={() => batch("delete")}
            disabled={batchBusy}
            style={{ background: "#c0392b", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}
          >
            批量删除
          </button>
          <button
            onClick={() => setSelected(new Set())}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.7)", fontSize: 13, cursor: "pointer" }}
          >
            取消选择
          </button>
        </div>
      )}
    </div>
  );
}
