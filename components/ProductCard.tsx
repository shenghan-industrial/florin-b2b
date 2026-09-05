"use client";

import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import { useLang } from "@/lib/LanguageContext";
import { pickLang } from "@/lib/localize";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  const { t } = useT();
  const lang = useLang();
  const img = p.image;
  const name = pickLang(p.name, lang);
  const cat = pickLang(p.catLabel, lang);
  const unitLabel = lang === "zh" ? { pair: "对", set: "套", pc: "片", box: "盒" }[p.unit] || p.unit : p.unit;

  const tags: React.ReactNode[] = [];
  if (p.clearance) tags.push(<span key="sale" className="tag tag--sale">{t("card.sale")}</span>);
  tags.push(<span key="moq" className="tag tag--moq">{t("card.moq")}: {p.moq}</span>);
  if (p.sample) tags.push(<span key="sample" className="tag tag--sample">{t("card.sample")}</span>);
  if (p.oem) tags.push(<span key="oem" className="tag tag--oem">{t("card.oem")}</span>);
  if (p.newArrival) tags.push(<span key="new" className="tag tag--new">{t("card.new")}</span>);
  if (p.bestSeller) tags.push(<span key="best" className="tag tag--new">{t("card.best")}</span>);

  return (
    <article
      className="product-card"
      data-category={p.category}
      data-moq={p.moq}
      data-shape={p.shape}
      data-oem={p.oem ? 1 : 0}
      data-sample={p.sample ? 1 : 0}
    >
      <div className="product-card__media">
        {/* 手机端 4 列下 CTA 按钮隐藏，图片与名称均作入口，保证整卡可点 */}
        <Link href={`/product/${p.slug}/`} aria-label={name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ph-img" src={img} alt={p.alt || name} loading="lazy" />
        </Link>
      </div>
      <div className="product-card__body">
        {/* 标签移出图片：移动端平铺在信息区顶部，桌面端（≥768px）由 CSS 浮回图片左上角 */}
        <div className="product-card__tags">{tags}</div>
        <div className="product-card__cat">{cat}</div>
        <Link href={`/product/${p.slug}/`} className="product-card__name">{name}</Link>
        <div className="product-card__price">
          {p.price > 0 ? (
            p.clearance ? (
              <>
                <span className="price-old">
                  {lang === "zh" ? "原价" : "Regular price"} ${(Math.ceil(p.price * 1.25 * 20) / 20).toFixed(2)}
                </span>
                <span className="price-now">
                  {lang === "zh" ? "特价" : "Sale price"} {lang === "zh" ? "起" : "From"} ${p.price.toFixed(2)} / {unitLabel}
                </span>
              </>
            ) : (
              <span className="price-now">
                {lang === "zh" ? "起" : "From"} ${p.price.toFixed(2)} / {unitLabel}
              </span>
            )
          ) : (
            <span className="price-now">{lang === "zh" ? "价格面议" : "Price on inquiry"}</span>
          )}
        </div>
        <div className="product-card__foot">
          <Link className="btn btn--gold" href={`/product/${p.slug}/`}>{t("card.viewDetails")}</Link>
        </div>
      </div>
    </article>
  );
}
