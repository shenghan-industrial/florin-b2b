"use client";

import Link from "next/link";
import { useState } from "react";
import { useT, useLang } from "@/lib/LanguageContext";
import { pickLang } from "@/lib/localize";
import type { Product, SiteContent, BlogPost } from "@/lib/types";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import EntryPopup from "./EntryPopup";
import NewsletterForm from "./NewsletterForm";
import RegionSections from "./RegionSections";

// 首页 19 区块（完全对照 365nails.com 的结构与文案；产品不显示价格）

// ===== 区块2 · Sourcing facts（4 卡片）=====
const TRUST = [
  { ic: "M4 7h16v12H4z M8 7V5h8v2", t: ["Clear MOQ", "起订量清晰"], p: ["Buying rules stay visible before you commit.", "下单前采购规则一目了然。"] },
  { ic: "M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z M12 15a3 3 0 100-6 3 3 0 000 6z", t: ["Real product checks", "真实产品检验"], p: ["Review styles and quality details before ordering.", "下单前核对款式与质量细节。"] },
  { ic: "M4 9h16v11H4z M9 9V6h6v3", t: ["Custom packaging", "定制包装"], p: ["Connect nails, cards, cases, and branded packaging.", "穿戴甲、卡片、收纳盒与品牌包装一站式。"] },
  { ic: "M3 8l9-5 9 5v8l-9 5-9-5z M3 8l9 5 9-5", t: ["Global fulfillment", "全球履约"], p: ["Choose wholesale shipping or dropshipping support.", "批发直发或一件代发任你选择。"] },
];

// ===== 区块3 · Real sourcing evidence（3 卡片）=====
// 3 张证据卡使用真实 Cloudinary 图片（车间实拍 / 细节核对 / 成品包装），非占位图
const EVIDENCE = [
  { img: "https://res.cloudinary.com/wn0jxugx/image/upload/florin/bybvl32oojea0v1znsuw.png", ey: ["Real workshop video", "真实车间视频"], h: ["Meet the workshop behind the order", "看看订单背后的车间"], p: ["See the working environment where handmade press-on nail styles are prepared and reviewed.", "看看手工穿戴甲款式的生产与检验环境。"], btn: ["Watch the workshop video", "观看车间视频"], href: "/about-our-factory/" },
  { img: "https://res.cloudinary.com/wn0jxugx/image/upload/florin/i5g5kq0j43cv0vg0opjf.png", ey: ["Product detail review", "产品细节核对"], h: ["Inspect styles before committing", "下单前先核对款式"], p: ["Use live video to look closer at nail shape, finish, decoration, and presentation before placing an order.", "通过视频直播细看甲型、工艺、装饰与展示效果。"], btn: ["Review video selection", "视频选品"], href: "/1v1-live-selection/" },
  { img: "https://res.cloudinary.com/wn0jxugx/image/upload/florin/j3zv6iynrlgbnl7sesdi.png", ey: ["Finished packaging example", "成品包装示例"], h: ["Review a real branded packaging result", "看看真实的品牌包装成品"], p: ["See how a nail set, clear case, logo sticker, and outer box can be presented together.", "甲片套装、透明盒、logo 贴纸与外盒的组合展示。"], btn: ["Explore packaging options", "了解包装方案"], href: "/custom-private-label/" },
];

// ===== 区块4 · Proof strip（6 条）=====
const PROOFS = [
  ["Clear MOQ and wholesale pricing", "起订量与批发价清晰"],
  ["Custom packaging available", "支持定制包装"],
  ["Worldwide shipping support", "全球物流支持"],
  ["Quality checks before shipment", "发货前质检"],
  ["Real product videos available", "真实产品视频"],
  ["Factory-direct sourcing", "工厂直供"],
];

// ===== 区块6 · Sell with Florin（4 种合作方式）=====
const SELL = [
  { h: ["Wholesale", "现货批发"], p: ["Ready-stock press-on nails with clear MOQ — buy and resell under your own store.", "现货穿戴甲，起订量清晰——直接批发上架销售。"], btn: ["Shop wholesale", "逛批发"], href: "/press-on-nails-wholesale/" },
  { h: ["Dropshipping", "一件代发"], p: ["Connect your Shopify store, push products in one click, and we pack and ship every order for you — no inventory required.", "对接 Shopify，一键上架，我们代打包发货——零库存。"], btn: ["Start Dropshipping", "开始代发"], href: "/dropshipping-program/" },
  { h: ["AI Studio", "AI 设计工坊"], p: ["Design press-on nails with AI: generate styles, preview them on real hand models, and turn winners into sellable products.", "用 AI 设计款式，真手模特预览，把爆款变成可售产品。"], btn: ["Try AI Studio", "体验 AI 工坊"], href: "/custom-private-label/" },
  { h: ["Custom & Private Label", "贴牌定制"], p: ["Build your own nail brand with custom styles, logo printing, and branded packaging.", "定制款式、logo 印刷与品牌包装，打造你的美甲品牌。"], btn: ["Build your brand", "打造品牌"], href: "/custom-private-label/" },
];

// ===== 区块7 · Find the right product path faster（4 路径）=====
const ROUTES = [
  { tag: ["Low-risk testing", "低风险试单"], moq: "MOQ 1", h: ["Start with best sellers", "从热销款开始"], p: ["Use proven styles to test demand before scaling inventory.", "用验证过的款式测试需求，再放大库存。"], btn: ["Shop best sellers", "逛热销"], href: "/best-sellers/" },
  { tag: ["Margin deals", "利润特价"], moq: "Sale", h: ["Fill bundles with clearance picks", "用清仓款搭配成组"], p: ["Use deal inventory and mystery boxes for margin-focused tests.", "用清仓库存与盲盒做利润导向的试单。"], btn: ["View all deals", "看全部特价"], href: "/flash-deals-clearance/" },
  { tag: ["Channel ready", "渠道就绪"], moq: "Wholesale", h: ["Stock your sales channels", "为你的销售渠道备货"], p: ["Build a reorderable assortment across shapes, series, and packaging.", "按甲型、系列与包装建立可复购的货盘。"], btn: ["Browse catalog", "浏览目录"], href: "/wholesale/" },
  { tag: ["Brand plan", "品牌计划"], moq: "OEM", h: ["Launch your own nail brand", "推出你的美甲品牌"], p: ["Custom styles and branded packaging with clear project support.", "定制款式与品牌包装，项目支持全程清晰。"], btn: ["Start a brand project", "开启品牌项目"], href: "/custom-private-label/" },
];

// ===== 区块11 · Series（用后台系列数据聚合）=====
const MOQ_BANDS = [1, 3, 5, 10, 30, 50, 100];
const MOQ_NOTES: [string, string][] = [
  ["Starter test", "起步试单"],
  ["New style trial", "新款试用"],
  ["Small batch", "小批量"],
  ["Standard wholesale", "标准批发"],
  ["Volume reorder", "批量补货"],
  ["Distribution tier", "分销档位"],
  ["Big buyer", "大批量"],
];

// ===== 区块13 · Nail shapes（8 种，含鸭嘴与其他）=====
const NAIL_SHAPES: [string, string][] = [
  ["Square", "方型"],
  ["Almond", "杏仁型"],
  ["Coffin", "梯形甲"],
  ["Oval", "椭圆型"],
  ["Stiletto", "尖型"],
  ["Duck", "鸭嘴形"],
  ["Round", "圆型"],
  ["Other", "其他甲型"],
];

// 甲型 SVG：浅粉渐变几何剪影（参照参考站图案重绘）
// 甲型 SVG：标准甲型几何轮廓（甲尖朝上），粉色渐变填充 + 细描边
function NailShapeSvg({ id }: { id: string }) {
  const g = (
    <defs>
      <linearGradient id={`ng-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4D0CA" />
        <stop offset="1" stopColor="#E2A9A0" />
      </linearGradient>
    </defs>
  );
  const fill = `url(#ng-${id})`;
  const common = { fill, stroke: "#C58A80", strokeWidth: 1.4 } as const;
  const svgStyle = { maxHeight: 96, maxWidth: 110, display: "block", margin: "0 auto" } as const;
  switch (id) {
    // 方型：平直甲尖，两侧平行，仅角部轻微圆角
    case "Square":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <rect x="13" y="5" width="34" height="90" rx="7" {...common} />
        </svg>
      );
    // 圆型：甲尖为宽圆弧，两侧近似垂直
    case "Round":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <path d="M17 96 L17 36 A13 13 0 0 1 43 36 L43 96 Q30 101 17 96 Z" {...common} />
        </svg>
      );
    // 杏仁型：上端圆润收尖（不过尖），中部最宽，下端收窄圆润
    case "Almond":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <path d="M30 2 C23 13 19 29 19 48 C19 68 23 84 29 93 Q30 96 31 93 C37 84 41 68 41 48 C41 29 37 13 30 2 Z" {...common} />
        </svg>
      );
    // 棺材型：甲尖平直宽大，两侧直线斜切收窄至下端圆弧（倒梯形）
    case "Coffin":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <path d="M11 9 L49 9 Q50.5 9 50.5 10.5 L50.5 16 L37.5 44 L37.5 82 Q37.5 92 30 92 Q22.5 92 22.5 82 L22.5 44 L9.5 16 L9.5 10.5 Q9.5 9 11 9 Z" {...common} />
        </svg>
      );
    // 椭圆型：标准竖椭圆
    case "Oval":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <ellipse cx="30" cy="50" rx="18" ry="45" {...common} />
        </svg>
      );
    // 尖型：甲尖锐利，长收尖，下端圆润
    case "Stiletto":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <path d="M30 2 C24 14 21 27 21 41 C21 61 24 79 28 91 Q30 96 32 91 C36 79 39 61 39 41 C39 27 36 14 30 2 Z" {...common} />
        </svg>
      );
    // 鸭嘴形：甲尖外扩呈宽阔扇形（鸭嘴开口感），向根部明显收窄
    case "Duck":
      return (
        <svg viewBox="0 0 60 100" style={svgStyle} aria-hidden="true">
          {g}
          <path d="M4 6 L56 6 Q59 6 59 9 L59 18 C48 28 44 42 44 60 L44 84 Q44 95 30 95 Q16 95 16 84 L16 60 C16 42 12 28 1 18 L1 9 Q1 6 4 6 Z" {...common} />
        </svg>
      );
    // 其他甲型：椭圆 + 杏仁 + 方型 三个小样
    case "Other":
      return (
        <svg viewBox="0 0 100 60" style={svgStyle} aria-hidden="true">
          {g}
          <ellipse cx="18" cy="30" rx="13" ry="22" {...common} />
          <path d="M52 3 C45 11 42 21 42 32 C42 45 45 54 49 59 Q52 61 55 59 C59 54 62 45 62 32 C62 21 59 11 52 3 Z" {...common} />
          <rect x="72" y="8" width="22" height="44" rx="7" {...common} />
        </svg>
      );
    default:
      return null;
  }
}

// ===== 区块18 · Paths（5 路径）=====
const PATHS = [
  { no: ["Shop by need", "按需求选购"], h: ["Catalog Hub", "目录中心"], p: ["Browse press-on nail series, shapes, MOQ filters, packaging options, and ready-to-ship product paths.", "浏览系列、甲型、起订量筛选、包装方案与现货路径。"], link: ["Open catalog", "打开目录"], href: "/wholesale/" },
  { no: ["Real selection", "真实选品"], h: ["1V1 Video Selection", "一对一视频选品"], p: ["Book a WhatsApp video call to see real styles, stock, quality details.", "预约 WhatsApp 视频看真实款式、库存与质量细节。"], link: ["Book a video session", "预约视频"], href: "/1v1-live-selection/" },
  { no: ["Zero inventory", "零库存"], h: ["Dropshipping Program", "一件代发"], p: ["Start selling with low-risk fulfillment & private-label shipping options.", "低风险履约与贴牌发货方案，轻松起步。"], link: ["Dropshipping Program", "一件代发方案"], href: "/dropshipping-program/" },
  { no: ["Build your brand", "打造品牌"], h: ["Custom & Private-Label", "定制与贴牌"], p: ["Create custom designs, packaging, logos for your brand.", "为你的品牌定制设计、包装与 logo。"], link: ["Custom & Private-Label", "定制与贴牌"], href: "/custom-private-label/" },
  { no: ["Need help", "需要帮助"], h: ["Business Inquiry", "商务咨询"], p: ["Send one clear request for wholesale pricing, sourcing or partnership questions.", "一次提交批发报价、采购或合作咨询。"], link: ["Business Inquiry", "商务咨询"], href: "/business-inquiry/" },
];

// ===== 区块19 · Buyer support shortcuts（5 入口）=====
const SUPPORTS = [
  { en: "Catalog Hub", zh: "目录中心", href: "/wholesale/" },
  { en: "Guide Center", zh: "采购指南", href: "/guide-center/" },
  { en: "Business Inquiry", zh: "商务咨询", href: "/business-inquiry/" },
  { en: "Shipping & Tracking", zh: "物流与跟踪", href: "/bulk-order-shipping-policy/" },
  { en: "Blog Hub", zh: "博客中心", href: "/blog/" },
];

export default function HomeContent({
  products,
  site,
  posts,
}: {
  products: Product[];
  site: SiteContent;
  posts: BlogPost[];
}) {
  const { t } = useT();
  const lang = useLang();
  const [seriesCat, setSeriesCat] = useState<"all" | "nails">("nails");
  const L = (pair: readonly [string, string] | string[]) => (lang === "zh" ? pair[1] : pair[0]);

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  // 无标记时兜底：从目录分流位置取样，保证区块有内容
  const pick5 = (list: Product[], fallbackStart: number) => {
    const chosen = list.slice(0, 5);
    let i = fallbackStart;
    while (chosen.length < 5 && i < products.length) {
      if (!chosen.includes(products[i])) chosen.push(products[i]);
      i++;
    }
    return chosen;
  };
  const bestSellers = pick5(products.filter((p) => p.bestSeller), 120);
  const flashDeals = pick5(products.filter((p) => p.clearance), 320);
  const customPicks = products.filter((p) => p.custom).slice(0, 4);

  // 系列聚合（穿戴甲 5 系列）
  const seriesOf = () => {
    const seen = new Set<string>();
    const out: { label: string; count: number }[] = [];
    for (const p of products) {
      if (p.category !== "nails" || seen.has(p.series)) continue;
      seen.add(p.series);
      out.push({ label: pickLang(p.seriesLabel, lang), count: products.filter((x) => x.series === p.series).length });
    }
    return out;
  };

  const heroSlides = site.hero.slides.map((s, i) => ({
    ...s,
    image: s.image || `/assets/images/placeholders/hero-${(i % 3) + 1}.svg`,
  }));

  return (
    <>
      {/* ===== 1 · Hero 轮播（4 屏） ===== */}
      <HeroCarousel slides={heroSlides} />

      {/* ===== 3 · Proof strip ===== */}
      <section className="section--tight" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 36px", justifyContent: "center", padding: "18px 0" }}>
            {PROOFS.map((pf, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                <span style={{ color: "var(--gold-deep)", fontWeight: 700 }}>✓</span>
                {L(pf)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4 · Real sourcing evidence ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="section__head">
            <div className="eyebrow">{lang === "zh" ? "真实采购证据" : "Real sourcing evidence"}</div>
            <h2>{lang === "zh" ? "下单前，先看真实货源" : "Real sourcing, before you order"}</h2>
            <p>{lang === "zh" ? "车间、直播选品与成品包装——全部用真实示例展示。" : "Workshop, live selection, and finished packaging—shown with real examples."}</p>
          </div>
          <div className="evidence">
            {EVIDENCE.map((ev) => (
              <div key={ev.h[0]} className="evidence__card">
                <div className="evidence__media" style={{ backgroundImage: `url('${ev.img}')` }}>
                  <div className="play">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="evidence__body">
                  <div className="eyebrow">{L(ev.ey)}</div>
                  <h4>{L(ev.h)}</h4>
                  <p>{L(ev.p)}</p>
                  <Link className="btn btn--line" href={ev.href}>{L(ev.btn)}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5 · Region Best Sellers（亚太 / 欧美 / 俄中东三大区域畅销款） ===== */}
      <RegionSections products={products} />

      {/* ===== 6 · Sell with Florin（上图下文卡片，参照参考站样式） ===== */}
      <section className="section section--tight" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <div className="sell-head">
            <h2>{lang === "zh" ? "与 Florin 合作共赢" : "Sell with Florin"}</h2>
            <p>{lang === "zh" ? "批发只是起点——四种方式做大你的美甲生意。" : "Wholesale is just the start — four ways to grow your nail business."}</p>
          </div>
          <div className="sell-grid">
            {SELL.map((g, i) => {
              const img = products[Math.floor(((i + 2) * products.length) / 8)]?.image
                || "/assets/images/placeholders/product-nails.svg";
              return (
                <Link key={g.h[0]} className="sell-card" href={g.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={L(g.h)} loading="lazy" />
                  <div className="sell-card__body">
                    <h3>{L(g.h)}</h3>
                    <p>{L(g.p)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 8 · New Arrivals ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="section__head">
            <div className="eyebrow">{lang === "zh" ? "为你的货盘上新" : "Fresh for your assortment"}</div>
            <h2>{lang === "zh" ? "新品上架" : "New Arrivals"}</h2>
            <p>{lang === "zh" ? "从最新加入的穿戴甲批发款开始。" : "Start with the newest press-on nail styles added for wholesale buyers."}</p>
          </div>
          <div className="product-grid">{newArrivals.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link className="btn btn--line" href="/new-arrivals/">{lang === "zh" ? "看全部新品" : "View New Arrivals"}</Link>
          </div>
        </div>
      </section>

      {/* ===== 9 · First-order Best Sellers（单行 5 卡，参照参考站样式） ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="prods-head">
            <h2>{lang === "zh" ? "首单热销款" : "First-order Best Sellers"}</h2>
            <Link className="prods-head__all" href="/best-sellers/">
              {lang === "zh" ? "查看所有产品 →" : "View all products →"}
            </Link>
          </div>
          <div className="product-grid product-grid--5">{bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      {/* ===== 10 · Flash Deals & Clearance（单行 5 卡，参照参考站样式） ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="prods-head">
            <h2>{lang === "zh" ? "闪购与清仓精选" : "Flash Deals & Clearance Picks"}</h2>
            <Link className="prods-head__all" href="/flash-deals-clearance/">
              {lang === "zh" ? "查看所有产品 →" : "View all products →"}
            </Link>
          </div>
          <div className="product-grid product-grid--5">{flashDeals.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      {/* ===== 13 · Shop by Nail Shape（8 甲型 SVG，参照参考站样式） ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="prods-head">
            <h2>{lang === "zh" ? "按甲型选购" : "Shop by Nail Shape"}</h2>
            <Link className="prods-head__all" href="/press-on-nails-wholesale/">
              {lang === "zh" ? "查看所有形状 →" : "View all shapes →"}
            </Link>
          </div>
          <div className="shapes-grid">
            {NAIL_SHAPES.map((s) => (
              <Link key={s[0]} className="shape-card" href="/press-on-nails-wholesale/">
                <div className="shape-card__fig">
                  <NailShapeSvg id={s[0]} />
                </div>
                <span>{L(s)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 16 · Customers are saying（带图评价卡，参照参考站样式） ===== */}
      <section className="section section--tight" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <div className="section__head">
            <h2>{lang === "zh" ? "客户怎么说" : "Customers are saying"}</h2>
          </div>
          <div className="reviews__rating" style={{ textAlign: "center", marginBottom: 24 }}>
            <span className="reviews__stars reviews__stars--dark">★★★★★</span>
            <span className="reviews__score">4.86</span>
            <span className="reviews__count">(128)</span>
          </div>
          <div className="reviews-v2">
            {site.reviews.items.slice(0, 4).map((r, i) => {
              const thumb = products[Math.floor(((i + 6) * products.length) / 10)]?.image
                || "/assets/images/placeholders/product-nails.svg";
              return (
                <div key={r.name} className="review-card-v2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={`${lang === "zh" ? "客户反馈" : "Customer photo"} — ${r.name}`} loading="lazy" />
                  <p className="review-card-v2__text">{pickLang(r.text, lang)}</p>
                  <div className="review-card-v2__stars">★★★★★</div>
                  <div className="review-card-v2__who">
                    <b>{r.name}</b>
                    <span className="review-card-v2__verified" title={lang === "zh" ? "已认证买家" : "Verified buyer"}>✔</span>
                    <span>· {r.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 17 · Our Blog Posts（参照参考站样式） ===== */}
      <section className="section section--tight">
        <div className="container">
          <div className="blog-head">
            <div>
              <div className="blog-head__eyebrow">{lang === "zh" ? "工作室与洞察" : "Studio & Insights"}</div>
              <h2>{lang === "zh" ? "博客文章" : "Our Blog Posts"}</h2>
            </div>
            <Link className="blog-head__all" href="/blog/">
              {lang === "zh" ? "查看所有帖子" : "View all posts"}
            </Link>
          </div>
          <div className="blog-v2">
            {posts.slice(0, 4).map((b, i) => {
              const cover = products[Math.floor(((i + 4) * products.length) / 9)]?.image
                || "/assets/images/placeholders/blog.svg";
              return (
                <Link key={b.id} className="blog-card-v2" href={`/blog/${b.slug}/`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={pickLang(b.title, lang)} loading="lazy" />
                  <div className="blog-card-v2__body">
                    <div className="blog-card-v2__cat">{b.category}</div>
                    <h4>{pickLang(b.title, lang)}</h4>
                    <span className="blog-card-v2__cta">{lang === "zh" ? "阅读文章 →" : "Read article →"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 订阅 ===== */}
      <NewsletterForm />

      {/* ===== 入口弹窗 ===== */}
      <EntryPopup />
    </>
  );
}
