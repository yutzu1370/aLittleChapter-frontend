"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, Heart, Package, Tag, Bell, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface MenuItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

const MenuItem = ({ href, icon, label, isActive }: MenuItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-amber-100 text-amber-900 font-medium"
          : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

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
      icon: <User className="h-4 w-4" />,
      label: "個人資料",
    },
    {
      href: "/account/favorites",
      icon: <Heart className="h-4 w-4" />,
      label: "我的收藏",
    },
    {
      href: "/account/orders",
      icon: <Package className="h-4 w-4" />,
      label: "我的訂單",
    },
    {
      href: "/account/coupons",
      icon: <Tag className="h-4 w-4" />,
      label: "折扣碼",
    },
    {
      href: "/account/notifications",
      icon: <Bell className="h-4 w-4" />,
      label: "我的通知",
    },
    {
      href: "/account/change-password",
      icon: <KeyRound className="h-4 w-4" />,
      label: "修改密碼",
    },
  ]

  return (
    <>
      <Header />
      <div className="pt-28 pb-20 min-h-screen bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6">會員中心</h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左側選單 */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="sticky top-28 rounded-lg border border-amber-100 bg-white shadow-sm">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="flex flex-col gap-1 p-4">
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={pathname === item.href}
                      />
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        登出
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </aside>

            {/* 右側內容區域 */}
            <main className="flex-1 min-w-0">
              <div className="rounded-lg border border-amber-100 bg-white p-6 shadow-sm min-h-[calc(100vh-240px)]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 