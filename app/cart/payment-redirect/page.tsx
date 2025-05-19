"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface PaymentInfo {
  payGateWay: string
  merchantID: string
  tradeInfo: string
  tradeSha: string
  version: string
}

interface PaymentResponse {
  status: boolean
  message: string
  data: {
    order: PaymentInfo
  }
  redirectUrl: string
}

// 提取客戶端搜索參數邏輯到獨立組件
function PaymentProcessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // 從 URL 參數中取得訂單 ID 或其他必要參數
        const orderId = searchParams.get("orderId")
        
        if (!orderId) {
          throw new Error("訂單 ID 不存在")
        }

        // 呼叫後端 API 取得付款資訊
        const response = await fetch(`/api/payment/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("無法取得付款資訊")
        }

        const data: PaymentResponse = await response.json()

        if (!data.status) {
          throw new Error(data.message || "處理付款時發生錯誤")
        }

        // 設定付款資訊和跳轉網址
        setPaymentInfo(data.data.order)
        setRedirectUrl(data.redirectUrl)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "處理付款時發生錯誤")
        setLoading(false)
        
        // 5秒後重定向到結帳頁面
        const timer = setTimeout(() => {
          router.push("/cart/checkout")
        }, 5000)
        
        return () => clearTimeout(timer)
      }
    }

    // 檢查是否有 jsonData 參數（用於測試時直接傳入完整 JSON 資料）
    const jsonDataParam = searchParams.get("jsonData")
    if (jsonDataParam) {
      try {
        const jsonData: PaymentResponse = JSON.parse(decodeURIComponent(jsonDataParam))
        
        if (!jsonData.status || !jsonData.data?.order) {
          throw new Error("JSON 資料格式不正確")
        }
        
        setPaymentInfo(jsonData.data.order)
        setRedirectUrl(jsonData.redirectUrl)
        setLoading(false)
        return
      } catch (err) {
        setError("JSON 資料解析錯誤：" + (err instanceof Error ? err.message : "未知錯誤"))
        setLoading(false)
        
        const timer = setTimeout(() => {
          router.push("/cart/checkout")
        }, 5000)
        
        return () => clearTimeout(timer)
      }
    }

    // 從 URL 參數檢查是否有直接傳入的付款資訊
    const payGateWay = searchParams.get("payGateWay")
    const merchantID = searchParams.get("merchantID")
    const tradeInfo = searchParams.get("tradeInfo") 
    const tradeSha = searchParams.get("tradeSha")
    const version = searchParams.get("version")
    const directRedirectUrl = searchParams.get("redirectUrl")

    // 檢查是否有完整的直接傳入付款資訊
    if (payGateWay && merchantID && tradeInfo && tradeSha && version) {
      setPaymentInfo({
        payGateWay,
        merchantID,
        tradeInfo,
        tradeSha,
        version
      })
      if (directRedirectUrl) {
        setRedirectUrl(directRedirectUrl)
      }
      setLoading(false)
    } else {
      // 若沒有直接傳入資訊，則從 API 取得
      fetchPaymentData()
    }
  }, [searchParams, router])

  // 自動提交表單
  useEffect(() => {
    // 如果有付款資訊，自動提交表單
    if (paymentInfo && !loading && !error) {
      const form = document.getElementById("paymentForm") as HTMLFormElement
      if (form) {
        // 如果有自定義的 redirectUrl，則將表單提交的 action 替換為它
        if (redirectUrl) {
          form.action = redirectUrl
        }
        form.submit()
      }
    }
  }, [paymentInfo, loading, error, redirectUrl])

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
