"use client";

import { useRef, useState } from "react";

interface ApplyData {
  name?: string;
  nameZh?: string;
  description?: string;
  descriptionZh?: string;
  features?: string[];
}

// AI 文案助手：浮动聊天面板，支持拖图识别 → 生成双语文案 → 一键应用到表单
export default function AIAssistant({
  category,
  series,
  onApply,
}: {
  category?: string;
  series?: string;
  onApply?: (data: ApplyData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [applyData, setApplyData] = useState<ApplyData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const context = [category, series].filter(Boolean).join(" · ");

  async function send(text: string, imgB64?: string, imgType?: string) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
          imageBase64: imgB64,
          imageType: imgType,
          context,
        }),
      });
      const j = await r.json();
      const reply = j.reply || "（无回复）";
      setMessages((m) => [...m, { role: "user", content: imgB64 ? "[图片] " + text : text }, { role: "assistant", content: reply }]);
      // 解析 ```json {name,nameZh,description,descriptionZh,features[]}
      const m = reply.match(/```json\s*([\s\S]*?)```/);
      if (m) {
        try {
          setApplyData(JSON.parse(m[1]));
        } catch {
          setApplyData(null);
        }
      } else {
        setApplyData(null);
      }
    } catch {
      setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "（AI 服务不可用）" }]);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(f: File) {
    const b64 = await new Promise<string>((resolve, reject) => {
      const rd = new FileReader();
      rd.onload = () => resolve(String(rd.result).split(",")[1] || "");
      rd.onerror = reject;
      rd.readAsDataURL(f);
    });
    setImageBase64(b64);
    setImageType(f.type);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 80,
          background: "var(--gold)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "14px 20px",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "var(--shadow)",
        }}
      >
        ✨ AI 文案助手
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 84,
            width: 420,
            height: 580,
            maxHeight: "80vh",
            zIndex: 81,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "var(--ink)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>AI 文案助手 {context && <span style={{ color: "var(--gold)", fontSize: 12 }}>· {context}</span>}</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--ink-soft)", textAlign: "center", marginTop: 40 }}>
                描述产品（或拖入产品图片），AI 生成中英双语文案。
                <br />
                说"应用到产品"后可直接填入表单。
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.role === "user" ? "var(--gold)" : "var(--bg-2)",
                  color: m.role === "user" ? "#fff" : "var(--ink)",
                  padding: "10px 13px",
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
            {applyData && (
              <button
                type="button"
                onClick={() => onApply?.(applyData)}
                style={{
                  alignSelf: "center",
                  background: "var(--ink)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 应用到产品
              </button>
            )}
          </div>
          <div style={{ padding: 10, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="上传产品图片"
              style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8, padding: "0 12px", cursor: "pointer", fontSize: 16 }}
            >
              {imageBase64 ? "🖼️✓" : "🖼️"}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !busy && input.trim()) {
                  const txt = input.trim();
                  setInput("");
                  send(txt, imageBase64 || undefined, imageType || undefined);
                  setImageBase64(null);
                  setImageType(null);
                }
              }}
              placeholder="例如：猫眼款式，浓密卷翘，适合日常佩戴…"
              style={{ flex: 1, border: "1px solid var(--line-strong)", borderRadius: 8, padding: "9px 12px", fontSize: 13 }}
            />
            <button
              type="button"
              disabled={busy || !input.trim()}
              onClick={() => {
                send(input.trim(), imageBase64 || undefined, imageType || undefined);
                setInput("");
                setImageBase64(null);
                setImageType(null);
              }}
              style={{ background: "var(--gold)", color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", cursor: "pointer", fontWeight: 600 }}
            >
              {busy ? "…" : "发送"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
