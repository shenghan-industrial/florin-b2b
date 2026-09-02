// 公开线索提交：询盘/拿样/视频选品/目录/订阅 → 存 KV + 邮件通知
import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/leads-db";
import { leadEmailText, sendEmail } from "@/lib/email";
import type { LeadType } from "@/lib/types";

export const runtime = "edge";

const VALID_TYPES: LeadType[] = ["inquiry", "sample", "live-selection", "catalog", "newsletter"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = VALID_TYPES.includes(body.type) ? body.type : "inquiry";
    const email = String(body.email || "").trim();
    const name = String(body.name || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const company = String(body.company || "").trim();

    // 校验：订阅/目录只要邮箱；其他类型需 公司+WhatsApp+邮箱
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }
    if (type !== "newsletter" && type !== "catalog") {
      if (!company || !whatsapp) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
      }
    }

    const lead = await addLead({
      type,
      name: name || email.split("@")[0],
      email,
      whatsapp,
      company,
      country: String(body.country || ""),
      quantity: String(body.quantity || ""),
      message: String(body.message || ""),
      product: body.product ? String(body.product) : undefined,
      categories: Array.isArray(body.categories) ? body.categories.map(String) : undefined,
    });

    // 邮件通知不阻塞响应
    void (async () => {
      const { subject, text } = leadEmailText(lead);
      await sendEmail(subject, text);
    })();

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
