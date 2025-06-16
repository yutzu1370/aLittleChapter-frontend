"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { PaymentInfo } from "@/lib/types/checkout"

interface PaymentResponse {
  status: boolean
  message: string
  data: PaymentInfo
}

// 提取客戶端搜索參數邏輯到獨立組件
function PaymentProcessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // 檢查是否有 jsonData 參數（從結帳頁面傳入的完整付款資料）
    const jsonDataParam = searchParams.get("jsonData")
    
    if (!jsonDataParam) {
      setError("未收到付款資訊，請重新進行結帳")
      setLoading(false)
      
      // 3秒後重定向到結帳頁面
      const timer = setTimeout(() => {
        router.push("/cart/checkout")
      }, 3000)
      
      return () => clearTimeout(timer)
    }

    try {
      const jsonData: PaymentResponse = JSON.parse(decodeURIComponent(jsonDataParam))
      
      if (!jsonData.status || !jsonData.data) {
        throw new Error("付款資料格式不正確")
      }
      
      // 顯示接收到的付款資料
      console.log("=== 付款重定向頁面 - 接收到的資料 ===")
      console.log("完整 jsonData:", jsonData)
      console.log("付款資訊 paymentInfo:", jsonData.data)
      console.log("==========================================")
      
      // 創建並自動提交表單
      const form = document.createElement('form')
      form.method = 'post'
      form.action = jsonData.data.payGateWay
      
      // 添加表單欄位
      const fields = [
        { name: 'MerchantID', value: jsonData.data.merchantID },
        { name: 'TradeInfo', value: jsonData.data.tradeInfo },
        { name: 'TradeSha', value: jsonData.data.tradeSha },
        { name: 'Version', value: jsonData.data.version }
      ]
      
      fields.forEach(field => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = field.name
        input.value = field.value
        form.appendChild(input)
      })
      
      // 將表單添加到頁面並提交
      document.body.appendChild(form)
      
      console.log("=== 即將送出到藍新金流的資料 ===")
      console.log("表單 action:", jsonData.data.payGateWay)
      console.log("MerchantID:", jsonData.data.merchantID)
      console.log("TradeInfo:", jsonData.data.tradeInfo.substring(0, 100) + "...")
      console.log("TradeSha:", jsonData.data.tradeSha.substring(0, 50) + "...")
      console.log("Version:", jsonData.data.version)
      console.log("=====================================")
      console.log("正在提交表單到藍新金流...")
      
      // 立即提交表單
      form.submit()
      
      setLoading(false)
    } catch (err) {
      setError("付款資料解析錯誤：" + (err instanceof Error ? err.message : "未知錯誤"))
      setLoading(false)
      
      const timer = setTimeout(() => {
        router.push("/cart/checkout")
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">正在跳轉至付款頁面...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>錯誤</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-500">正在跳轉至付款頁面...</p>
      </div>
    </div>
  )
}

// 載入中的 fallback 組件
function PaymentFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-500">載入中...</p>
      </div>
    </div>
  )
}

export default function PaymentRedirectPage() {
  return (
    <Suspense fallback={<PaymentFallback />}>
      <PaymentProcessor />
    </Suspense>
  )
}
