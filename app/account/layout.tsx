"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, Heart, Package, Tag, Bell, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/useAuthStore"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, isAuthenticated } = useAuthStore()
  const [isClient, setIsClient] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // 處理 Zustand store 水合問題
  useEffect(() => {
    // 等待下一個執行週期，確保 Zustand store 已水合
    const timeout = setTimeout(() => {
      setIsHydrated(true)
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [])
  
  // 標記客戶端渲染完成
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 確保在客戶端渲染和水合後再進行認證檢查
  useEffect(() => {
    if (!isClient || !isHydrated) return
    
    // 驗證使用者是否已登入，未登入則立即重定向到首頁
    if (!isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, isClient, isHydrated, router])

  const handleLogout = () => {
    logout()
    toast.success("登出成功", {
      description: "感謝您的使用，期待您的再次光臨",
    })
    setTimeout(() => router.push("/"), 1000)
  }

  const menuItems = [
    {
      href: "/account/profile",
      label: "個人資料",
    },
    {
      href: "/account/orders",
      label: "訂單",
    },
    {
      href: "/account/favorites",
      label: "收藏",
    },
    {
      href: "/account/coupons",
      label: "折扣碼",
    },
    {
      href: "/account/notifications",
      label: "通知",
      count: 8,
    },
  ]

  // 未完成客戶端渲染或水合，或未登入時顯示載入中
  if (!isClient || !isHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="pt-28 pb-20 min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 relative overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-8 py-3 rounded-t-2xl text-lg font-medium relative min-w-fit whitespace-nowrap",
                  pathname.includes(item.href)
                    ? "bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900 z-10"
                    : "bg-[#FCE9D8] text-gray-600 hover:bg-[#FCE9D8]/80"
                )}
              >
                {item.label}{item.count ? `(${item.count})` : ""}
              </Link>
            ))}
          </div>

          <div className="bg-white p-8 rounded-b-2xl rounded-tr-2xl border-4 border-[#F8D0B0] relative -mt-1 shadow-sm ">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 