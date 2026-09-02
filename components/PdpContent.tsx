"use client";

import Link from "next/link";
import { useT, useLang } from "@/lib/LanguageContext";
import { pickLang, pickLangArr } from "@/lib/localize";
import { categoryOverview } from "@/data/pdp-copy";
import { UNIT_ZH } from "@/data/pdp-copy";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import LeadForm from "./LeadForm";

export default function PdpContent({ p, related }: { p: Product; related: Product[] }) {
  const { t } = useT();
  const lang = useLang();
  const name = pickLang(p.name, lang);
  const cat = pickLang(p.catLabel, lang);
  const unitLabel = lang === "zh" ? UNIT_ZH[p.unit] || p.unit : p.unit;
  const desc = pickLang(p.description, lang);
  const features = pickLangArr(p.features, lang) as string[];
  const specs = pickLangArr(p.specs, lang) as { label: string; value: string }[];
  const lead = pickLang(p.seoDesc || p.description, lang);
  const unitZh = UNIT_ZH[p.unit] || p.unit;

  const tags: React.ReactNode[] = [];
  tags.push(<span key="moq" className="tag tag--moq">MOQ: {p.moq} {p.unit}</span>);
  if (p.sample) tags.push(<span key="s" className="tag tag--sample">{t("card.sample")}</span>);
  if (p.oem) tags.push(<span key="o" className="tag tag--oem">{t("card.oem")}</span>);
  if (p.clearance) tags.push(<span key="c" className="tag tag--clear">Clearance</span>);
  if (p.newArrival) tags.push(<span key="n" className="tag tag--new">{t("card.new")}</span>);
  if (p.bestSeller) tags.push(<span key="b" className="tag tag--new">{t("card.best")}</span>);

  return (
    <div className="pdp">
      <div className="pdp__top">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="pdp__media" role="img" aria-label={p.alt}>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <span style={{ fontSize: 96 }}>👁️</span>
            )}
          </div>
        </div>
        <div>
          <div className="pdp__cat">{cat} · {pickLang(p.seriesLabel, lang)}</div>
          <h1 className="pdp__name">{name}</h1>
          <div className="pdp__tags">{tags}</div>
          <div className="pdp__price">
            {p.price > 0 ? (
              <>${p.price.toFixed(2)} <small>/ {unitLabel}</small></>
            ) : (
              <small>{lang === "zh" ? "价格面议 · 联系客服获取报价" : "Price on inquiry · contact us for a quote"}</small>
            )}
          </div>
          <p className="pdp__desc">{desc}</p>
          <div className="pdp__cta">
            <Link className="btn btn--gold" href="/business-inquiry/">{t("home.biz2btn").includes("Browse") ? "Request Wholesale Quote" : "获取批发报价"}</Link>
            <Link className="btn btn--ghost" href="/sample-request/">{lang === "zh" ? "申请样品" : "Order a Sample"}</Link>
          </div>
          <ul className="pdp__highlights">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="h-sub">{lang === "zh" ? "产品概览" : "Product Overview"}</h2>
        <p>{categoryOverview(p, lang)}</p>
        <p className="muted">
          {lang === "zh"
            ? "对买家而言，实际问题很简单：这款产品能否以同样品质复购？起订量与交期是否清晰？包装能否适配您的品牌？Florin 对以上三点都能给出肯定的答案——您可以在批量下单前先拿样确认。"
            : "For buyers, the practical question is simple: can this item be reordered at the same quality, with clear MOQ and lead-time, and with packaging that fits your brand? Florin answers yes on all three — and you can confirm it with a sample before committing to a bulk order."}
        </p>
      </div>

      <div>
        <h2 className="h-sub">{lang === "zh" ? "产品规格" : "Product Specification"}</h2>
        <table className="spec-table">
          <tbody>
            {specs.map((s, i) => (
              <tr key={i}>
                <th>{s.label}</th>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="h-sub">{lang === "zh" ? "咨询此产品" : "Inquire About This Product"}</h2>
        <LeadForm
          type="inquiry"
          product={name}
          quantity={`${p.moq}+ ${p.unit}`}
          submitLabel={lang === "zh" ? `咨询 ${name} 报价` : "Request Quote for This Item"}
          note={lang === "zh" ? "我们会在 1 个工作日内回复。" : "We reply within 1 business day."}
        />
      </div>

      {related.length > 0 && (
        <div className="related">
          <h2 className="h-sub">{lang === "zh" ? "你可能还喜欢" : "You May Also Like"}</h2>
          <div className="product-grid">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
