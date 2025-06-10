"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck, ShoppingBag, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface OrderItem {
  id: string
  title: string
  author: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "待出貨" | "已出貨" | "已完成" | "已付款" | "尚未收貨" | "運送中" | "已送達"
  totalItems: number
  totalAmount: number
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  address: string
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#ORD-2023-001",
    date: "2023年5月15日",
    status: "已完成",
    totalItems: 2,
    totalAmount: 1250,
    subtotal: 1180,
    discount: 0,
    shipping: 70,
    address: "台北市中山區南京東路三段 219 號 5 樓",
    items: [
      {
        id: "1",
        title: "文學小說：春天的邂逅",
        author: "李明華",
        quantity: 1,
        price: 350,
        image: "/images/books/book1.jpg",
      },
      {
        id: "2",
        title: "心理勵志：人生的抉擇",
        author: "王小明",
        quantity: 2,
        price: 450,
        image: "/images/books/book2.jpg",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "#ORD-2023-002",
    date: "2023年6月20日",
    status: "運送中",
    totalItems: 2,
    totalAmount: 780,
    subtotal: 710,
    discount: 0,
    shipping: 70,
    address: "台北市中山區南京東路三段 219 號 5 樓",
    items: [
      {
        id: "3",
        title: "歷史記憶：二戰全紀錄",
        author: "張美麗",
        quantity: 1,
        price: 580,
        image: "/images/books/book3.jpg",
      },
      {
        id: "4",
        title: "手帳筆記本",
        author: "文具品牌",
        quantity: 1,
        price: 200,
        image: "/images/books/book4.jpg",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "#ORD-2023-003",
    date: "2023年7月5日",
    status: "待出貨",
    totalItems: 3,
    totalAmount: 1680,
    subtotal: 1610,
    discount: 0,
    shipping: 70,
    address: "台北市中山區南京東路三段 219 號 5 樓",
    items: [
      {
        id: "5",
        title: "科學探索：宇宙的奧秘",
        author: "科學家",
        quantity: 1,
        price: 680,
        image: "/images/books/book5.jpg",
      },
      {
        id: "6",
        title: "藝術鑑賞：西方繪畫史",
        author: "藝術評論家",
        quantity: 1,
        price: 780,
        image: "/images/books/book6.jpg",
      },
      {
        id: "7",
        title: "鋼筆組合",
        author: "文具品牌",
        quantity: 1,
        price: 220,
        image: "/images/books/book7.jpg",
      },
    ],
  },
]

const statusConfig = {
  待出貨: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
  已出貨: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  已完成: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  已付款: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CreditCard },
  尚未收貨: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  運送中: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  已送達: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
}

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState("全部訂單")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = ["全部訂單", "待出貨", "運送中", "已完成"]

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    
    const matchesTab = activeTab === "全部訂單" || 
      (activeTab === "待出貨" && order.status === "待出貨") ||
      (activeTab === "運送中" && (order.status === "運送中" || order.status === "已出貨")) ||
      (activeTab === "已完成" && order.status === "已完成")
    
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: Order["status"]) => {
    const IconComponent = statusConfig[status]?.icon || Package
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-white font-noto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋訂單編號、商品名稱或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-noto"
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
          <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={`px-4 py-2 rounded-xl transition-all font-noto ${
                  activeTab === tab
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl"
            >
              <CardHeader className="bg-amber-50/50 border-b border-gray-200 pb-3 rounded-t-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-noto">訂單編號</span>
                    </div>
                    <span className="font-semibold text-gray-800 font-noto">{order.orderNumber}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className={`${statusConfig[order.status]?.color} font-medium border font-noto rounded-full`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                    <span className="font-semibold text-lg text-amber-900 font-numeric">NT$ {order.totalAmount}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-noto">下單日期：</span>
                      <span className="text-gray-800 font-noto">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-noto">商品數量：</span>
                      <span className="text-gray-800 font-numeric">共{order.totalItems}件</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-noto">總金額：</span>
                      <span className="font-semibold text-orange-600 font-numeric">NT${order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white font-noto rounded-full"
                    >
                      詢問客服
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 font-noto rounded-full"
                    >
                      <span className="mr-1">訂單詳細</span>
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders.has(order.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
                    <div className="space-y-4">
                      <h4 className="mb-2 font-medium text-sm text-gray-600 font-noto">訂購商品</h4>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={60}
                              height={80}
                              className="rounded-xl border border-gray-200 bg-white object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1 font-noto">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 font-noto">作者：{item.author}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="font-noto">數量：<span className="font-numeric">{item.quantity}</span></span>
                                <span className="font-noto">價格：<span className="font-semibold text-orange-600 font-numeric">NT${item.price}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-500 text-orange-600 hover:bg-orange-50 font-noto rounded-full"
                            >
                              撰寫評價
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-gray-500 mb-1 font-noto">小計</div>
                          <div className="font-semibold font-numeric">NT${order.subtotal}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1 font-noto">折扣</div>
                          <div className="font-semibold font-numeric">NT${order.discount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1 font-noto">運費</div>
                          <div className="font-semibold font-numeric">NT${order.shipping}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1 font-noto">總金額</div>
                          <div className="font-bold text-orange-600 font-numeric">NT${order.totalAmount}</div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-4 text-sm text-gray-600">
                      <h4 className="mb-1 font-medium font-noto">配送地址</h4>
                      <p className="font-noto">{order.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 font-noto">
              {searchTerm ? '找不到符合條件的訂單' : '尚無訂單'}
            </h3>
            <p className="mt-1 text-gray-500 font-noto">
              {searchTerm ? '請嘗試其他關鍵字或清除搜尋條件' : '您目前還沒有符合此狀態的訂單。'}
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setActiveTab("全部訂單")
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-noto rounded-full"
              >
                {searchTerm ? '清除搜尋' : '查看全部訂單'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
