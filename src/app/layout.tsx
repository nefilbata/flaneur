import type { Metadata } from "next";
import { Libre_Franklin, Playfair_Display } from "next/font/google";
import { SiteNav } from "@/components/ui/site-nav";
import "../styles/globals.css";

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

export const metadata: Metadata = {
  title: "Flaneur",
  description: "A personal food exploration journal.",
};

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
        <SiteNav />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 md:px-8 lg:px-16">
          {children}
        </main>
      </body>
    </html>
  );
}
