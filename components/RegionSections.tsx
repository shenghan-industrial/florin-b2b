"use client";

import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { pickLang } from "@/lib/localize";
import type { Product, RegionId } from "@/lib/types";

// 三大区域畅销款：三个线框盒子横排（替换原「选择产品类别」区块）
// 每框 = 区域标题 + 小字国家标注 + 3 款产品 + 「查看详情」→ 区域专属页面
const REGIONS: {
  id: Exclude<RegionId, "">;
  title: { en: string; zh: string };
  countries: { en: string; zh: string };
  href: string;
}[] = [
  {
    id: "apac",
    title: { en: "Asia-Pacific Best Sellers", zh: "亚太区畅销款" },
    countries: { en: "Japan · Korea · Southeast Asia", zh: "日本、韩国、东南亚" },
    href: "/apac-best-sellers/",
  },
  {
    id: "eu-na",
    title: { en: "Europe & Americas Best Sellers", zh: "欧美区畅销款" },
    countries: { en: "Europe · North America", zh: "欧洲、北美" },
    href: "/europe-americas-best-sellers/",
  },
  {
    id: "ru-me",
    title: { en: "Russia & Middle East Best Sellers", zh: "俄中东区畅销款" },
    countries: { en: "Russia · Middle East", zh: "俄罗斯、中东" },
    href: "/russia-middle-east-best-sellers/",
  },
];

export default function RegionSections({ products }: { products: Product[] }) {
  const lang = useLang();
  const priceOf = (p: Product) =>
    p.price > 0 ? `$${p.price}` : lang === "zh" ? "价格面议" : "Price on inquiry";

  return (
    <section className="section section--tight">
      <div className="container">
        <div className="region-boxes">
          {REGIONS.map((r) => {
            const items = products.filter((p) => p.region === r.id).slice(0, 3);
            if (items.length === 0) return null; // 该区域无产品时整块隐藏
            return (
              <div key={r.id} className="region-box">
                <div className="region-box__head">
                  <p className="region-box__countries">{pickLang(r.countries, lang)}</p>
                  <h3>{pickLang(r.title, lang)}</h3>
                </div>
                <div className="region-box__items">
                  {items.map((p) => (
                    <Link key={p.id} className="region-mini" href={`/product/${p.slug}/`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.alt || p.name.en} loading="lazy" />
                      <span className="region-mini__meta">
                        <span className="region-mini__name">{pickLang(p.name, lang)}</span>
                        <span className="region-mini__price">{priceOf(p)}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link className="btn btn--line region-box__all" href={r.href}>
                  {lang === "zh" ? "查看详情 →" : "View details →"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
