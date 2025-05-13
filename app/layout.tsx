import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import FloatingButtons from "@/components/interaction/FloatingButtons"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="zh-TW">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <FloatingButtons />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}