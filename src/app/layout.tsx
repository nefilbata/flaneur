import type { Metadata } from "next";
import { Playfair_Display, Libre_Franklin } from "next/font/google";
import { SiteNav } from "@/components/ui/site-nav";
import "../styles/globals.css";

/* ── Google Fonts ── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const libre = Libre_Franklin({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-libre",
  display: "swap",
});

/* ── Metadata ── */
export const metadata: Metadata = {
  title: "Flâneur",
  description: "A personal food exploration journal — 用味蕾漫游城市",
};

/* ── Root Layout ── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${playfair.variable} ${libre.variable}`}
    >
      <body className="min-h-screen">
        {/* 导航栏 */}
        <SiteNav />

        {/* 主内容 */}
        <main className="min-h-[calc(100vh-4rem)] px-4 md:px-8 lg:px-16 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
