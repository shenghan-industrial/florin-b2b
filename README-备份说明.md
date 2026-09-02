# Florin B2B 项目备份说明（2026-08-21）

## 恢复运行

```bash
cd florin-b2b-next
npm install          # 用 .npmrc 里的国内镜像，无需 VPN
npm run dev          # 自动启动 KV 桥接服务 + 网站
```

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin-login （admin / admin123）
- 双击桌面「启动Florin网站.bat」也可启动（需改 bat 里的路径）

## 数据

- `.data/*.json`：产品库（1507 个产品，含 1490 个穿戴甲货盘款）、博客、站点内容、线索
- **产品图片在 Cloudinary 云端**（folder=florin/products），本包不含本地缓存
- 如需重新提取原始图片：源文件是桌面「穿戴甲货盘表.xlsx」，提取脚本在
  `C:\Users\30448\AppData\Local\Temp\claude\extract-huopan.py`

## 密钥（.env.local 内）

- 阿里云百炼 DASHSCOPE_API_KEY（AI 起名/文案/翻译）
- Resend RESEND_API_KEY（⚠️ 已失效，需换新 key 邮件通知才能用）
- Cloudinary 三个凭证（图片上传）
- 部署到 Cloudflare Pages 时把同名变量填到平台环境变量

## 部署（Cloudflare Pages）

1. 建 Pages 项目（Git 或直传上传本目录，构建命令 `npx @cloudflare/next-on-pages`，输出目录 `.vercel/output/static`）
2. 建 KV 命名空间，绑定名 `KV_STORE`（填进 wrangler.toml）
3. 环境变量：ADMIN_USERNAME / ADMIN_PASSWORD / JWT_SECRET / DASHSCOPE_API_KEY / RESEND_API_KEY / NOTIFY_EMAIL / CLOUDINARY_*
4. 首次灌数据：`node scripts/seed-kv.mjs`（需要 CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN / KV_NAMESPACE_ID）
5. 域名：先 *.pages.dev，之后买 florinwholesale.com 再绑定
