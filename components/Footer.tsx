"use client";

import { useT } from "@/lib/LanguageContext";

// 页脚：深黑背景 + 买家支持捷径（紫色竖线）+ 5 快捷按钮 + 品牌简介 + 4 链接列 + 支付图标 + 底部栏
export default function Footer({ whatsapp }: { whatsapp?: string }) {
  const { t } = useT();

  const SHORTCUTS = [
    { label: t("footer.catalogHub"), href: "/wholesale/" },
    { label: t("footer.guideCenter"), href: "/guide-center/" },
    { label: t("footer.businessInquiry"), href: "/business-inquiry/" },
    { label: t("footer.shipping"), href: "/bulk-order-shipping-policy/" },
    { label: t("footer.blogHub"), href: "/blog/" },
  ];

  return (
    <>
      <footer className="footer-dark">
        <div className="container footer-dark__shortcuts">
          <div className="footer-dark__support">
            <h3><span className="footer-dark__bar" aria-hidden="true" />{t("footer.shortcutsH")}</h3>
            <p>{t("footer.note")}</p>
          </div>
          <div className="footer-dark__buttons">
            {SHORTCUTS.map((s) => (
              <a key={s.href} href={s.href}>{s.label}</a>
            ))}
          </div>
        </div>

        <div className="container footer-dark__grid">
          <div className="footer-dark__brand">
            <p>{t("footer.brand")}</p>
            <div className="footer-dark__pay">
              {["AMEX", "Apple Pay", "G Pay", "Mastercard", "PayPal", "shop", "UnionPay", "VISA"].map((p) => (
                <span key={p} className="footer-dark__pay-item" aria-label={p}>{p}</span>
              ))}
            </div>
          </div>
          <div className="footer-dark__col">
            <h4>{t("footer.col1h")}</h4>
            <a href="/about-our-factory/">{t("footer.about")}</a>
            <a href="/custom-private-label/">{t("footer.oem")}</a>
            <a href="/download-wholesale-catalog/">{t("footer.catalog")}</a>
          </div>
          <div className="footer-dark__col">
            <h4>{t("footer.supportH")}</h4>
            <a href="/sample-request/">{t("footer.sample")}</a>
            <a href="/faq/">{t("footer.faq")}</a>
            <a href="/business-inquiry/">{t("footer.contact")}</a>
          </div>
          <div className="footer-dark__col">
            <h4>{t("footer.shortcutsH")}</h4>
            <a href="/wholesale/">{t("footer.catalogHub")}</a>
            <a href="/guide-center/">{t("footer.guideCenter")}</a>
            <a href="/business-inquiry/">{t("footer.businessInquiry")}</a>
            <a href="/bulk-order-shipping-policy/">{t("footer.shipping")}</a>
            <a href="/blog/">{t("footer.blogHub")}</a>
          </div>
          <div className="footer-dark__col">
            <h4>{t("footer.policiesH")}</h4>
            <a href="/moq-lead-time-policy/">{t("footer.moqPol")}</a>
            <a href="/sample-policy/">{t("footer.samplePol")}</a>
            <a href="/bulk-order-shipping-policy/">{t("footer.shippingPol")}</a>
            <a href="/return-refund-policy/">{t("footer.returnPol")}</a>
            <a href="/privacy-policy/">{t("footer.privacyPol")}</a>
          </div>
        </div>

        <div className="container footer-dark__bottom">
          <button className="footer-dark__locale" type="button" aria-label={t("footer.locale")}>
            <span aria-hidden="true">🇺🇸</span>
            <span>{t("footer.locale")}</span>
            <span aria-hidden="true">▴</span>
          </button>
          <span className="footer-dark__copy">{t("footer.copyright")}</span>
          <a className="footer-dark__quote" href="/business-inquiry/">
            <span aria-hidden="true">🤍</span>
            {t("footer.getQuote")}
          </a>
        </div>
      </footer>
      <a className="whatsapp-float" href={`https://wa.me/${whatsapp || "8613800000000"}`} target="_blank" rel="noopener" aria-label="WhatsApp咨询">
        <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 00-8.6 15l-1.4 4 4.2-1.3A10 10 0 1012 2z" /></svg>
      </a>
    </>
  );
}
