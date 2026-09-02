"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "登录失败");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          padding: 40,
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/assets/images/logo.svg" alt="Florin" style={{ height: 40, marginBottom: 14 }} />
          <h1 style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Jost',sans-serif" }}>
            Florin B2B 后台管理
          </h1>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
            账号
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-sm)",
                padding: "11px 13px",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--ink)",
              }}
              autoComplete="username"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
            密码
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-sm)",
                padding: "11px 13px",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--ink)",
              }}
              autoComplete="current-password"
            />
          </label>
          {error && <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn btn--gold"
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          >
            {busy ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
