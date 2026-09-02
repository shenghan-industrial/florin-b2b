// 登录态检查（admin 壳挂载时调用）
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ authed: false }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ authed: false }, { status: 401 });
  return NextResponse.json({ authed: true, user: { username: payload.username, role: payload.role } });
}
