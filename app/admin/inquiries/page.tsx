"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/types";

const STATUSES = ["new", "contacted", "quoted", "won", "closed"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "新线索",
  contacted: "已联系",
  quoted: "已报价",
  won: "成交",
  closed: "关闭",
};
const TYPE_LABEL: Record<string, string> = {
  inquiry: "商务询盘",
  sample: "样品申请",
  "live-selection": "视频选品",
  catalog: "目录下载",
  newsletter: "订阅",
};

export default function InquiriesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    const r = await fetch("/api/admin/leads/");
    if (r.ok) {
      const j = await r.json();
      setLeads(j.leads);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(lead: Lead, status: string) {
    await fetch(`/api/admin/leads/${lead.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const shown = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--line)", fontSize: 12, color: "var(--ink-soft)", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid var(--line)", fontSize: 13, verticalAlign: "top" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>线索看板</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--line-strong)",
                background: filter === s ? "var(--gold)" : "var(--surface)",
                color: filter === s ? "#fff" : "var(--ink)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {s === "all" ? "全部" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>加载中…</p>
      ) : shown.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>暂无线索</p>
      ) : (
        <div style={{ overflowX: "auto", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={th}>时间</th>
                <th style={th}>类型</th>
                <th style={th}>公司 / 联系人</th>
                <th style={th}>联系方式</th>
                <th style={th}>需求</th>
                <th style={th}>状态</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((l) => (
                <tr key={l.id}>
                  <td style={td}>{new Date(l.createdAt).toLocaleString("zh-CN", { hour12: false })}</td>
                  <td style={td}>{TYPE_LABEL[l.type] || l.type}</td>
                  <td style={td}>
                    <b>{l.company || "-"}</b>
                    <br />
                    {l.name} {l.country ? `· ${l.country}` : ""}
                  </td>
                  <td style={td}>
                    {l.email}
                    {l.whatsapp && <><br />WA: {l.whatsapp}</>}
                  </td>
                  <td style={td} >
                    {l.product && <b>{l.product}</b>}
                    {l.product && <br />}
                    {l.quantity || ""}
                    {l.message && <><br /><span style={{ color: "var(--ink-soft)" }}>{l.message.slice(0, 120)}</span></>}
                  </td>
                  <td style={td}>
                    <select
                      value={l.status}
                      onChange={(e) => setStatus(l, e.target.value)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--line-strong)",
                        fontSize: 12,
                        background: "var(--bg)",
                        color: "var(--ink)",
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
