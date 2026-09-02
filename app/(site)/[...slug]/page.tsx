// catch-all：政策页 / 营销页 / 表单页 / thank-you（数据驱动）
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, PAGE_SLUGS } from "@/data/pages";
import StaticPageContent from "@/components/StaticPageContent";

const TITLES: Record<string, { en: string; zh: string }> = {
  "moq-lead-time-policy": { en: "MOQ & Lead-Time Policy", zh: "起订量与交期政策" },
  "sample-policy": { en: "Sample Policy", zh: "样品政策" },
  "bulk-order-shipping-policy": { en: "Bulk-Order Shipping Policy", zh: "批量订单物流政策" },
  "return-refund-policy": { en: "Return & Refund Policy", zh: "退换货政策" },
  "privacy-policy": { en: "Privacy Policy", zh: "隐私政策" },
  "terms-of-service": { en: "Terms of Service", zh: "服务条款" },
  "dropshipping-program-terms": { en: "Dropshipping Program Terms", zh: "一件代发方案条款" },
  "about-our-factory": { en: "Our Factory", zh: "我们的工厂" },
  "our-story": { en: "Our Story", zh: "品牌故事" },
  certifications: { en: "Certifications", zh: "资质证书" },
  "custom-private-label": { en: "Custom & Private-Label OEM/ODM", zh: "定制与贴牌 OEM/ODM" },
  "dropshipping-program": { en: "Dropshipping Program", zh: "一件代发方案" },
  faq: { en: "FAQ — Wholesale", zh: "批发常见问题" },
  "guide-center": { en: "Guide Center", zh: "采购指南中心" },
  "business-inquiry": { en: "Business Inquiry", zh: "商务咨询" },
  "sample-request": { en: "Request Samples", zh: "申请样品" },
  "1v1-live-selection": { en: "1-on-1 Live Selection", zh: "一对一视频选品" },
  "download-wholesale-catalog": { en: "Download Wholesale Catalog", zh: "下载批发目录" },
  "thank-you": { en: "Thank You", zh: "感谢提交" },
};

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = slug.join("/");
  const def = getPage(s);
  if (!def) return {};
  const title = TITLES[s]?.en ? `${TITLES[s].en} | Florin Wholesale` : def.slug;
  return {
    title,
    robots: def.noindex ? { index: false } : undefined,
    alternates: { canonical: `/${s}/` },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const def = getPage(slug.join("/"));
  if (!def) notFound();
  return <StaticPageContent def={def} />;
}
