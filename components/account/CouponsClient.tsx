"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Clock, Copy, Ticket, Zap, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

// 模擬折扣碼資料
const coupons = [
  {
    id: 1,
    code: "WELCOME2023",
    discount: 10,
    type: "percentage",
    validUntil: "2023-12-31",
    minOrder: 300,
    status: "active",
    description: "新會員歡迎禮，消費滿 NT$300 可享 10% 折扣",
  },
  {
    id: 2,
    code: "SUMMER100",
    discount: 100,
    type: "fixed",
    validUntil: "2023-08-31",
    minOrder: 600,
    status: "active",
    description: "夏季特惠，消費滿 NT$600 現折 NT$100",
  },
  {
    id: 3,
    code: "BOOKS20",
    discount: 20,
    type: "percentage",
    validUntil: "2023-07-15",
    minOrder: 500,
    status: "expired",
    description: "圖書分類指定商品，消費滿 NT$500 可享 20% 折扣",
  },
  {
    id: 4,
    code: "FREESHIP",
    discount: 60,
    type: "shipping",
    validUntil: "2023-12-31",
    minOrder: 800,
    status: "active",
    description: "消費滿 NT$800 即可享免運費優惠",
  },
]

// 折扣碼卡片元件
const CouponCard = ({ coupon }: { coupon: typeof coupons[0] }) => {
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

  const isActive = coupon.status === "active"
  const now = new Date()
  const expiryDate = new Date(coupon.validUntil)
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={cn(
      "overflow-hidden border",
      isActive ? "border-amber-200" : "border-gray-200 opacity-60"
    )}>
      <div className={cn(
        "px-6 py-4",
        isActive ? "bg-amber-50" : "bg-gray-50"
      )}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Ticket className={cn(
              "w-5 h-5 mr-2",
              isActive ? "text-amber-600" : "text-gray-400"
            )} />
            <h3 className="font-medium">
              {coupon.type === "percentage" && `${coupon.discount}% 折扣`}
              {coupon.type === "fixed" && `現折 NT$${coupon.discount}`}
              {coupon.type === "shipping" && "免運費優惠"}
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
              已過期
            </span>
          )}
        </div>
      </div>

      <CardContent className="pt-4">
        <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {isActive ? (
              <span>有效期限 {coupon.validUntil} ({daysLeft} 天後過期)</span>
            ) : (
              <span>已於 {coupon.validUntil} 過期</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            消費滿 NT${coupon.minOrder}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 border-t p-3">
        <div className="flex items-center w-full justify-between">
          <div
            ref={codeRef}
            className="font-mono text-sm px-3 py-1.5 bg-white border border-gray-200 rounded"
          >
            {coupon.code}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!isActive}
            className={cn("text-xs gap-1",
              isActive ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-gray-400"
            )}
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                已複製
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                複製
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

  const activeCoupons = coupons.filter(coupon => coupon.status === "active")
  const expiredCoupons = coupons.filter(coupon => coupon.status === "expired")

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-6">折扣碼</h2>

      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-4 bg-amber-50 rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="輸入折扣碼"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                處理中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                兌換折扣碼
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            可使用的折扣碼
          </h3>
          {activeCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">尚無可用折扣碼</h3>
              <p className="mt-1 text-gray-500">您目前沒有任何可使用的折扣碼。</p>
            </div>
          )}
        </div>

        {expiredCoupons.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <X className="w-5 h-5 mr-2 text-gray-500" />
              已過期的折扣碼
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
