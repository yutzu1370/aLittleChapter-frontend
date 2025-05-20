import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import FloatingButtons from "@/components/interaction/FloatingButtons"
import ClientChat from "@/components/interaction/chat/ClientChat"
import { Toaster } from "sonner"
import localFont from "next/font/local"
import { Coiny } from "next/font/google"

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

export const metadata: Metadata = {
  title: "Little Chapter - 兒童書籍電商平台",
  description: "專為兒童打造的優質閱讀體驗",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${jfOpenHuninn.variable} ${coiny.variable}`}>
      <body className="font-jf-openhuninn" suppressHydrationWarning>
        {children}
        <FloatingButtons />
        <ClientChat />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}