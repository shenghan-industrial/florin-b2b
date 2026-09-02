"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "产品" },
  { href: "/admin/products/new", label: "新增产品" },
  { href: "/admin/products/quick", label: "快速批量" },
  { href: "/admin/products/import", label: "CSV 导入" },
  { href: "/admin/blog", label: "博客" },
  { href: "/admin/inquiries", label: "线索" },
  { href: "/admin/site", label: "站点内容" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("/api/admin/check/")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        setAuthed(true);
        setUsername(j.user?.username || "");
      })
      .catch(() => {
        router.replace("/admin-login");
      });
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.replace("/admin-login");
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--ink-soft)" }}>
        正在验证登录状态…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
      <header
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 24,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link href="/admin" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 15, textDecoration: "none", letterSpacing: 1 }}>
          FLORIN 后台
        </Link>
        <nav style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 13,
                textDecoration: "none",
                color: pathname === n.href ? "var(--ink)" : "rgba(255,255,255,.85)",
                background: pathname === n.href ? "var(--gold)" : "transparent",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{username}</span>
        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,.35)",
            color: "#fff",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          退出
        </button>
      </header>
      <main style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>{children}</main>
    </div>
  );
}
