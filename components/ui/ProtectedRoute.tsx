"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/useAuthStore"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/"
}: ProtectedRouteProps) => {
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
    
    // 驗證使用者是否已登入，使用 replace 而非 push 以避免在瀏覽歷史中留下記錄
    if (!isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isClient, isHydrated, router, redirectTo])

  // 標記客戶端渲染完成
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 載入中元件
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  // 未完成客戶端渲染或水合時顯示載入中
  if (!isClient || !isHydrated) {
    return <LoadingSpinner />
  }
  
  // 檢查登入狀態，未登入則顯示載入中(避免閃爍)
  if (!isAuthenticated) {
    return <LoadingSpinner />
  }

  // 已登入，顯示子元件
  return <>{children}</>
}

export default ProtectedRoute 