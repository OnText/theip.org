import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 原有配置（适配next-on-pages）
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 原有配置
  },
  reactStrictMode: false, // 原有配置
  // 新增：适配Cloudflare Pages的图片处理（避免构建/部署后图片加载异常）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
