"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, RegionId } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import AIAssistant from "./AIAssistant";

const CATS = [
  { id: "lashes", label: "假睫毛 False Lashes" },
  { id: "nails", label: "穿戴甲 Press-On Nails" },
  { id: "contacts", label: "美瞳 Colored Contacts" },
  { id: "accessories", label: "配件 Accessories" },
];
const UNITS = [
  { id: "pair", label: "pair 对" },
  { id: "set", label: "set 套" },
  { id: "pc", label: "pc 片" },
  { id: "box", label: "box 盒" },
];
const REGIONS = [
  { id: "", label: "未分区 Unassigned" },
  { id: "apac", label: "亚太 Asia-Pacific" },
  { id: "eu-na", label: "欧美 Europe & Americas" },
  { id: "ru-me", label: "俄中东 Russia & Middle East" },
];

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

export default function ProductForm({ product, isNew }: { product?: Product; isNew?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    nameEn: product?.name?.en || "",
    nameZh: product?.name?.zh || "",
    category: product?.category || "lashes",
    series: product?.series || "",
    price: product ? String(product.price) : "1.00",
    moq: product ? String(product.moq) : "10",
    unit: product?.unit || "pair",
    sample: product ? product.sample : true,
    oem: product ? product.oem : true,
    newArrival: product ? product.newArrival : false,
    bestSeller: product ? product.bestSeller : false,
    clearance: product ? product.clearance : false,
    custom: product ? product.custom : true,
    shape: product?.shape || "—",
    region: product?.region || "",
    image: product?.image || "",
    status: product?.status || "published",
    descEn: product?.description?.en || "",
    descZh: product?.description?.zh || "",
    featuresEn: product?.features?.en.join("\n") || "",
    featuresZh: product?.features?.zh.join("\n") || "",
  });

  const set = (k: keyof typeof f) => (v: unknown) => setF((prev) => ({ ...prev, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.nameZh.trim() && !f.nameEn.trim()) {
      setError("请至少填写一个名称（中文或英文）");
      return;
    }
    setBusy(true);
    setError("");
    const payload = {
      name: { en: f.nameEn.trim(), zh: f.nameZh.trim() },
      category: f.category,
      series: f.series.trim(),
      price: Number(f.price),
      moq: Number(f.moq),
      unit: f.unit,
      sample: f.sample,
      oem: f.oem,
      newArrival: f.newArrival,
      bestSeller: f.bestSeller,
      clearance: f.clearance,
      custom: f.custom,
      shape: f.shape.trim() || "—",
      region: f.region as RegionId,
      image: f.image,
      status: f.status,
      description: { en: f.descEn.trim(), zh: f.descZh.trim() },
      features: {
        en: f.featuresEn.split("\n").map((s) => s.trim()).filter(Boolean),
        zh: f.featuresZh.split("\n").map((s) => s.trim()).filter(Boolean),
      },
    };
    try {
      const r = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${product!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "保存失败");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setBusy(false);
    }
  }

  const chk = (k: keyof typeof f, label: string) => (
    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
      <input type="checkbox" checked={!!f[k]} onChange={(e) => set(k)(e.target.checked)} />
      {label}
    </label>
  );

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, maxWidth: 860 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>{isNew ? "新增产品" : `编辑产品：${product?.id || ""}`}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
        <label style={labelStyle}>
          中文名称 *
          <input style={inputStyle} value={f.nameZh} onChange={(e) => set("nameZh")(e.target.value)} placeholder="自然日常3D假睫毛" />
        </label>
        <label style={labelStyle}>
          英文名称
          <input style={inputStyle} value={f.nameEn} onChange={(e) => set("nameEn")(e.target.value)} placeholder="Natural Daily 3D Lashes" />
        </label>
        <label style={labelStyle}>
          品类
          <select style={inputStyle} value={f.category} onChange={(e) => set("category")(e.target.value)}>
            {CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          系列（如 Natural Daily Lashes / 自然日常系列）
          <input style={inputStyle} value={f.series} onChange={(e) => set("series")(e.target.value)} />
        </label>
        <label style={labelStyle}>
          批发价 USD
          <input style={inputStyle} type="number" step="0.01" min="0" value={f.price} onChange={(e) => set("price")(e.target.value)} />
        </label>
        <label style={labelStyle}>
          起订量 MOQ
          <input style={inputStyle} type="number" min="1" value={f.moq} onChange={(e) => set("moq")(e.target.value)} />
        </label>
        <label style={labelStyle}>
          单位
          <select style={inputStyle} value={f.unit} onChange={(e) => set("unit")(e.target.value)}>
            {UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          形状 / 款式（无则填 —）
          <input style={inputStyle} value={f.shape} onChange={(e) => set("shape")(e.target.value)} />
        </label>
        <label style={labelStyle}>
          状态
          <select style={inputStyle} value={f.status} onChange={(e) => set("status")(e.target.value)}>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="archived">已归档</option>
          </select>
        </label>
        <label style={labelStyle}>
          畅销分区
          <select style={inputStyle} value={f.region} onChange={(e) => set("region")(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {chk("sample", "支持拿样")}
        {chk("oem", "支持贴牌 OEM")}
        {chk("newArrival", "新品")}
        {chk("bestSeller", "热销")}
        {chk("clearance", "清仓特价")}
        {chk("custom", "可定制")}
      </div>

      <div>
        <span style={{ ...labelStyle, marginBottom: 6 }}>产品图片</span>
        <ImageUpload value={f.image} onChange={(url) => set("image")(url)} />
      </div>

      <label style={labelStyle}>
        英文描述
        <textarea style={{ ...inputStyle, minHeight: 70, fontFamily: "inherit" }} value={f.descEn} onChange={(e) => set("descEn")(e.target.value)} />
      </label>
      <label style={labelStyle}>
        中文描述
        <textarea style={{ ...inputStyle, minHeight: 70, fontFamily: "inherit" }} value={f.descZh} onChange={(e) => set("descZh")(e.target.value)} />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
        <label style={labelStyle}>
          英文卖点（每行一条）
          <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: "inherit" }} value={f.featuresEn} onChange={(e) => set("featuresEn")(e.target.value)} />
        </label>
        <label style={labelStyle}>
          中文卖点（每行一条）
          <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: "inherit" }} value={f.featuresZh} onChange={(e) => set("featuresZh")(e.target.value)} />
        </label>
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn--gold" type="submit" disabled={busy} style={{ minWidth: 160, justifyContent: "center" }}>
          {busy ? "保存中…" : "保存产品"}
        </button>
        <button className="btn btn--line" type="button" onClick={() => router.push("/admin")}>取消</button>
      </div>

      <AIAssistant
        category={CATS.find((c) => c.id === f.category)?.label}
        series={f.series}
        onApply={(d) => {
          setF((prev) => ({
            ...prev,
            nameEn: d.name || prev.nameEn,
            nameZh: d.nameZh || d.name || prev.nameZh,
            descEn: d.description || prev.descEn,
            descZh: d.descriptionZh || d.description || prev.descZh,
            featuresEn: (d.features || []).join("\n") || prev.featuresEn,
            featuresZh: prev.featuresZh,
          }));
        }}
      />
    </form>
  );
}
