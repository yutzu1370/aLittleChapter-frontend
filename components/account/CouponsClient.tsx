"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Clock, Copy, Ticket, Zap, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDiscountCodesApi, DiscountCode } from "@/lib/api/discountCodes"

// 折扣碼卡片元件
const CouponCard = ({ coupon }: { coupon: DiscountCode }) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    if (codeRef.current) {
      const code = coupon.code
      navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("已複製折扣碼", {
        description: `${code} 已複製到剪貼簿`,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isActive = !coupon.isUsed
  const now = new Date()
  const expiryDate = new Date(coupon.endDate)
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={cn(
      "overflow-hidden border",
      isActive ? "border-[#F8D0B0]" : "border-gray-200 opacity-60"
    )}>
      <div className={cn(
        "px-4 sm:px-6 py-3 sm:py-4",
        isActive ? "bg-[#FEF5EE]" : "bg-gray-50"
      )}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Ticket className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 mr-2",
              isActive ? "text-amber-600" : "text-gray-400"
            )} />
            <h3 className="font-medium text-sm sm:text-base">
              {coupon.discountType === "percentage" && `${(coupon.discountValue * 100).toFixed(0)}% 折扣`}
              {coupon.discountType === "fixed" && `現折 NT$${coupon.discountValue}`}
            </h3>
          </div>
          {isActive ? (
            <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              可使用
            </span>
          ) : (
            <span className="inline-flex items-center text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full">
              <X className="w-3 h-3 mr-1" />
              已使用
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-3 sm:pt-4 sm:px-6 sm:pb-4">
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{coupon.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1" />
            {isActive && daysLeft > 0 ? (
              <span className="text-xs sm:text-xs">有效期限 {new Date(coupon.endDate).toLocaleDateString('zh-TW')} ({daysLeft} 天後過期)</span>
            ) : (
              <span className="text-xs sm:text-xs">已於 {new Date(coupon.endDate).toLocaleDateString('zh-TW')} 過期</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 border-t p-3">
        <div className="flex items-center w-full justify-between gap-2">
          <div
            ref={codeRef}
            className="font-mono text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded flex-1 text-center sm:text-left"
          >
            {coupon.code}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!isActive}
            className={cn("text-xs gap-1 px-2 sm:px-3",
              isActive ? "text-amber-600 hover:text-[#B4371A] hover:bg-[#FCE9D8]" : "text-gray-400"
            )}
          >
            {copied ? (
              <>
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">已複製</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">複製</span>
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function CouponsClient() {
  const [couponCode, setCouponCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coupons, setCoupons] = useState<DiscountCode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 獲取折扣碼列表
  const fetchCoupons = async () => {
    try {
      setIsLoading(true)
      const response = await getDiscountCodesApi()
      
      if (response.status && response.data) {
        setCoupons(response.data)
      } else {
        throw new Error(response.message || '獲取折扣碼失敗')
      }
    } catch (error) {
      console.error('獲取折扣碼失敗:', error)
      toast.error('獲取折扣碼失敗', {
        description: error instanceof Error ? error.message : '請稍後再試'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const activeCoupons = coupons.filter(coupon => !coupon.isUsed)
  const usedCoupons = coupons.filter(coupon => coupon.isUsed)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) {
      toast.error("請輸入折扣碼")
      return
    }

    setIsSubmitting(true)
    // 模擬 API 請求
    setTimeout(() => {
      const existingCoupon = coupons.find(c => c.code === couponCode)
      if (existingCoupon) {
        toast.error("此折扣碼已存在於您的帳戶中")
      } else {
        toast.success("折扣碼已加入", {
          description: "您可以在結帳時使用此折扣碼",
        })
      }
      setCouponCode("")
      setIsSubmitting(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 flex items-center">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
          可使用的折扣碼
        </h3>
        {activeCoupons.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {activeCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-lg">
            <Ticket className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">尚無可用折扣碼</h3>
            <p className="mt-1 text-sm text-gray-500">您目前沒有任何可使用的折扣碼。</p>
          </div>
        )}
      </div>

      {/* 已使用的折扣碼 */}
      {usedCoupons.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 flex items-center">
            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-400" />
            已使用的折扣碼
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {usedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
