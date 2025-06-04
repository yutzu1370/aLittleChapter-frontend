import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import FloatingButtons from "@/components/interaction/FloatingButtons"
import ClientChat from "@/components/interaction/chat/ClientChat"
import { Toaster } from "@/components/ui/sonner"
import localFont from "next/font/local"
import { Coiny, Noto_Sans_TC } from "next/font/google"
import { StagewiseToolbar } from '@stagewise/toolbar-next'

// 定義 jf-openhuninn-2.0 字體
const jfOpenHuninn = localFont({
  src: "../public/fonts/jf-openhuninn-2.0.ttf",
  variable: "--font-jf-openhuninn",
  display: "swap",
})

// 定義 Coiny 字體
const coiny = Coiny({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-coiny",
  display: "swap",
})

// 定義 Noto Sans TC 字體
const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Little Chapter - 兒童書籍電商平台",
  description: "專為兒童打造的優質閱讀體驗",
}

// Stagewise 配置
const stagewiseConfig = {
  plugins: []
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${jfOpenHuninn.variable} ${coiny.variable} ${notoSansTC.variable}`}>
      <body className="font-jf-openhuninn" suppressHydrationWarning>
        {children}
        <FloatingButtons />
        <ClientChat />
        <Toaster position="top-center" richColors />
        {/* Stagewise 工具欄 - 僅在開發模式下顯示 */}
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
      </body>
    </html>
  )
}