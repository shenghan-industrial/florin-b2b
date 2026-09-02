"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

function MegaLink({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <Link href={href}>
      <span>{label}</span>
      {sub && <span className="nav__sub">{sub}</span>}
    </Link>
  );
}

// 顶部导航：topbar + 品牌 + 四栏 mega 菜单（SHOP/SERVICES/RESOURCES/ABOUT US）+ 抽屉
export default function SiteHeader() {
  const { t } = useT();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <div className="topbar" id="topbar">
        <span>{t("topbar")}</span>
        <button className="topbar__close" aria-label="Close" onClick={() => {
          const el = document.getElementById("topbar");
          if (el) el.style.display = "none";
        }}>×</button>
      </div>

      <header className="site-header">
        <div className="container header__inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo.svg" alt="Florin Wholesale — false lashes, press-on nails and colored contacts B2B supplier" />
          </Link>

          <nav className="nav" aria-label="Primary">
            <ul className="nav__list">
              <li className="nav__item has-mega">
                <span className="nav__link">{t("nav.shop")}</span>
                <div className="mega">
                  <div className="mega__col">
                    <h4>{t("mega.categories")}</h4>
                    <MegaLink href="/false-lashes-wholesale/" label={t("nav.lashes")} sub="假睫毛" />
                    <MegaLink href="/press-on-nails-wholesale/" label={t("nav.nails")} sub="穿戴甲" />
                    <MegaLink href="/colored-contacts-wholesale/" label={t("nav.contacts")} sub="美瞳" />
                    <MegaLink href="/wholesale/" label={t("nav.accessories")} sub="Glue, Tools, Packaging Boxes" />
                  </div>
                  <div className="mega__col">
                    <h4>{t("mega.buyingPaths")}</h4>
                    <MegaLink href="/new-arrivals/" label={t("nav.newArrivals")} sub="新品上架" />
                    <MegaLink href="/best-sellers/" label={t("nav.bestSellers")} sub="热销款" />
                    <MegaLink href="/flash-deals-clearance/" label={t("nav.flash")} sub="清仓特价" />
                  </div>
                  <div className="mega__col">
                    <h4>{t("mega.quickFilters")}</h4>
                    <MegaLink href="/wholesale/" label={t("nav.moq")} sub="起订量筛选" />
                    <MegaLink href="/custom-private-label/" label={t("nav.oem")} sub="支持贴牌" />
                    <MegaLink href="/sample-request/" label={t("nav.sample")} sub="可先拿样" />
                  </div>
                </div>
              </li>
              <li className="nav__item has-mega">
                <span className="nav__link">{t("nav.services")}</span>
                <div className="mega">
                  <div className="mega__col">
                    <h4>{t("mega.sourcing")}</h4>
                    <MegaLink href="/wholesale/" label={t("nav.readyStock")} sub="现货批发" />
                    <MegaLink href="/custom-private-label/" label={t("nav.custom")} sub="贴牌定制" />
                    <MegaLink href="/dropshipping-program/" label={t("nav.dropship")} sub="一件代发" />
                  </div>
                  <div className="mega__col">
                    <h4>{t("mega.humanTouch")}</h4>
                    <MegaLink href="/1v1-live-selection/" label={t("nav.video")} sub="一对一视频选品" />
                    <MegaLink href="/sample-request/" label={t("nav.sampleReq")} sub="样品申请" />
                  </div>
                </div>
              </li>
              <li className="nav__item has-mega">
                <span className="nav__link">{t("nav.resources")}</span>
                <div className="mega mega--2">
                  <div className="mega__col">
                    <h4>{t("mega.downloads")}</h4>
                    <MegaLink href="/download-wholesale-catalog/" label={t("nav.catalog")} sub="产品目录 PDF" />
                    <MegaLink href="/faq/" label={t("nav.faq")} sub="批发常见问题" />
                  </div>
                  <div className="mega__col">
                    <h4>{t("mega.learn")}</h4>
                    <MegaLink href="/blog/" label={t("nav.blog")} sub="B端行业博客" />
                    <MegaLink href="/guide-center/" label={t("nav.guide")} sub="采购指南" />
                  </div>
                </div>
              </li>
              <li className="nav__item has-mega">
                <span className="nav__link">{t("nav.about")}</span>
                <div className="mega mega--2">
                  <div className="mega__col">
                    <h4>{t("mega.company")}</h4>
                    <MegaLink href="/about-our-factory/" label={t("nav.aboutFactory")} sub="工厂介绍" />
                    <MegaLink href="/certifications/" label={t("nav.cert")} sub="资质证书下载" />
                  </div>
                  <div className="mega__col">
                    <h4>{t("mega.brand")}</h4>
                    <MegaLink href="/our-story/" label={t("nav.story")} sub="品牌故事" />
                  </div>
                </div>
              </li>
              <li className="nav__item">
                <Link className="nav__link" href="/business-inquiry/">{t("nav.contact")}</Link>
              </li>
            </ul>
          </nav>

          <div className="header__tools">
            <LanguageSwitcher />
            <Link className="icon-btn" href="/search/" aria-label={t("header.search")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </Link>
            <Link className="icon-btn" href="/business-inquiry/" aria-label={t("header.account")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
            </Link>
            <Link className="icon-btn" href="/business-inquiry/" aria-label={t("header.cart")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 6h15l-1.5 9h-12L4 3H1" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>
            </Link>
            <button className="hamburger" aria-label="Menu" onClick={() => setDrawerOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${drawerOpen ? "open" : ""}`} id="drawer">
        <div className="drawer__mask" onClick={closeDrawer} />
        <div className="drawer__panel">
          <div className="drawer__head">
            <strong style={{ fontFamily: "'Jost'", letterSpacing: 2, color: "var(--gold-deep)" }}>{t("drawer.menu")}</strong>
            <button className="drawer__close" onClick={closeDrawer}>×</button>
          </div>
          <div className="drawer__group">
            <strong>{t("drawer.shop")}</strong>
            <a href="/false-lashes-wholesale/" onClick={closeDrawer}>{t("nav.lashes")}</a>
            <a href="/press-on-nails-wholesale/" onClick={closeDrawer}>{t("nav.nails")}</a>
            <a href="/colored-contacts-wholesale/" onClick={closeDrawer}>{t("nav.contacts")}</a>
            <a href="/wholesale/" onClick={closeDrawer}>{t("nav.accessories")}</a>
            <a href="/new-arrivals/" onClick={closeDrawer}>{t("nav.newArrivals")}</a>
            <a href="/best-sellers/" onClick={closeDrawer}>{t("nav.bestSellers")}</a>
            <a href="/flash-deals-clearance/" onClick={closeDrawer}>{t("nav.flash")}</a>
          </div>
          <div className="drawer__group">
            <strong>{t("drawer.services")}</strong>
            <a href="/wholesale/" onClick={closeDrawer}>{t("nav.readyStock")}</a>
            <a href="/custom-private-label/" onClick={closeDrawer}>{t("nav.custom")}</a>
            <a href="/dropshipping-program/" onClick={closeDrawer}>{t("nav.dropship")}</a>
            <a href="/1v1-live-selection/" onClick={closeDrawer}>{t("nav.video")}</a>
            <a href="/sample-request/" onClick={closeDrawer}>{t("nav.sampleReq")}</a>
          </div>
          <div className="drawer__group">
            <strong>{t("drawer.resources")}</strong>
            <a href="/download-wholesale-catalog/" onClick={closeDrawer}>{t("nav.catalog")}</a>
            <a href="/guide-center/" onClick={closeDrawer}>{t("nav.guide")}</a>
            <a href="/blog/" onClick={closeDrawer}>{t("nav.blog")}</a>
            <a href="/faq/" onClick={closeDrawer}>{t("nav.faq")}</a>
          </div>
          <div className="drawer__group">
            <strong>{t("drawer.about")}</strong>
            <a href="/about-our-factory/" onClick={closeDrawer}>{t("nav.aboutFactory")}</a>
            <a href="/certifications/" onClick={closeDrawer}>{t("nav.cert")}</a>
            <a href="/our-story/" onClick={closeDrawer}>{t("nav.story")}</a>
          </div>
          <div className="drawer__group">
            <a href="/business-inquiry/" onClick={closeDrawer} style={{ fontFamily: "'Jost'", color: "var(--gold-deep)" }}>{t("drawer.contactUs")}</a>
          </div>
        </div>
      </div>
    </>
  );
}
