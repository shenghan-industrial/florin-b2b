// AI 文案助手（DashScope qwen-vl-max，支持图片识别 → 中英双语文案）
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

const API = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL = "qwen-vl-max";

const SYSTEM_PROMPT = `你是 FLORIN（允禾）美妆批发独立站的 B2B 产品文案专员。
FLORIN 主营：假睫毛、穿戴甲、美瞳、配件，面向马来西亚、中国、新加坡、泰国、印尼等市场的海外经销商、沙龙与品牌方。

你的任务：根据用户描述（可附产品图片），生成专业的中英双语产品文案。

要求：
1. 名称：中文名 + 英文名，简洁、突出款式特点
2. 描述：中英文各一段，80 字以内，B2B 批发语气（强调起订量、现货、可拿样、可贴牌）
3. 卖点：4 条，每条一句话，中英文各一组
4. 禁止零售话术（如"买它！""限时秒杀"），保持专业批发语气

当用户说"应用到产品"或要求结构化输出时，在回复末尾附上严格 JSON 代码块（不要任何多余文字）：
\`\`\`json
{"name":"英文名","nameZh":"中文名","description":"英文描述","descriptionZh":"中文描述","features":["英文卖点1","英文卖点2","英文卖点3","英文卖点4"]}
\`\`\``;

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "product:create");
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 403 });
  }

  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "未配置 DASHSCOPE_API_KEY" }, { status: 500 });
  }

  let body: { messages?: { role: string; content: string }[]; imageBase64?: string; imageType?: string; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求无效" }, { status: 400 });
  }

  const msgs = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const img = body.imageBase64;
  if (img && img.length > 5_000_000) {
    return NextResponse.json({ error: "图片过大" }, { status: 400 });
  }

  // 最后一条用户消息 + 可选图片 → 多模态内容
  const last = msgs.length ? msgs[msgs.length - 1].content : "";
  const userContent: unknown[] = [];
  if (img && body.imageType) {
    userContent.push({ type: "image_url", image_url: { url: `data:${body.imageType};base64,${img}` } });
  }
  userContent.push({ type: "text", text: last || "请为这款产品生成中英双语文案" });

  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT + (body.context ? `\n当前编辑上下文：${body.context}` : "") },
    ...msgs.slice(0, -1).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: userContent },
  ];

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model: MODEL, messages: chatMessages, temperature: 0.7, max_tokens: 2048 }),
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) {
      console.warn("[ai] dashscope status", r.status);
      return NextResponse.json({ error: `AI 服务错误 ${r.status}` }, { status: 502 });
    }
    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (e) {
    console.warn("[ai] fetch failed", e);
    return NextResponse.json({ error: "AI 服务超时或不可用" }, { status: 502 });
  }
}
