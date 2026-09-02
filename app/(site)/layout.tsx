// 公开站点布局：语言 Provider + 头部 + 页脚 + toast + JSON-LD 组织信息
import { LanguageProvider } from "@/lib/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ToastHost from "@/components/Toast";
import { getSiteContent } from "@/lib/site-db";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent();
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Florin Wholesale",
    url: "https://www.florinwholesale.com/",
    logo: "https://www.florinwholesale.com/assets/images/logo.svg",
  };

  return (
    <>
      <LanguageProvider>
        <SiteHeader />
        <main>{children}</main>
        <Footer whatsapp={site.whatsapp} />
        <ToastHost />
      </LanguageProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
    </>
  );
}
