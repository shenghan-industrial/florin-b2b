// 站点内容种子（hero 轮播 / topbar / promo / reviews / 联系方式）
import type { SiteContent } from "@/lib/types";

export function seedSiteContent(): SiteContent {
  return {
    topbar: {
      en: "💵 Min. order value $100 USD · Wholesale & Private-Label Worldwide",
      zh: "💵 最低订单金额 $100 USD · 全球批发与贴牌服务",
    },
    hero: {
      slides: [
        {
          image: "/assets/images/placeholders/hero-1.svg",
          link: "/wholesale/",
          title: {
            en: "READY-TO-SELL WHOLESALE",
            zh: "现货可售批发",
          },
          sub: {
            en: "Source the styles your buyers want. Browse ready-stock lash, nail & contact lens collections with clear buying paths.",
            zh: "采购买家想要的款式。浏览现货假睫毛、穿戴甲与美瞳系列，采购路径清晰。",
          },
          btn: { en: "Browse Wholesale Collections →", zh: "浏览批发系列 →" },
        },
        {
          image: "/assets/images/placeholders/hero-2.svg",
          link: "/custom-private-label/",
          title: { en: "CUSTOM & PRIVATE LABEL", zh: "定制与贴牌" },
          sub: {
            en: "Build your beauty brand, your way. Develop custom styles and branded packaging with clear project support.",
            zh: "按你的方式打造美妆品牌。开发定制款式与品牌包装，项目支持清晰。",
          },
          btn: { en: "Explore Customization →", zh: "了解定制 →" },
        },
        {
          image: "/assets/images/placeholders/hero-3.svg",
          link: "/1v1-live-selection/",
          title: { en: "1V1 LIVE SELECTION", zh: "一对一视频选品" },
          sub: {
            en: "See the details before you source. Review styles, finishes, and presentation with a live product specialist.",
            zh: "采购前先看细节。与选品专员视频核对款式、工艺与包装。",
          },
          btn: { en: "Book Live Selection →", zh: "预约视频选品 →" },
        },
      ],
    },
    promoBanner: {
      title: {
        en: "Ready-Stock 48h Dispatch",
        zh: "现货 48 小时内发出",
      },
      sub: {
        en: "Download the wholesale catalog and confirm stock with your account manager.",
        zh: "下载批发目录，与您的客户经理确认现货。",
      },
      link: "/download-wholesale-catalog/",
    },
    reviews: {
      badge: { en: "4.86 ★★★★★ (128 verified B2B reviews)", zh: "4.86 ★★★★★（128 条已核实 B2B 评价）" },
      items: [
        {
          name: "Danielle Rushin",
          location: "USA",
          rating: 5,
          text: {
            en: "Consistent quality across every reorder — the tray packaging keeps every pair intact.",
            zh: "每次补货品质一致——托盘包装让每对假睫毛完好无损。",
          },
        },
        {
          name: "Briana Esterberg",
          location: "Canada",
          rating: 5,
          text: {
            en: "The sample set matched the bulk order exactly. No surprises.",
            zh: "样品与大批量到货完全一致，没有任何意外。",
          },
        },
        {
          name: "Dalba Castrillon",
          location: "Colombia",
          rating: 5,
          text: {
            en: "Fast WhatsApp responses, clear MOQ tables. Ordering is straightforward.",
            zh: "WhatsApp 回复快，起订量表清楚，下单流程简单直接。",
          },
        },
        {
          name: "Michelle Kavanaugh",
          location: "UK",
          rating: 5,
          text: {
            en: "Private-label boxes arrived print-ready. Saved us a full supplier search.",
            zh: "贴牌包装盒到货即可用，省去了我们重新找供应商的时间。",
          },
        },
        {
          name: "Christina Brown",
          location: "Australia",
          rating: 5,
          text: {
            en: "My first wholesale order — the team walked me through every step.",
            zh: "我的第一笔批发订单——团队全程带着我走完了每一步。",
          },
        },
      ],
    },
    whatsapp: "8613800000000",
    contactEmail: "sales@florinwholesale.com",
  };
}
