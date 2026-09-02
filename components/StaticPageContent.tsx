"use client";

import Link from "next/link";
import { useT, useLang } from "@/lib/LanguageContext";
import type { StaticPageDef } from "@/data/pages";
import LeadForm from "./LeadForm";

// 政策页 / 营销页 / 表单页通用渲染（catch-all 路由使用）
export default function StaticPageContent({ def }: { def: StaticPageDef }) {
  const { t } = useT();
  const lang = useLang();
  const h1 = t(`page.${def.slug}.h1`);
  const eyebrow = t(`page.${def.slug}.eyebrow`);
  const lead = t(`page.${def.slug}.lead`);
  const sections = def.body[lang] || def.body.en;

  const formNote =
    def.formType === "sample"
      ? lang === "zh"
        ? "样品费与运费由买家承担；批量订单达成后部分抵扣。"
        : "Sample fees & freight apply; partially deductible from bulk orders."
      : def.formType === "live-selection"
      ? lang === "zh"
        ? "我们会在 1 个工作日内通过 WhatsApp 确认您的视频时间。"
        : "We confirm your video appointment by WhatsApp within 1 business day."
      : lang === "zh"
      ? "我们会在 1 个工作日内回复。"
      : "We reply within 1 business day.";

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        {def.type === "utility" ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>{h1}</h1>
            <p className="muted" style={{ margin: "14px 0 28px", fontSize: 16 }}>{lead}</p>
            <Link className="btn btn--gold" href="/">{lang === "zh" ? "返回首页" : "Back to Home"}</Link>
          </div>
        ) : (
          <>
            <div className="eyebrow">{eyebrow}</div>
            <h1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>{h1}</h1>
            <p className="muted" style={{ margin: "14px 0 28px", fontSize: 16 }}>{lead}</p>

            {def.type === "form" && def.formType ? (
              <LeadForm type={def.formType} note={formNote} singleEmail={def.formType === "catalog"} />
            ) : null}

            {sections.map((s, i) => (
              <div key={i} style={{ marginTop: 28 }}>
                <h2 className="h-sub">{s.h2}</h2>
                {s.ps.map((p, j) => (
                  <p key={j} className="muted" style={{ lineHeight: 1.7, margin: "10px 0" }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
