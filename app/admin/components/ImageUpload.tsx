"use client";

import { useRef, useState } from "react";

// 图片上传：拖拽/点击 → POST /api/admin/upload → 回传 URL
export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/admin/upload/", { method: "POST", body: form });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "上传失败");
        return;
      }
      onChange(j.original || j.url);
    } catch {
      setError("网络错误");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        style={{
          width: 160,
          height: 160,
          border: "2px dashed var(--line-strong)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: "var(--bg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {busy ? (
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>上传中…</span>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="预览" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                opacity: 0,
                transition: ".2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0")}
            >
              点击更换
            </span>
          </>
        ) : (
          <span style={{ fontSize: 13, color: "var(--ink-faint)", textAlign: "center", padding: 12 }}>
            点击或拖拽图片上传
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          style={{ marginTop: 6, fontSize: 12, color: "#c0392b", background: "none", border: "none", cursor: "pointer" }}
        >
          移除图片
        </button>
      )}
      {error && <p style={{ color: "#c0392b", fontSize: 12, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}
