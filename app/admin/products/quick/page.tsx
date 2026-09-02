"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function QuickAddPage() {
  const router = useRouter();
  const [lines, setLines] = useState("");
  const [category, setCategory] = useState("lashes");
  const [series, setSeries] = useState("Natural Daily Lashes");
  const [price, setPrice] = useState("1.00");
  const [moq, setMoq] = useState("10");
  const [unit, setUnit] = useState("pair");
  const [sample, setSample] = useState(true);
  const [oem, setOem] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const r = await fetch("/api/admin/products/quick/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines, category, series, price: Number(price), moq: Number(moq), unit, sample, oem }),
    });
    const j = await r.json();
    setMsg(r.ok ? `✅ 成功创建 ${j.created} 个产品` : `❌ ${j.error || "失败"}`);
    setBusy(false);
    if (r.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, maxWidth: 720 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>快速批量新增</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>
        每行一个产品，格式：<b>中文名称，简要描述</b>。英文名自动生成，SKU 自动编号（FL-XXX-001）。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 0 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
          品类
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="lashes">假睫毛</option>
            <option value="nails">穿戴甲</option>
            <option value="contacts">美瞳</option>
            <option value="accessories">配件</option>
          </select>
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
          系列
          <input style={inputStyle} value={series} onChange={(e) => setSeries(e.target.value)} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
          价格 USD
          <input style={inputStyle} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
          起订量
          <input style={inputStyle} type="number" value={moq} onChange={(e) => setMoq(e.target.value)} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
          单位
          <select style={inputStyle} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="pair">pair 对</option>
            <option value="set">set 套</option>
            <option value="pc">pc 片</option>
            <option value="box">box 盒</option>
          </select>
        </label>
        <div style={{ display: "flex", gap: 16, alignItems: "center", paddingTop: 18 }}>
          <label style={{ fontSize: 13 }}><input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} /> 支持拿样</label>
          <label style={{ fontSize: 13 }}><input type="checkbox" checked={oem} onChange={(e) => setOem(e.target.checked)} /> 支持贴牌</label>
        </div>
      </div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
        产品清单（每行一个）
        <textarea
          style={{ ...inputStyle, minHeight: 220, fontFamily: "inherit" }}
          value={lines}
          onChange={(e) => setLines(e.target.value)}
          placeholder={"自然日常3D假睫毛，轻盈柔软，日常佩戴舒适\n猫眼魅力假睫毛，眼尾拉长，气场款\n水钻奢华穿戴甲，宴会级手工水钻"}
        />
      </label>
      {msg && <p style={{ fontSize: 13, color: msg.startsWith("✅") ? "#2e7d32" : "#c0392b", margin: 0 }}>{msg}</p>}
      <button className="btn btn--gold" type="submit" disabled={busy} style={{ justifySelf: "start", minWidth: 180, justifyContent: "center" }}>
        {busy ? "创建中…" : "批量创建"}
      </button>
    </form>
  );
}
