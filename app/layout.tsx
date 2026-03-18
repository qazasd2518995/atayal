import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import DeveloperMode from "@/components/DeveloperMode";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";

export const metadata: Metadata = {
  title: "泰雅語線上學習平台",
  description: "3週制泰雅語學習平台，包含教材、遊戲和AI助教",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-nature min-h-screen">
        <ServiceWorkerProvider />
        <main>
          {children}
        </main>
        <ChatWidget />
        <DeveloperMode />
      </body>
    </html>
  );
}
