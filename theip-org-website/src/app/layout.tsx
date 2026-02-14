import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
// 🌟 新增：引入你定义的 useI18n 钩子
import { useI18n } from "@/lib/i18n"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "theip.org - IP 地址技术文档",
  description: "全面的 IPv4 与 IPv6 技术指南，面向开发者的专业参考文档。包含地址格式、子网划分、过渡技术等详细内容。",
  keywords: ["IP地址", "IPv4", "IPv6", "子网划分", "网络技术", "技术文档", "开发者指南"],
  authors: [{ name: "theip.org" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "theip.org - IP 地址技术文档",
    description: "全面的 IPv4 与 IPv6 技术指南，面向开发者的专业参考",
    url: "https://theip.org",
    siteName: "theip.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "theip.org - IP 地址技术文档",
    description: "全面的 IPv4 与 IPv6 技术指南，面向开发者的专业参考",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🌟 新增：获取国际化的 lang
  const { lang } = useI18n();
  // 🌟 新增：适配 html lang 格式（zh → zh-CN，en → en-US）
  const htmlLang = lang === "zh" ? "zh-CN" : "en-US";
  
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
