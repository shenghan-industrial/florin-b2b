import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // 与静态站 URL 结构保持一致（/wholesale/ 带尾斜杠）
  trailingSlash: true,
};

export default nextConfig;
