import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "英语听力训练站：段落播放器",
  description:
    "掌握英语听力，一段接一段！此网站专为母语非英文的学习者设计，通过按键操作（A键：上一段，S键：播放当前段，D键：下一段）分段播放英文博客，帮助用户有效提升英语听力技能。简单的界面和便捷的操作，让你的英语学习之旅更加轻松",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
