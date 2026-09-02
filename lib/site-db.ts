// 站点内容数据层：KV key "site-content"，首读时用种子初始化
import { kvGetJSON, kvPutJSON, kvSeedIfEmpty } from "./kv-storage";
import type { SiteContent } from "./types";
import { seedSiteContent } from "@/data/site-content";

const KEY = "site-content";

export async function getSiteContent(): Promise<SiteContent> {
  return kvSeedIfEmpty<SiteContent>(KEY, seedSiteContent());
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await kvPutJSON(KEY, content);
  return content;
}
