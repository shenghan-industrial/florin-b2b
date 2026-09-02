// PDP 品类差异化文案模板（源自静态站 gen-pages.js PDP_COPY，补齐中文）
import type { CategoryId, MultiLangArray, MultiLangSpecs, MultiLangText, Product } from "@/lib/types";

const MATERIAL: Record<CategoryId, MultiLangText> = {
  lashes: { en: "lightweight Korean PBT / synthetic-mink fiber", zh: "轻量韩国 PBT / 仿真貂毛纤维" },
  nails: { en: "salon-grade acrylic-resin with a gel top coat", zh: "沙龙级丙烯酸树脂 + 凝胶顶油" },
  contacts: { en: "FDA/CE-referenced hydrogel lens material", zh: "参照 FDA/CE 标准的水凝胶镜片材料" },
  accessories: { en: "salon-grade consumable material", zh: "沙龙级耗材材料" },
};

export function categoryOverview(p: Product, lang: "en" | "zh"): string {
  const mat = MATERIAL[p.category][lang];
  const shapeTxt = p.shape && p.shape !== "—" ? p.shape : lang === "zh" ? "通用" : "universal";
  const name = p.name[lang];
  const series = p.seriesLabel[lang];
  if (lang === "zh") {
    if (p.category === "lashes")
      return `${name} 是 ${series} 系列的一款假睫毛，专为 ${shapeTxt} 眼型设计。每对采用 ${mat}，睫毛梗轻薄柔软，出厂前逐对手工检验卷翘度。它属于 Florin 现货假睫毛体系，面向需要稳定复购品质的经销商、沙龙与贴牌品牌方。`;
    if (p.category === "nails")
      return `${name} 是 ${series} 系列的一款穿戴甲，${shapeTxt} 甲型。每套采用 ${mat}，已预成型，无需 UV 灯即可佩戴。它属于 Florin 现货穿戴甲体系，面向追求免照灯快速佩戴的经销商、沙龙与贴牌品牌方。`;
    if (p.category === "contacts")
      return `${name} 是 ${series} 系列的一款彩色隐形眼镜，${shapeTxt} 规格。每片采用 ${mat}，基弧贴合舒适，含水量均衡，适合全天佩戴。它属于 Florin 现货美瞳体系，面向美瞳市场的经销商、沙龙与贴牌品牌方。`;
    return `${name} 是 ${series} 系列的一款${p.catLabel.zh}配件。采用 ${mat}，可与 Florin 假睫毛、穿戴甲批发方案搭配销售，帮助提升每笔订单的客单价。`;
  }
  const matEn = MATERIAL[p.category].en;
  if (p.category === "lashes")
    return `The ${name} is a ${p.seriesLabel.en} false-lash style built for the ${shapeTxt} eye shape. Each pair uses ${matEn}, with a thin flexible band and even curl checked by hand before packing. It is part of Florin's ready-stock lash program developed for resellers, salons and private-label brand owners who need consistent, reorderable quality.`;
  if (p.category === "nails")
    return `The ${name} is a ${p.seriesLabel.en} press-on nail set in a ${shapeTxt} shape. Each set uses ${matEn}, pre-shaped and ready to apply without a UV lamp. It is part of Florin's ready-stock nail program for resellers, salons and private-label brand owners that want fast, lamp-free application.`;
  if (p.category === "contacts")
    return `The ${name} is a ${p.seriesLabel.en} colored contact lens offered in a ${shapeTxt} format. Each lens uses ${matEn}, with a comfort-focused base curve and balanced water content for all-day wear. It is part of Florin's ready-stock lens program for resellers, salons and private-label brand owners serving the cosmetic-lens market.`;
  return `The ${name} is a ${p.seriesLabel.en} accessory for the ${p.catLabel.en.toLowerCase()} workflow. It uses ${matEn} and is built to pair with Florin's lash and nail wholesale programs, helping you lift average order value on every shipment.`;
}

interface PdpCopy {
  why: MultiLangArray;
  extra: MultiLangText;
  specExtra: { en: { label: string; value: string }[]; zh: { label: string; value: string }[] };
}

export const PDP_COPY: Record<CategoryId, PdpCopy> = {
  lashes: {
    why: {
      en: [
        "The soft, tapered band sits close to the lash line for comfortable all-day wear that suits both daily resale and salon application.",
        "Hand-aligned fibers keep curl and symmetry consistent across every pair, so reorders look the same as your approved first sample.",
        "Reusable construction lets end-customers wear the same pair several times — a strong, repeat-purchase selling point for resellers.",
      ],
      zh: [
        "睫毛梗轻薄柔软，贴近睫毛根部，全天佩戴舒适，适合日常零售与沙龙使用。",
        "手工排毛保持每对卷翘度与对称性一致，补货效果与您确认的样品完全一致。",
        "可重复佩戴的设计让终端顾客一对多次使用——是经销商强有力的复购卖点。",
      ],
    },
    extra: {
      en: "Lashes are supplied in protective trays. Custom tray printing, insert cards and branded outer boxes are available for private-label programs.",
      zh: "假睫毛以保护托盘出货。贴牌方案可定制托盘印刷、插卡与品牌外盒。",
    },
    specExtra: {
      en: [
        { label: "Band & Curl", value: "Thin flexible band, even curl" },
        { label: "Reusable", value: "Yes — multiple wears with care" },
      ],
      zh: [
        { label: "睫毛梗与卷翘", value: "梗轻薄柔软，卷翘均匀" },
        { label: "可重复使用", value: "是——妥善保存可多次佩戴" },
      ],
    },
  },
  nails: {
    why: {
      en: [
        "Pre-shaped, press-on application means no UV lamp and no salon visit — the fastest category to convert first-time buyers.",
        "Included adhesive tabs and glue options let you choose between daily wear and longer hold for different target markets.",
        "Full 14-size coverage in a single set reduces split-size complaints and makes assortment planning simple for resellers.",
      ],
      zh: [
        "已预成型，免 UV 灯、免去店——最容易转化新买家的品类。",
        "随附果冻胶与胶水两种方案，可按不同目标市场选择日抛佩戴或长效固定。",
        "单套覆盖 14 个尺码，减少尺码不齐的客诉，让经销商的选品规划更简单。",
      ],
    },
    extra: {
      en: "Sets ship in clear display boxes. Custom boxes, nail files, buffers and branded sticker kits are available for private-label programs.",
      zh: "穿戴甲以透明展示盒出货。贴牌方案可定制包装盒、指甲锉、抛光条与品牌贴纸套装。",
    },
    specExtra: {
      en: [
        { label: "Application", value: "Press-on, no UV lamp required" },
        { label: "Sizes per set", value: "14 sizes included" },
      ],
      zh: [
        { label: "佩戴方式", value: "按压式佩戴，无需 UV 灯" },
        { label: "每套尺码", value: "含 14 个尺码" },
      ],
    },
  },
  contacts: {
    why: {
      en: [
        "A comfort-focused base curve and balanced water content keep the lens comfortable across a full day of wear.",
        "Pupil-centered print and a natural iris blend give a believable enhancement that photographs well for online resale.",
        "Available with compliance documentation (CE / MSDS where applicable) to support cross-border wholesale qualification.",
      ],
      zh: [
        "基弧贴合舒适，含水量均衡，全天佩戴无负担。",
        "瞳孔中心印花与自然虹膜渐变，上眼真实感强，适合线上零售出图。",
        "可提供合规文件（CE / MSDS，视型号适用），支持跨境批发资质审核。",
      ],
    },
    extra: {
      en: "Lenses are sealed in individual blisters with lot tracing. Branded retail cards and outer cartons are available for private-label programs.",
      zh: "镜片独立铝箔密封包装并附批号追溯。贴牌方案可定制零售卡与外包纸盒。",
    },
    specExtra: {
      en: [
        { label: "Base Curve / Diameter", value: "8.6 mm / 14.2 mm" },
        { label: "Water Content", value: "38%" },
        { label: "Power Range", value: "0.00 – 8.00" },
        { label: "Replacement", value: "Per plan (daily / weekly / yearly)" },
      ],
      zh: [
        { label: "基弧 / 直径", value: "8.6 mm / 14.2 mm" },
        { label: "含水量", value: "38%" },
        { label: "度数范围", value: "0.00 – 8.00" },
        { label: "更换周期", value: "按型号（日抛 / 周抛 / 年抛）" },
      ],
    },
  },
  accessories: {
    why: {
      en: [
        "Complementary items that lift the average order value of every lash or nail shipment you place.",
        "Private-label ready — logo printing and custom packaging turn a consumable into a branded line.",
        "Small, lightweight and low-MOQ, ideal as fillers to reach the $100 minimum order value efficiently.",
      ],
      zh: [
        "配套耗材，直接提升每单假睫毛、穿戴甲发货的客单价。",
        "支持贴牌——logo 印刷与定制包装让耗材变成品牌产品线。",
        "体积小、重量轻、起订量灵活，是凑满 $100 起订额的高效补充品。",
      ],
    },
    extra: {
      en: "Accessories pair naturally with our lash and nail programs; bundle them in one shipment to simplify your logistics.",
      zh: "配件与假睫毛、穿戴甲方案天然搭配，可拼单同批出货，简化物流。",
    },
    specExtra: {
      en: [{ label: "Use With", value: "{cat} workflow" }],
      zh: [{ label: "适用场景", value: "{cat}使用流程" }],
    },
  },
};

// 依据品类模板生成产品描述/卖点/规格（规范化入库时填充，CMS 中可覆盖）
export function buildDescription(p: Product): { description: MultiLangText; features: MultiLangArray; specs: MultiLangSpecs } {
  const c = PDP_COPY[p.category];
  const catEn = p.catLabel.en;
  const catZh = p.catLabel.zh;
  const price = p.price.toFixed(2);
  return {
    description: {
      en: `Factory-direct wholesale ${catEn.toLowerCase()} — ${p.name.en}. Clear MOQ, sample availability and ${p.oem ? "OEM private-label support" : "standard wholesale terms"} for resellers, salons and brand owners.`,
      zh: `工厂直供 ${catZh}批发 —— ${p.name.zh}。起订量清晰、支持拿样${p.oem ? "、支持贴牌 OEM" : ""}，服务经销商、沙龙与品牌方。`,
    },
    features: {
      en: [
        `Minimum order: ${p.moq} ${p.unit} per style — low-risk first order.`,
        `Ready-stock wholesale at $${price} / ${p.unit}; ships in 1–3 business days.`,
        ...(p.sample ? ["Sample available — verify real quality before bulk order."] : []),
        ...(p.oem ? ["OEM / private-label supported: custom style, logo & packaging."] : []),
        ...(p.clearance ? ["Clearance stock — limited quantity, best price."] : []),
      ],
      zh: [
        `起订量：每款 ${p.moq} ${p.unit === "pair" ? "对" : p.unit === "set" ? "套" : p.unit === "pc" ? "片" : "盒"}——首单低风险。`,
        `现货批发 $${price} / ${p.unit === "pair" ? "对" : p.unit === "set" ? "套" : p.unit === "pc" ? "片" : "盒"}；1–3 个工作日内发货。`,
        ...(p.sample ? ["支持拿样——批量下单前先验证真实品质。"] : []),
        ...(p.oem ? ["支持贴牌 OEM：定制款式、logo 与包装。"] : []),
        ...(p.clearance ? ["清仓现货——数量有限，价格最优。"] : []),
      ],
    },
    specs: {
      en: [
        { label: "Category", value: catEn },
        { label: "Series", value: p.seriesLabel.en },
        { label: "Shape / Style", value: p.shape },
        { label: "Wholesale Price", value: `$${price} / ${p.unit}` },
        { label: "Minimum Order", value: `${p.moq} ${p.unit}` },
        { label: "Sample", value: p.sample ? "Available" : "Not available" },
        { label: "OEM / Private-Label", value: p.oem ? "Supported" : "Not supported" },
        { label: "Lead-Time", value: p.oem ? "15–25 working days (custom)" : "1–3 business days (stock)" },
        ...c.specExtra.en.map((s) => ({ label: s.label, value: s.value.replace("{cat}", catEn) })),
      ],
      zh: [
        { label: "品类", value: catZh },
        { label: "系列", value: p.seriesLabel.zh },
        { label: "形状 / 款式", value: p.shape },
        { label: "批发价", value: `$${price} / ${p.unit === "pair" ? "对" : p.unit === "set" ? "套" : p.unit === "pc" ? "片" : "盒"}` },
        { label: "起订量", value: `${p.moq} ${p.unit === "pair" ? "对" : p.unit === "set" ? "套" : p.unit === "pc" ? "片" : "盒"}` },
        { label: "样品", value: p.sample ? "支持" : "不支持" },
        { label: "贴牌 OEM", value: p.oem ? "支持" : "不支持" },
        { label: "交期", value: p.oem ? "15–25 个工作日（定制）" : "1–3 个工作日（现货）" },
        ...c.specExtra.zh.map((s) => ({ label: s.label, value: s.value.replace("{cat}", catZh) })),
      ],
    },
  };
}

export const UNIT_ZH: Record<string, string> = { pair: "对", set: "套", pc: "片", box: "盒" };
