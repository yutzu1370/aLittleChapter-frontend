"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck } from "lucide-react"
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
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#20305",
    date: "2025年5月3日",
    status: "待出貨",
    totalItems: 1,
    totalAmount: 250,
    subtotal: 250,
    discount: 0,
    shipping: 70,
    items: [
      {
        id: "1",
        title: "彩虹島歷險記",
        author: "李明華",
        quantity: 1,
        price: 250,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "#12348",
    date: "2025年3月20日",
    status: "已出貨",
    totalItems: 3,
    totalAmount: 1250,
    subtotal: 1180,
    discount: 0,
    shipping: 70,
    items: [
      {
        id: "2",
        title: "小熊的第一天",
        author: "王小明",
        quantity: 2,
        price: 450,
        image: "/placeholder.svg?height=80&width=60",
      },
      {
        id: "3",
        title: "森林裡的秘密",
        author: "張美麗",
        quantity: 1,
        price: 280,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "#6062",
    date: "2025年1月20日",
    status: "已完成",
    totalItems: 5,
    totalAmount: 2320,
    subtotal: 2250,
    discount: 0,
    shipping: 70,
    items: [
      {
        id: "4",
        title: "彩虹島歷險記",
        author: "李明華",
        quantity: 3,
        price: 450,
        image: "/placeholder.svg?height=80&width=60",
      },
      {
        id: "5",
        title: "小熊的第一天",
        author: "王小明",
        quantity: 2,
        price: 450,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
  },
]

const statusConfig = {
  待出貨: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
  已出貨: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  已完成: { color: "bg-green-100 text-green-800 border-green-200", icon: Package },
  已付款: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CreditCard },
  尚未收貨: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  運送中: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Truck },
  已送達: { color: "bg-green-100 text-green-800 border-green-200", icon: Package },
}

export default function OrderCenter() {
  const [activeTab, setActiveTab] = useState("全部訂單")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = ["全部訂單", "待出貨", "已出貨", "已送達"]

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const getStatusIcon = (status: Order["status"]) => {
    const IconComponent = statusConfig[status]?.icon || Package
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋訂單編號、商品名稱或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl"
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
          <div className="flex flex-wrap gap-2 p-1 bg-[#F3FAF8] rounded-xl border border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "default"}
                className={`px-4 py-2 rounded-xl transition-all ${
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
              <CardHeader className="bg-[#F3FAF8] border-b border-gray-200 rounded-t-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">訂單編號</span>
                    </div>
                    <span className="font-semibold text-gray-800">{order.orderNumber}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className={`${statusConfig[order.status]?.color} font-medium border rounded-full`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">下單日期：</span>
                      <span className="text-gray-800">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">商品數量：</span>
                      <span className="text-gray-800">共{order.totalItems}件</span>
                    </div>
                    <div>
                      <span className="text-gray-500">總金額：</span>
                      <span className="font-semibold text-orange-600">NT${order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                      訂單客服
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 rounded-xl"
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
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={60}
                              height={80}
                              className="rounded-xl bg-white border border-gray-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">作者：{item.author}</p>
                            <p className="text-sm text-gray-600">數量：{item.quantity}</p>
                            <p className="text-sm font-semibold text-orange-600">價格：NT${item.price}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-500 text-orange-600 hover:bg-orange-50 rounded-full"
                            >
                              撰寫評價
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Summary */}
                    <div className=" p-4 rounded-lg border-t border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">小計</div>
                          <div className="font-semibold">NT${order.subtotal}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">折扣</div>
                          <div className="font-semibold">NT${order.discount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">運費</div>
                          <div className="font-semibold">NT${order.shipping}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 mb-1">總金額</div>
                          <div className="font-bold text-orange-600">NT${order.totalAmount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredOrders.length === 0 && searchTerm && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-500 mb-2">找不到符合條件的訂單</div>
            <div className="text-sm text-gray-400">請嘗試其他關鍵字或清除搜尋條件</div>
          </div>
        )}
      </div>
    </div>
  )
}
