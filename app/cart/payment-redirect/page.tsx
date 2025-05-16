"use client"

import { useEffect, useState } from "react"
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

export default function PaymentRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 從 URL 參數中讀取付款資訊
    const payGateWay = searchParams.get("payGateWay")
    const merchantID = searchParams.get("merchantID")
    const tradeInfo = searchParams.get("tradeInfo") 
    const tradeSha = searchParams.get("tradeSha")
    const version = searchParams.get("version")

    // 檢查是否有完整的付款資訊
    if (payGateWay && merchantID && tradeInfo && tradeSha && version) {
      setPaymentInfo({
        payGateWay,
        merchantID,
        tradeInfo,
        tradeSha,
        version
      })
    } else {
      setError("付款資訊不完整，將返回結帳頁面")
      // 3秒後重定向到結帳頁面
      const timer = setTimeout(() => {
        router.push("/cart/checkout")
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  // 自動提交表單的 ref
  useEffect(() => {
    // 如果有付款資訊，自動提交表單
    if (paymentInfo) {
      const form = document.getElementById("paymentForm") as HTMLFormElement
      if (form) {
        form.submit()
      }
    }
  }, [paymentInfo])

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
          <p className="text-gray-500">正在準備付款資訊...</p>
        </div>
      )}
    </div>
  )
}
