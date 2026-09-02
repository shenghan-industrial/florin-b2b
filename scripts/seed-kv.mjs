// 把本地 .data/*.json 灌入 Cloudflare KV（参考 Shenghan seed-kv）
// 用法：
//   node scripts/seed-kv.mjs
// 环境变量（或直接改下方常量）：
//   CLOUDFLARE_ACCOUNT_ID  CLOUDFLARE_API_TOKEN  KV_NAMESPACE_ID
import fs from "node:fs";
import path from "node:path";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const KV_ID = process.env.KV_NAMESPACE_ID || "";

const KEYS = ["products", "blog", "site-content", "leads"];

if (!ACCOUNT_ID || !API_TOKEN || !KV_ID) {
  console.error("缺少环境变量：CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN / KV_NAMESPACE_ID");
  process.exit(1);
}

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_ID}`;

async function putKey(key, value) {
  const r = await fetch(`${BASE}/values/${key}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: value,
  });
  const j = await r.json();
  if (!j.success) throw new Error(`写入 ${key} 失败: ${JSON.stringify(j.errors)}`);
  console.log(`✓ ${key}`);
}

for (const key of KEYS) {
  const file = path.join(process.cwd(), ".data", `${key}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`跳过 ${key}（本地无 ${file}）`);
    continue;
  }
  await putKey(key, fs.readFileSync(file, "utf8"));
}
console.log("全部上传完成 ✅");
