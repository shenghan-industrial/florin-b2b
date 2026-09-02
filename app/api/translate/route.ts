// 名称翻译（qwen-turbo）：中↔英 双向，供 ProductForm 的 AI 翻译角标使用
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const API = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export async function POST(req: NextRequest) {
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" }, { status: 500 });

  let text = "";
  try {
    const body = await req.json();
    text = String(body.text || "").trim();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!text) return NextResponse.json({ error: "empty text" }, { status: 400 });

  const isZh = /[一-鿿]/.test(text);
  const prompt = isZh
    ? `把这个中文产品名翻译成英文，只输出译文：${text}`
    : `Translate this English product name into Simplified Chinese, output only the translation: ${text}`;

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 60,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return NextResponse.json({ error: `status ${r.status}` }, { status: 502 });
    const j = await r.json();
    const translated = (j.choices?.[0]?.message?.content || "").trim();
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "timeout" }, { status: 502 });
  }
}
