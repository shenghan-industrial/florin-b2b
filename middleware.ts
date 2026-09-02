// Edge 认证守卫（参考 Shenghan：手写 Web Crypto HMAC-SHA256 验签，零依赖）
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";
const JWT_SECRET = process.env.JWT_SECRET || "florin-b2b-jwt-9f3c7e1a5b8d2c4e6f0a3b5d7c9e1f3a";

const PUBLIC = ["/admin-login", "/api/admin/auth"];
const PUBLIC_READ = ["/api/admin/products", "/api/admin/categories", "/api/admin/blog"];

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const b64 = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verifyJwt(token: string): Promise<{ username: string; role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(s),
      new TextEncoder().encode(`${h}.${p}`)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { username: String(payload.username || ""), role: String(payload.role || "EDITOR") };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const payload = token ? await verifyJwt(token) : null;
  const isGet = req.method === "GET";
  const isPublicRead = isGet && PUBLIC_READ.some((p) => pathname.startsWith(p));

  if (!payload) {
    // 公开读接口（products/categories/blog 的 GET）无需登录
    if (isPublicRead) return NextResponse.next();
    // 无有效身份：API 返回 401 JSON，页面跳登录
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/admin-login", req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  // 注入身份头供路由层 RBAC 使用
  const res = NextResponse.next();
  res.headers.set("x-admin-username", payload.username);
  res.headers.set("x-admin-role", payload.role);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
