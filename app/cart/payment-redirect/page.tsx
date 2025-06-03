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
  const [countdown, setCountdown] = useState(5)

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
    // 如果有付款資訊，顯示資料但不立即提交
    if (paymentInfo && !loading && !error) {
      // 顯示即將送出的表單資料
      console.log("=== 即將送出到藍新金流的資料 ===")
      console.log("表單 action:", paymentInfo.payGateWay)
      console.log("MerchantID:", paymentInfo.merchantID)
      console.log("TradeInfo:", paymentInfo.tradeInfo)
      console.log("TradeSha:", paymentInfo.tradeSha)
      console.log("Version:", paymentInfo.version)
      console.log("=====================================")
      
      // 延遲 5 秒後自動提交，讓使用者有時間查看 Console
      const timer = setTimeout(() => {
        const form = document.getElementById("paymentForm") as HTMLFormElement
        if (form) {
          console.log("正在提交表單到藍新金流...")
          form.submit()
        }
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [paymentInfo, loading, error])

  // 倒數計時
  useEffect(() => {
    if (paymentInfo && !loading && !error && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [paymentInfo, loading, error, countdown])

  // 手動提交表單的函數
  const handleManualSubmit = () => {
    const form = document.getElementById("paymentForm") as HTMLFormElement
    if (form) {
      console.log("手動提交表單到藍新金流...")
      form.submit()
    }
  }

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
    <div className="flex flex-col items-center justify-center h-screen p-8">
      {paymentInfo ? (
        <>
          <div className="text-center mb-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-teal-800 mb-4">付款資訊確認</h1>
            <p className="text-gray-600 mb-6">以下是即將送出到藍新金流的資料：</p>
            
            {/* 顯示付款資訊 */}
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <div className="space-y-3 font-mono text-sm">
                <div><strong>付款閘道:</strong> {paymentInfo.payGateWay}</div>
                <div><strong>商店代號:</strong> {paymentInfo.merchantID}</div>
                <div><strong>API版本:</strong> {paymentInfo.version}</div>
                <div><strong>交易資料 (TradeInfo):</strong> 
                  <div className="break-all text-xs text-gray-600 mt-1">
                    {paymentInfo.tradeInfo.substring(0, 100)}...
                  </div>
                </div>
                <div><strong>檢查碼 (TradeSha):</strong> 
                  <div className="break-all text-xs text-gray-600 mt-1">
                    {paymentInfo.tradeSha.substring(0, 50)}...
                  </div>
                </div>
              </div>
            </div>
            
            {countdown > 0 ? (
              <div className="mb-4">
                <p className="text-amber-600 font-medium">
                  {countdown} 秒後自動跳轉至付款頁面...
                </p>
                <button 
                  onClick={handleManualSubmit}
                  className="mt-3 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  立即前往付款
                </button>
              </div>
            ) : (
              <p className="text-gray-500">正在跳轉至付款頁面...</p>
            )}
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
