// 线索列表（后台看板）
import { NextRequest, NextResponse } from "next/server";
import { getAllLeads } from "@/lib/leads-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "inquiry:view");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const leads = await getAllLeads();
  return NextResponse.json({ leads });
}
