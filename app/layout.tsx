import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.florinwholesale.com"),
  title: {
    default: "Florin Wholesale — False Lashes, Press-On Nails & Colored Contacts B2B Supplier",
    template: "%s",
  },
  description:
    "Factory-direct B2B wholesale beauty supplier: false lashes, press-on nails, colored contacts & accessories. Clear MOQ, sample availability, OEM private-label and dropshipping worldwide.",
  icons: { icon: "/assets/images/favicon.svg" },
};

// 根布局：仅 html/body。公开站点 chrome（头部/页脚）在 (site) 分组里，
// 后台 /admin 与 /admin-login 不带站点装饰。
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
