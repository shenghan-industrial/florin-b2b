// 线索状态流转 / 备注
import { NextRequest, NextResponse } from "next/server";
import { updateLead } from "@/lib/leads-db";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "inquiry:manage");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if (["new", "contacted", "quoted", "won", "closed"].includes(body.status)) patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes;
  const lead = await updateLead(id, patch as never);
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ lead });
}
