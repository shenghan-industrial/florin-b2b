// 站点规范域名（canonical origin）——单一来源。
// 此前散落在 layout / sitemap / robots / product 等 5 处，硬编码为
// https://www.florinwholesale.com，但该域名 DNS 已不存在（NXDOMAIN），
// 导致 sitemap、canonical、JSON-LD 全部指向一个无法访问的域名。
// 邮箱域名（sales@florinwholesale.com）与此无关，仍保留原样。
export const SITE_URL = "https://cnflorin.com";
