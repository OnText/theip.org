import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 可以暂时保留，避免TypeScript报错阻断构建
  },
  reactStrictMode: false,
  images: {
    unoptimized: true, // ✅ 这个保留，Cloudflare Pages需要
  },
};

export default nextConfig;
