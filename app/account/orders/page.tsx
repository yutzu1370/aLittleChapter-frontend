"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck,CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { toast } from "sonner"
import { getOrders, getOrderByNumber, Order, OrderItem, OrdersResponse } from "@/lib/api/orders"
import { ReviewModal } from "@/components/ui/review-modal"

// 狀態映射
const statusMapping = {
  orderStatus: {
    pending: "待出貨",
    shipped: "已出貨", 
    completed: "已完成",
    cancelled: "已取消"
  },
  paymentStatus: {
    paid: "已付款",
    refunded: "已退款"
  },
  shippingStatus: {
    notReceived: "尚未收貨",
    processing: "處理中",
    inTransit: "運送中",
    delivered: "已送達",
    returned: "已退貨"
  }
}

const statusConfig = {
  "待出貨": { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
  "已出貨": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  "已完成": { color: "bg-red-100 text-red-800 border-red-200", icon: CheckCircle },
  "已付款": { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CreditCard },
  "尚未收貨": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  "運送中": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  "已送達": { color: "bg-green-100 text-green-800 border-green-200", icon: Package },
  "已取消": { color: "bg-red-100 text-red-800 border-red-200", icon: Package },
  "已退款": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: CreditCard },
  "處理中": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  "已退貨": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Package },
}

export default function OrderCenter() {
  const [activeTab, setActiveTab] = useState("全部訂單")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  
  // 評價 Modal 狀態
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    productId: number
    productTitle: string
  }>({
    isOpen: false,
    productId: 0,
    productTitle: ""
  })

  const tabs = ["全部訂單", "待出貨", "已出貨", "已送達"]

  // 獲取訂單資料
  const fetchOrders = async (page: number = 1) => {
    try {
      setIsLoading(true)
      console.log('🚀 [Orders Page] 開始獲取訂單，頁數:', page)
      
      const response = await getOrders({
        page,
        limit: pagination.limit
      })
      
      console.log('📦 [Orders Page] API 回應:', response)
      
      if (response.status && response.data) {
        console.log('✅ [Orders Page] 成功獲取訂單:', response.data.orders.length, '筆')
        console.log('📄 [Orders Page] 分頁資訊:', response.data.pagination)
        setOrders(response.data.orders)
        setPagination(response.data.pagination)
      } else {
        console.error('❌ [Orders Page] 訂單資料格式錯誤:', response)
        throw new Error(response.message || '訂單資料格式錯誤')
      }
    } catch (error) {
      console.error('💥 [Orders Page] 獲取訂單失敗:', error)
      toast.error('獲取訂單失敗', {
        description: error instanceof Error ? error.message : '請稍後再試'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 切換訂單展開狀態並獲取詳細資料
  const toggleOrderExpansion = async (orderId: string, orderNumber: string) => {
    if (expandedOrders.has(orderId)) {
      // 如果已展開，則收起
      const newExpanded = new Set(expandedOrders)
      newExpanded.delete(orderId)
      setExpandedOrders(newExpanded)
    } else {
      // 如果未展開，則展開並獲取詳細資料
      const newExpanded = new Set(expandedOrders)
      newExpanded.add(orderId)
      setExpandedOrders(newExpanded)
      
      // 檢查是否已有詳細資料
      const currentOrder = orders.find(order => order.id === orderId)
      if (!currentOrder?.items || currentOrder.items.length === 0) {
        // 沒有詳細資料，需要從後端獲取
        const newLoading = new Set(loadingDetails)
        newLoading.add(orderId)
        setLoadingDetails(newLoading)
        
        try {
          console.log('🔍 [Order Detail] 獲取訂單詳細資料:', orderNumber)
          const response = await getOrderByNumber(orderNumber)
          
          if (response.status && response.data) {
            console.log('✅ [Order Detail] 成功獲取訂單詳細資料:', response.data)
            // 更新特定訂單的資料
            const orderData = response.data
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId 
                  ? { 
                      ...order, 
                      items: orderData.items || [],
                      totalAmount: orderData.totalAmount || order.totalAmount,
                      discountAmount: orderData.discountAmount || order.discountAmount,
                      shippingFee: orderData.shippingFee || order.shippingFee
                    }
                  : order
              )
            )
          } else {
            throw new Error(response.message || '獲取訂單詳細資料失敗')
          }
        } catch (error) {
          console.error('❌ [Order Detail] 獲取訂單詳細資料失敗:', error)
          toast.error('獲取訂單詳細資料失敗', {
            description: error instanceof Error ? error.message : '請稍後再試'
          })
          // 獲取失敗時收起展開狀態
          const failedExpanded = new Set(expandedOrders)
          failedExpanded.delete(orderId)
          setExpandedOrders(failedExpanded)
        } finally {
          const finalLoading = new Set(loadingDetails)
          finalLoading.delete(orderId)
          setLoadingDetails(finalLoading)
        }
      }
    }
  }

  const filteredOrders = orders.filter((order) => {
    // 首先根據搜尋條件過濾
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(searchLower)
      const matchesItems = order.items && order.items.some(
        (item) =>
          item.productTitle.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower)
      )
      
      if (!matchesOrderNumber && !matchesItems) {
        return false
      }
    }
    
    // 然後根據 Tab 過濾
    if (activeTab === "全部訂單") return true
    
    switch (activeTab) {
      case "待出貨":
        return order.orderStatus === "pending"
      case "已出貨":
        return order.orderStatus === "shipped"
      case "已送達":
        return order.shippingStatus === "delivered"
      default:
        return true
    }
  })

  const getDisplayStatus = (order: Order) => {
    // 根據訂單狀態決定顯示哪個狀態
    if (order.orderStatus === "cancelled") {
      return statusMapping.orderStatus.cancelled
    }
    if (order.paymentStatus === "refunded") {
      return statusMapping.paymentStatus.refunded
    }
    if (order.orderStatus === "completed") {
      return statusMapping.orderStatus.completed
    }
    if (order.orderStatus === "shipped") {
      return statusMapping.shippingStatus[order.shippingStatus as keyof typeof statusMapping.shippingStatus] || statusMapping.orderStatus.shipped
    }
    return statusMapping.orderStatus[order.orderStatus as keyof typeof statusMapping.orderStatus] || "未知狀態"
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config?.icon || Package
    return <IconComponent className="w-4 h-4" />
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // 開啟評價 Modal
  const handleOpenReviewModal = (productId: number, productTitle: string) => {
    setReviewModal({
      isOpen: true,
      productId,
      productTitle
    })
  }

  // 關閉評價 Modal
  const handleCloseReviewModal = () => {
    setReviewModal({
      isOpen: false,
      productId: 0,
      productTitle: ""
    })
  }

  // 提交評價
  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      console.log('🚀 [Review] 提交評價:', {
        productId: reviewModal.productId,
        rating,
        comment
      })
      
      // 這裡可以調用後端 API 提交評價
      // const response = await submitReviewApi({
      //   productId: reviewModal.productId,
      //   rating,
      //   comment
      // })
      
      toast.success('評價提交成功！', {
        description: '感謝您的評價',
        duration: 3000,
      })
      
      // 可以在這裡更新訂單狀態或重新獲取數據
      
    } catch (error) {
      console.error('💥 [Review] 提交評價失敗:', error)
      toast.error('評價提交失敗', {
        description: '請稍後再試',
        duration: 3000,
      })
      throw error // 讓 Modal 知道提交失敗
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse text-lg text-gray-500">載入中...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-auto bg-white font-noto-sans-tc">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋訂單編號、商品名稱或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-noto-sans-tc"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-8 border-b border-gray-200">
            {tabs.map((tab, tabIndex) => (
              <button
                key={`tab-${tabIndex}-${tab}`}
                className={`pb-3 px-1 text-sm font-medium transition-all font-noto-sans-tc relative ${
                  activeTab === tab
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, orderIndex) => {
            const displayStatus = getDisplayStatus(order)
            const isExpanded = expandedOrders.has(order.id)
            const isLoadingDetail = loadingDetails.has(order.id)
            
            return (
              <Card
                key={`order-${order.id}-${order.orderNumber}-${orderIndex}`}
                className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl"
              >
                <CardHeader className="bg-[#F3FAF8] border-b border-gray-200 rounded-t-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-noto-sans-tc">訂單編號</span>
                      </div>
                      <span className="font-semibold text-gray-800 font-noto-sans-tc">{order.orderNumber}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className={`${statusConfig[displayStatus as keyof typeof statusConfig]?.color} font-medium border rounded-full font-noto-sans-tc`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(displayStatus)}
                          {displayStatus}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-noto-sans-tc">下單日期：</span>
                        <span className="text-gray-800 font-noto-sans-tc">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-noto-sans-tc">商品數量：</span>
                        <span className="text-gray-800 font-noto-sans-tc">共{order.totalQuantity}件</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-noto-sans-tc">總金額：</span>
                        <span className="font-semibold text-orange-600 font-noto-sans-tc">NT${order.finalAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-noto-sans-tc">
                        訂單客服
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id, order.orderNumber)}
                        disabled={isLoadingDetail}
                        className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 rounded-xl font-noto-sans-tc"
                      >
                        <span className="mr-1">
                          {isLoadingDetail ? "載入中..." : "訂單詳細"}
                        </span>
                        {isLoadingDetail ? (
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        ) : isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && order.items && order.items.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-4">
                        {order.items.map((item, itemIndex) => (
                          <div
                            key={`order-${order.id}-item-${item.productId}-${itemIndex}`}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.productTitle}
                                width={60}
                                height={80}
                                className="rounded-xl bg-white border border-gray-200"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 mb-1 font-noto-sans-tc">{item.productTitle}</h4>
                              <p className="text-sm text-gray-600 mb-2 font-noto-sans-tc">作者：{item.author}</p>
                              <p className="text-sm text-gray-600 font-noto-sans-tc">數量：{item.quantity}</p>
                              <p className="text-sm font-semibold text-orange-600 font-noto-sans-tc">價格：NT${item.itemAmount}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenReviewModal(item.productId, item.productTitle)}
                                className="border-orange-500 text-orange-600 hover:bg-orange-50 rounded-full font-noto-sans-tc"
                              >
                                撰寫評價
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Order Summary */}
                      <div className="p-4 rounded-lg border-t border-gray-200">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-gray-500 mb-1 font-noto-sans-tc">訂單狀態</div>
                            <div className="font-semibold font-noto-sans-tc">{statusMapping.orderStatus[order.orderStatus]}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 mb-1 font-noto-sans-tc">付款狀態</div>
                            <div className="font-semibold font-noto-sans-tc">{statusMapping.paymentStatus[order.paymentStatus]}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 mb-1 font-noto-sans-tc">運送狀態</div>
                            <div className="font-semibold font-noto-sans-tc">{statusMapping.shippingStatus[order.shippingStatus]}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 mb-1 font-noto-sans-tc">總金額</div>
                            <div className="font-bold text-orange-600 font-noto-sans-tc">NT${order.finalAmount}</div>
                          </div>
                        </div>
                        
                        {/* 詳細金額資訊 */}
                        {order.totalAmount && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-gray-500 mb-1 font-noto-sans-tc">商品小計</div>
                                <div className="font-semibold font-noto-sans-tc">NT${order.totalAmount}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500 mb-1 font-noto-sans-tc">折扣金額</div>
                                <div className="font-semibold text-green-600 font-noto-sans-tc">-NT${order.discountAmount || 0}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500 mb-1 font-noto-sans-tc">運費</div>
                                <div className="font-semibold font-noto-sans-tc">NT${order.shippingFee || 0}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500 mb-1 font-noto-sans-tc">最終金額</div>
                                <div className="font-bold text-orange-600 font-noto-sans-tc">NT${order.finalAmount}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results Message */}
        {filteredOrders.length === 0 && searchTerm && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 mb-2 font-noto-sans-tc">找不到符合條件的訂單</div>
            <div className="text-sm text-gray-400 font-noto-sans-tc">請嘗試其他關鍵字或清除搜尋條件</div>
          </div>
        )}

        {/* No Orders Message */}
        {orders.length === 0 && !searchTerm && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 mb-2 font-noto-sans-tc">您還沒有任何訂單</div>
            <div className="text-sm text-gray-400 font-noto-sans-tc">快去選購您喜歡的商品吧！</div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchOrders(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="font-noto-sans-tc"
              >
                上一頁
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600 font-noto-sans-tc">
                第 {pagination.page} 頁，共 {pagination.totalPages} 頁
              </span>
              <Button
                variant="outline"
                onClick={() => fetchOrders(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="font-noto-sans-tc"
              >
                下一頁
              </Button>
            </div>
          </div>
        )}

        {/* 評價 Modal */}
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={handleCloseReviewModal}
          productTitle={reviewModal.productTitle}
          productId={reviewModal.productId}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  )
}
