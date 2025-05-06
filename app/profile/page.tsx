"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfileClient from "./profile-client"
import { useAuthStore } from "@/lib/store/useAuthStore"

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
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
  
  // 確保在客戶端渲染和水合後再進行認證檢查
  useEffect(() => {
    if (!isClient || !isHydrated) return
    
    console.log("認證狀態 (水合後):", isAuthenticated)
    
    // 驗證使用者是否已登入
    if (!isAuthenticated) {
      toast.error("請登入", {
        description: "您需要登入才能訪問個人資料頁面",
        duration: 3000
      })
      
      // 延遲 3 秒後跳轉到首頁
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }
  }, [isAuthenticated, isClient, isHydrated, router])

  // 標記客戶端渲染完成
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 未完成客戶端渲染或水合時顯示載入中
  if (!isClient || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  // 檢查登入狀態，未登入則顯示載入中(避免閃爍)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <h1 className="text-3xl font-bold text-amber-800 mb-6 text-center">個人資料</h1>
        <ProfileClient />
      </div>
      <div className="mt-36">
        <Footer />
      </div>
    </main>
  )
} 