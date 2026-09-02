// Resend 邮件（纯 fetch 直调，Edge 兼容，参考 Shenghan 模式）
const API = "https://api.resend.com/emails";
const FROM = "Florin Wholesale <noreply@shenghanindustrial.com>";

export async function sendEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) {
    console.warn("[email] RESEND_API_KEY/NOTIFY_EMAIL 未配置，跳过发送");
    return false;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ from: FROM, to: [to], subject, text }),
      });
      if (r.ok) {
        console.log(`[email] 发送成功 → ${to} | ${subject}`);
        return true;
      }
      console.warn(`[email] attempt ${attempt + 1}: ${r.status}`);
    } catch (e) {
      console.warn(`[email] attempt ${attempt + 1} failed:`, e);
    }
  }
  return false;
}

// 线索邮件正文
export function leadEmailText(lead: {
  type: string;
  name?: string;
  company?: string;
  whatsapp?: string;
  email?: string;
  country?: string;
  quantity?: string;
  message?: string;
  product?: string;
}): { subject: string; text: string } {
  const typeLabel: Record<string, string> = {
    inquiry: "Business Inquiry 商务询盘",
    sample: "Sample Request 样品申请",
    "live-selection": "1V1 Live Selection 视频选品预约",
    catalog: "Catalog Download 目录下载",
    newsletter: "Newsletter Subscribe 订阅",
  };
  const lines = [
    `[${typeLabel[lead.type] || lead.type}]`,
    `公司: ${lead.company || "-"}`,
    `联系人: ${lead.name || "-"}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `邮箱: ${lead.email || "-"}`,
    `国家: ${lead.country || "-"}`,
    `数量: ${lead.quantity || "-"}`,
    `产品: ${lead.product || "-"}`,
    `留言: ${lead.message || "-"}`,
  ];
  return { subject: `[Florin] ${typeLabel[lead.type] || lead.type}`, text: lines.join("\n") };
}
