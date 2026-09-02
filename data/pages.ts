// 政策页 / 营销页 / 表单页 双语内容（标题/眉题/引言用词典 page.<slug>.* 键，正文在这里）
import type { MultiLangText } from "@/lib/types";

export interface PageSection {
  h2: string;
  ps: string[];
}

export interface StaticPageDef {
  slug: string;
  type: "policy" | "page" | "form" | "utility";
  formType?: "inquiry" | "sample" | "live-selection" | "catalog";
  noindex?: boolean;
  body: { en: PageSection[]; zh: PageSection[] };
}

const P = (h2: string, ps: string[]): PageSection => ({ h2, ps });

export const STATIC_PAGES: StaticPageDef[] = [
  // ================= 政策页 =================
  {
    slug: "moq-lead-time-policy",
    type: "policy",
    body: {
      en: [
        P("1. Minimum Order Quantity (MOQ)", [
          "Each product page states its MOQ clearly. Stock items start from as low as MOQ 3–100 per style depending on the category. The overall order value must reach USD $100 to ship.",
          "Mixing styles is allowed — you can combine lashes, nails, contacts and accessories in one order to reach the minimum.",
        ]),
        P("2. Lead Time", [
          "Ready-stock items ship within 1–3 business days after payment confirmation. Custom / OEM orders run 15–25 working days after sample approval, subject to the production calendar.",
          "Large-volume orders may need a confirmed production slot; your account manager will lock the slot in writing.",
        ]),
        P("3. Stock Confirmation", [
          "Stock levels change daily. Confirm availability with your account manager before payment. Once payment is confirmed, the ordered quantity is reserved for your shipment.",
        ]),
      ],
      zh: [
        P("1. 起订量（MOQ）", [
          "每个产品页都清楚标注起订量。现货款式依品类不同，每款起订 3–100 件不等。整单金额需达到 100 美元方可发货。",
          "支持混款拼单——假睫毛、穿戴甲、美瞳与配件可合并一单凑满起订额。",
        ]),
        P("2. 交期", [
          "现货商品在付款确认后 1–3 个工作日内发货。定制 / 贴牌订单在样品确认后 15–25 个工作日，具体以生产排期为准。",
          "大批量订单可能需要确认排产档期，客户经理会以书面形式锁定档期。",
        ]),
        P("3. 库存确认", [
          "库存每日变动，付款前请与客户经理确认现货。付款确认后，所订数量即为您保留发货。",
        ]),
      ],
    },
  },
  {
    slug: "sample-policy",
    type: "policy",
    body: {
      en: [
        P("1. Who Can Order Samples", [
          "Sample orders are open to registered businesses — resellers, salon owners, brand owners and sourcing agents. A business email or WhatsApp contact is required for verification.",
        ]),
        P("2. Sample Fees & Freight", [
          "Sample fees and international freight are charged to the buyer. The sample fee is partially deductible from your first bulk order once it reaches the agreed amount.",
          "Standard sample preparation takes 5–7 working days after confirmation.",
        ]),
        P("3. What Samples Are For", [
          "Samples are for quality evaluation and product photography only — they are not for commercial resale. Bulk goods follow the same production line and quality standard as the sample you approve.",
        ]),
      ],
      zh: [
        P("1. 谁可以申请样品", [
          "样品面向注册商家开放——经销商、沙龙店主、品牌方与采购代理。需提供企业邮箱或 WhatsApp 联系方式以供核实。",
        ]),
        P("2. 样品费与运费", [
          "样品费与国际运费由买家承担。首次批量订单达到约定金额后，样品费可部分抵扣。",
          "样品备货一般在确认后 5–7 个工作日内完成。",
        ]),
        P("3. 样品的用途", [
          "样品仅用于品质评估与产品拍摄，不得用于商业转售。批量货品与您确认的样品同线生产、同标准质检。",
        ]),
      ],
    },
  },
  {
    slug: "bulk-order-shipping-policy",
    type: "policy",
    body: {
      en: [
        P("1. Shipping Methods", [
          "We ship worldwide via air express, air freight and sea freight. Your account manager recommends the most cost-effective method based on volume, weight and destination.",
        ]),
        P("2. Dispatch & Tracking", [
          "Ready-stock orders dispatch within 1–3 business days. Tracking numbers are shared by email or WhatsApp once the shipment is picked up.",
          "Custom / OEM shipments dispatch after final inspection; a pre-shipment photo or video review is available on request.",
        ]),
        P("3. Packaging", [
          "Fragile items (hand-art nails, trays) are packed with protective padding. Cartons are reinforced for international transit; customs documents are prepared by our export team.",
        ]),
      ],
      zh: [
        P("1. 运输方式", [
          "我们通过国际快递、空运与海运发货至全球。客户经理会根据体积、重量与目的地推荐最划算的运输方案。",
        ]),
        P("2. 发货与跟踪", [
          "现货订单在 1–3 个工作日内发出。揽收后运单号将通过邮件或 WhatsApp 发送。",
          "定制 / 贴牌订单在终检后发货；如需可提供发货前照片或视频确认。",
        ]),
        P("3. 包装", [
          "易碎品（手工穿戴甲、托盘等）均加保护内衬。外箱按国际运输标准加固，出口单据由我们的外贸团队准备。",
        ]),
      ],
    },
  },
  {
    slug: "return-refund-policy",
    type: "policy",
    body: {
      en: [
        P("1. Quality Inspection Window", [
          "Inspect your goods within 7 days of receipt. Report any defect with photos or videos via WhatsApp or email.",
        ]),
        P("2. What We Cover", [
          "Manufacturing defects, wrong styles sent, and quantity shortages verified against the packing list are eligible for replacement or refund.",
          "Custom-made / private-label goods are non-refundable unless they deviate from the approved sample or design file.",
        ]),
        P("3. What We Don't Cover", [
          "Transport damage after acceptance, storage issues at the buyer's side, and market-driven returns (slow sales) are outside this policy.",
        ]),
      ],
      zh: [
        P("1. 验货期限", [
          "请在收货后 7 天内完成验收。发现质量问题请通过 WhatsApp 或邮件提供照片/视频。",
        ]),
        P("2. 保障范围", [
          "生产瑕疵、发错款式、以及经装箱单核实的短少数量，均可申请换货或退款。",
          "定制 / 贴牌产品除非与确认样品或设计文件不符，否则不接受退换。",
        ]),
        P("3. 不保障范围", [
          "签收后的运输损坏、买家仓储问题、以及因滞销等市场原因提出的退货，不在本政策范围内。",
        ]),
      ],
    },
  },
  {
    slug: "privacy-policy",
    type: "policy",
    body: {
      en: [
        P("1. Information We Collect", [
          "We collect the business information you provide: company name, contact person, email, WhatsApp number, country and order details.",
        ]),
        P("2. How We Use It", [
          "Your information is used only to process inquiries, prepare quotations, arrange samples and shipments, and send business-related updates you subscribed to.",
        ]),
        P("3. Data Protection", [
          "We do not sell or rent your data to third parties. Order and contact records are kept for business follow-up only. You may request deletion at any time by contacting us.",
        ]),
      ],
      zh: [
        P("1. 我们收集的信息", [
          "我们仅收集您主动提供的商务信息：公司名、联系人、邮箱、WhatsApp 号码、国家与订单详情。",
        ]),
        P("2. 信息用途", [
          "您的信息仅用于处理询盘、报价、安排样品与发货，以及发送您订阅的商务更新。",
        ]),
        P("3. 数据保护", [
          "我们不会向第三方出售或出租您的数据。订单与联系记录仅用于商务跟进，您可随时联系我们要求删除。",
        ]),
      ],
    },
  },
  {
    slug: "terms-of-service",
    type: "policy",
    body: {
      en: [
        P("1. Agreement", [
          "By submitting an inquiry or placing an order, you agree to these terms. Quotes are valid for 14 days unless stated otherwise.",
        ]),
        P("2. Orders & Payment", [
          "Orders are confirmed after payment. We accept bank transfer and major payment platforms per the proforma invoice.",
        ]),
        P("3. Intellectual Property", [
          "Private-label designs and logos you provide remain your property. We never reuse customer artwork without written consent.",
        ]),
      ],
      zh: [
        P("1. 协议", [
          "提交询盘或下单即表示您同意本条款。报价单除非另有说明，有效期为 14 天。",
        ]),
        P("2. 订单与付款", [
          "订单在付款后确认。我们支持银行转账及主流支付平台，以形式发票为准。",
        ]),
        P("3. 知识产权", [
          "您提供的贴牌设计与 logo 归您所有。未经书面同意，我们绝不复用客户图稿。",
        ]),
      ],
    },
  },
  {
    slug: "dropshipping-program-terms",
    type: "policy",
    body: {
      en: [
        P("1. Program Scope", [
          "The dropshipping program covers ready-stock lashes, nails and accessories. Custom-made styles require a bulk commitment before listing.",
        ]),
        P("2. Fulfillment & Branding", [
          "We pack and ship under your store name. Blank or neutral packaging is used by default; branded inserts are available for an added fee.",
        ]),
        P("3. Responsibilities", [
          "You manage pricing, listings and customer service on your store. We are responsible for item quality, packing and dispatch tracking.",
        ]),
      ],
      zh: [
        P("1. 方案范围", [
          "一件代发方案覆盖现货假睫毛、穿戴甲与配件。定制款式需先达成批量承诺方可上架。",
        ]),
        P("2. 履约与包装", [
          "我们以您的店铺名义打包发货。默认使用空白/中性包装，品牌插卡可付费添加。",
        ]),
        P("3. 责任划分", [
          "您负责店铺的定价、listing 与客服。我们负责产品质量、打包与发货跟踪。",
        ]),
      ],
    },
  },

  // ================= 营销/服务页 =================
  {
    slug: "about-our-factory",
    type: "page",
    body: {
      en: [
        P("A Workshop Built for Wholesale", [
          "Our workshop specializes in handmade false lashes, press-on nails and packaging preparation. Every order passes hand inspection before packing — tray by tray, set by set.",
          "We keep production lines separate for stock and custom orders so your reorders stay consistent with the samples you approved.",
        ]),
        P("Quality Process", [
          "Materials are sourced from certified suppliers. Fibers, resin and lens materials carry compliance documentation on request. Final QC covers curl symmetry, artwork stability and packaging integrity.",
        ]),
      ],
      zh: [
        P("为批发而建的车间", [
          "我们的车间专注于手工假睫毛、穿戴甲与包装备货。每一单在装箱前都经过逐一手检——托盘逐盘、套装逐套。",
          "现货线与定制线分线生产，确保您的补货与已确认样品保持一致。",
        ]),
        P("品控流程", [
          "原材料来自认证供应商。纤维、树脂与镜片材料均可按要求提供合规文件。终检覆盖卷翘对称度、手工装饰牢固度与包装完整性。",
        ]),
      ],
    },
  },
  {
    slug: "our-story",
    type: "page",
    body: {
      en: [
        P("Why Florin Exists", [
          "Florin was built for one type of customer: beauty resellers who need consistent quality, honest MOQ and fast communication — not retail hype.",
          "We saw too many buyers lose money on batches that didn't match their samples. So we made sample-matching the core of our production system.",
        ]),
        P("What We Believe", [
          "A wholesale partner should answer fast, quote clearly, and ship what they promised. That's the entire brand promise — and it works in every market we serve.",
        ]),
      ],
      zh: [
        P("Florin 为什么存在", [
          "Florin 只服务一类客户：需要稳定品质、诚实起订量与快速响应的美妆经销商——而不是零售噱头。",
          "我们看到太多买家因到货与样品不符而亏损。所以我们把'样品一致'做成了生产体系的核心。",
        ]),
        P("我们的信念", [
          "批发伙伴就应该回复快、报价清、发货兑现承诺。这就是我们的全部品牌承诺——在每一个我们服务的市场都成立。",
        ]),
      ],
    },
  },
  {
    slug: "certifications",
    type: "page",
    body: {
      en: [
        P("Compliance Documents", [
          "For B2B buyers we provide material safety reports, CE documentation and MSDS where applicable. Documents are shared during the sample stage so your import qualification moves fast.",
        ]),
        P("How to Request", [
          "Mention your target market (US, EU, SEA, Middle East) in your inquiry — our export team prepares the matching document pack with your quotation.",
        ]),
      ],
      zh: [
        P("合规文件", [
          "我们可为 B2B 买家提供材料安全报告、CE 文件及适用的 MSDS。文件在样品阶段即可提供，帮助您快速完成进口资质审核。",
        ]),
        P("如何索取", [
          "在询盘中注明目标市场（美国、欧盟、东南亚、中东），我们的外贸团队会随报价单准备对应的文件包。",
        ]),
      ],
    },
  },
  {
    slug: "custom-private-label",
    type: "page",
    body: {
      en: [
        P("Custom & Private-Label OEM/ODM", [
          "Develop custom styles and branded packaging with clear project support — from one-off designs to full private-label collections.",
          "Workflow: consultation → formal quotation → pre-production sample → sample approval → mass production QC → shipment.",
        ]),
        P("What You Can Customize", [
          "Lash styles and curl types, nail shapes and art designs, contact lens prints, tray printing, insert cards, logo stickers, boxes and full retail packaging.",
        ]),
      ],
      zh: [
        P("定制与贴牌 OEM/ODM", [
          "开发定制款式与品牌包装，项目支持清晰——从单款设计到完整贴牌系列。",
          "流程：需求沟通 → 正式报价 → 产前样 → 样品确认 → 量产质检 → 发货。",
        ]),
        P("可定制内容", [
          "睫毛款式与卷翘类型、甲型与款式设计、美瞳花纹、托盘印刷、插卡、logo 贴纸、包装盒与完整零售包装。",
        ]),
      ],
    },
  },
  {
    slug: "dropshipping-program",
    type: "page",
    body: {
      en: [
        P("Sell Without Stock", [
          "Connect your Shopify store, push products in one click, and we pack and ship every order for you — no inventory required.",
          "Every parcel ships under your store name with neutral packaging by default.",
        ]),
        P("How to Start", [
          "1) Send your store link. 2) Pick styles from the ready-stock catalog. 3) We confirm listing data and shipping rates. 4) Orders sync, we fulfill daily.",
        ]),
      ],
      zh: [
        P("无需囤货即可销售", [
          "对接您的 Shopify 店铺，一键上架产品，我们为您打包并发货每一笔订单——无需任何库存。",
          "每个包裹默认以您的店铺名义、中性包装发出。",
        ]),
        P("如何开始", [
          "1) 发送您的店铺链接。2) 从现货目录挑选款式。3) 我们确认 listing 资料与运费。4) 订单同步，我们每日发货。",
        ]),
      ],
    },
  },
  {
    slug: "faq",
    type: "page",
    body: {
      en: [
        P("Frequently Asked Questions", [
          "What is the minimum order? — MOQ is shown on every product page; the overall order value must reach $100 USD.",
          "Can I get samples first? — Yes. Sample fees and freight are charged; part is deductible from your bulk order.",
          "Do you support private label? — Yes, OEM/ODM with custom styles, logo and packaging from MOQ to full collections.",
          "How fast is shipping? — Stock ships in 1–3 business days; custom production runs 15–25 working days.",
          "Which markets do you serve? — Worldwide, with strong experience in Southeast Asia, US, EU and Middle East markets.",
          "How do I pay? — Bank transfer and major payment platforms per the proforma invoice.",
        ]),
      ],
      zh: [
        P("常见问题", [
          "起订量是多少？——每款产品的起订量都标注在产品页；整单金额需达到 100 美元。",
          "可以先拿样吗？——可以。样品费与运费由买家承担，部分可在大单中抵扣。",
          "支持贴牌吗？——支持 OEM/ODM，从起订量到完整系列的定制款式、logo 与包装。",
          "发货有多快？——现货 1–3 个工作日发出；定制生产 15–25 个工作日。",
          "服务哪些市场？——全球范围，在东南亚、美国、欧盟与中东市场经验丰富。",
          "如何付款？——银行转账及主流支付平台，以形式发票为准。",
        ]),
      ],
    },
  },
  {
    slug: "guide-center",
    type: "page",
    body: {
      en: [
        P("Sourcing Guides for B2B Buyers", [
          "Start with samples, then scale with reorders — our blog covers supplier vetting, sample inspection and market selection in depth.",
          "New to import? Our export team explains HS codes, customs documents and freight options for your destination market.",
        ]),
        P("Business Tools", [
          "Download the wholesale catalog, request a live video selection, or send one clear inquiry — every path leads to a human reply within 1 business day.",
        ]),
      ],
      zh: [
        P("B2B 采购指南", [
          "先拿样、再以补货放量——我们的博客深入讲解供应商筛选、样品验收与市场选品。",
          "进口新手？我们的外贸团队会为您讲解目标市场的 HS 编码、清关文件与物流方案。",
        ]),
        P("商务工具", [
          "下载批发目录、预约视频选品、或直接提交一份清晰的询盘——每条路径都会在 1 个工作日内得到人工回复。",
        ]),
      ],
    },
  },

  // ================= 表单页 =================
  {
    slug: "business-inquiry",
    type: "form",
    formType: "inquiry",
    body: {
      en: [
        P("Send One Clear Request", [
          "Wholesale pricing, sourcing questions or partnership proposals — one form, one reply within 1 business day.",
        ]),
      ],
      zh: [
        P("发送一份清晰的询盘", [
          "批发报价、采购问题或合作提案——一份表单，1 个工作日内回复。",
        ]),
      ],
    },
  },
  {
    slug: "sample-request",
    type: "form",
    formType: "sample",
    body: {
      en: [
        P("Try Before You Buy", [
          "Sample fees and freight apply and are partially deductible from your bulk order. Preparation takes 5–7 working days.",
        ]),
      ],
      zh: [
        P("先试再买", [
          "样品费与运费由买家承担，可在大单中部分抵扣。备样需 5–7 个工作日。",
        ]),
      ],
    },
  },
  {
    slug: "1v1-live-selection",
    type: "form",
    formType: "live-selection",
    body: {
      en: [
        P("See Real Products, Live", [
          "Book a WhatsApp video call and inspect real-product samples with your own eyes. We confirm your appointment within 1 business day.",
        ]),
      ],
      zh: [
        P("视频看真品", [
          "预约 WhatsApp 视频通话，亲眼核对真实样品。我们会在 1 个工作日内与您确认时间。",
        ]),
      ],
    },
  },
  {
    slug: "download-wholesale-catalog",
    type: "form",
    formType: "catalog",
    body: {
      en: [
        P("Get the Full PDF Catalog", [
          "False lashes, press-on nails and colored contacts — MOQ tables, pricing tiers and packaging options in one PDF.",
        ]),
      ],
      zh: [
        P("获取完整 PDF 目录", [
          "假睫毛、穿戴甲与美瞳——起订量表、价格梯度与包装方案尽在一份 PDF。",
        ]),
      ],
    },
  },
  {
    slug: "thank-you",
    type: "utility",
    noindex: true,
    body: {
      en: [P("Thank You", ["Your request has been received — we will reply within 1 business day."])],
      zh: [P("感谢提交", ["我们已收到您的请求，将在 1 个工作日内回复。"])],
    },
  },
];

export function getPage(slug: string): StaticPageDef | undefined {
  return STATIC_PAGES.find((p) => p.slug === slug);
}

export const PAGE_SLUGS = STATIC_PAGES.map((p) => p.slug);
