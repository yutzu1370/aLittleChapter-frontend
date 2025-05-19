"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, Heart, Package, Tag, Bell, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

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

  return (
    <>
      <Header />
      <div className="pt-28 pb-20 min-h-screen bg-[#FEF5EE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex overflow-x-auto space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-6 py-3 min-w-fit text-center rounded-t-2xl border-4 border-b-0 text-[#3E120C] font-medium whitespace-nowrap relative",
                  pathname.includes(item.href)
                    ? "bg-white border-[#F8D0B0] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-white"
                    : "bg-[#FCE9D8] border-[#F8D0B0] border-opacity-50 hover:bg-[#FCE9D8]/80"
                )}
              >
                {item.label}{item.count ? `(${item.count})` : ""}
              </Link>
            ))}
          </div>

          <div className="rounded-b-lg rounded-tr-lg border-4 border-[#F8D0B0] bg-white p-6 md:p-12 shadow-sm min-h-[calc(100vh-280px)]">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 