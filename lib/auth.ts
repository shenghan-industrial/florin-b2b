// 认证与权限（参考 Shenghan 模式，Edge 兼容）
import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

export const COOKIE_NAME = "admin_token";
export const JWT_SECRET = process.env.JWT_SECRET || "florin-b2b-jwt-9f3c7e1a5b8d2c4e6f0a3b5d7c9e1f3a";

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export interface TokenPayload {
  username: string;
  role: Role;
  exp?: number;
}

// SHA-256 密码哈希（Web Crypto，Edge 可用）
export async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 默认管理员：env 配置，开发环境兜底 admin/admin123
export function getAdminConfig(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const cfg = getAdminConfig();
  if (username !== cfg.username) return false;
  // 优先 SHA-256 比对（支持 ADMIN_PASSWORD_HASH），否则明文比对
  if (process.env.ADMIN_PASSWORD_HASH) {
    const h = await hashPassword(password);
    return h === process.env.ADMIN_PASSWORD_HASH;
  }
  return password === cfg.password;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return { username: String(payload.username || ""), role: (payload.role as Role) || "EDITOR" };
  } catch {
    return null;
  }
}

// 从 middleware 注入的请求头读取身份
export function getRoleFromRequest(request: NextRequest): Role {
  const r = request.headers.get("x-admin-role");
  return r === "ADMIN" || r === "SUPER_ADMIN" ? (r as Role) : "EDITOR";
}

const PERMISSIONS: Record<string, Role[]> = {
  "product:create": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "product:edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "product:delete": ["SUPER_ADMIN", "ADMIN"],
  "blog:manage": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "category:manage": ["SUPER_ADMIN", "ADMIN"],
  "site:edit": ["SUPER_ADMIN", "ADMIN"],
  "inquiry:view": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "inquiry:manage": ["SUPER_ADMIN", "ADMIN"],
};

export function requirePermission(request: NextRequest, permission: keyof typeof PERMISSIONS): void {
  const role = getRoleFromRequest(request);
  const allowed = PERMISSIONS[permission] || [];
  if (!allowed.includes(role)) {
    throw new Error(`FORBIDDEN: ${permission}`);
  }
}
