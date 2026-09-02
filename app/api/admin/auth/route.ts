// 后台登录：POST {username, password} → 验证 → JWT → Set-Cookie
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, signToken, verifyAdmin } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "");
    const password = String(body.password || "");
    if (!username || !password) {
      return NextResponse.json({ error: "请输入账号和密码" }, { status: 400 });
    }
    if (!(await verifyAdmin(username, password))) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }
    const token = await signToken({ username, role: "SUPER_ADMIN" });
    const res = NextResponse.json({ ok: true });
    // Edge 兼容：用原生 Set-Cookie 头
    res.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`
    );
    return res;
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }
}
