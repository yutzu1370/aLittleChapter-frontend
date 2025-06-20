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
  title: "A Little Chapter - 親子繪本電商平台",
  description: "專為兒童打造的優質閱讀體驗",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
      <body className="font-noto-sans-tc" suppressHydrationWarning>
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