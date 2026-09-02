"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const r = await fetch("/api/admin/products/import/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    const j = await r.json();
    setMsg(r.ok ? `✅ 成功导入 ${j.created} 个产品` : `❌ ${j.error || "失败"}`);
    setBusy(false);
    if (r.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, maxWidth: 720 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>CSV 批量导入</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>
        表头：<code>name,nameZh,category,series,price,moq,unit,sample,oem,shape,image</code>
        <br />
        category 取值：lashes / nails / contacts / accessories；sample/oem 填 yes 或 no
      </p>
      <textarea
        style={{
          border: "1px solid var(--line-strong)",
          borderRadius: 8,
          padding: 12,
          fontSize: 13,
          fontFamily: "monospace",
          minHeight: 220,
          background: "var(--bg)",
          color: "var(--ink)",
        }}
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder={"name,nameZh,category,series,price,moq,unit,sample,oem\nNatural Daily 3D Lashes,自然日常3D假睫毛,lashes,Natural Daily Lashes,1.20,10,pair,yes,yes"}
      />
      {msg && <p style={{ fontSize: 13, color: msg.startsWith("✅") ? "#2e7d32" : "#c0392b", margin: 0 }}>{msg}</p>}
      <button className="btn btn--gold" type="submit" disabled={busy} style={{ justifySelf: "start", minWidth: 180, justifyContent: "center" }}>
        {busy ? "导入中…" : "开始导入"}
      </button>
    </form>
  );
}
