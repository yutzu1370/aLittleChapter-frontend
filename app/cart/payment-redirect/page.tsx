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
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
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
      
      setPaymentInfo(jsonData.data)
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

  // 自動提交表單
  useEffect(() => {
    // 如果有付款資訊，自動提交表單
    if (paymentInfo && !loading && !error) {
      const form = document.getElementById("paymentForm") as HTMLFormElement
      if (form) {
        form.submit()
      }
    }
  }, [paymentInfo, loading, error])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">正在處理付款資訊...</p>
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
      {paymentInfo ? (
        <>
          <div className="text-center mb-4">
            <p className="text-gray-500">正在跳轉至付款頁面...</p>
          </div>
          
          <form
            id="paymentForm"
            method="post"
            action={paymentInfo.payGateWay}
            className="hidden"
          >
            <input type="hidden" name="MerchantID" value={paymentInfo.merchantID} />
            <input type="hidden" name="TradeInfo" value={paymentInfo.tradeInfo} />
            <input type="hidden" name="TradeSha" value={paymentInfo.tradeSha} />
            <input type="hidden" name="Version" value={paymentInfo.version} />
            <noscript>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                完成付款
              </button>
            </noscript>
          </form>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">無法取得付款資訊</p>
        </div>
      )}
    </div>
  )
}

// 載入中的 fallback 組件
function PaymentFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
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
