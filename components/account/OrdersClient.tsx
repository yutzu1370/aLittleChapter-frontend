"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingBag, Truck, CheckCircle } from "lucide-react"

// 模擬訂單資料
const orders = [
  {
    id: "ORD-2023-001",
    date: "2023-05-15",
    total: 1250,
    status: "completed",
    items: [
      { id: 1, name: "文學小說：春天的邂逅", price: 350, quantity: 1 },
      { id: 2, name: "心理勵志：人生的抉擇", price: 450, quantity: 2 },
    ],
    address: "台北市中山區南京東路三段 219 號 5 樓",
  },
  {
    id: "ORD-2023-002",
    date: "2023-06-20",
    total: 780,
    status: "shipping",
    items: [
      { id: 3, name: "歷史記憶：二戰全紀錄", price: 580, quantity: 1 },
      { id: 4, name: "手帳筆記本", price: 200, quantity: 1 },
    ],
    address: "台北市中山區南京東路三段 219 號 5 樓",
  },
  {
    id: "ORD-2023-003",
    date: "2023-07-05",
    total: 1680,
    status: "processing",
    items: [
      { id: 5, name: "科學探索：宇宙的奧秘", price: 680, quantity: 1 },
      { id: 6, name: "藝術鑑賞：西方繪畫史", price: 780, quantity: 1 },
      { id: 7, name: "鋼筆組合", price: 220, quantity: 1 },
    ],
    address: "台北市中山區南京東路三段 219 號 5 樓",
  },
]

// 狀態標籤元件
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    completed: { 
      label: "已完成", 
      className: "bg-green-100 text-green-800", 
      icon: <CheckCircle className="w-4 h-4" /> 
    },
    shipping: { 
      label: "運送中", 
      className: "bg-blue-100 text-blue-800", 
      icon: <Truck className="w-4 h-4" /> 
    },
    processing: { 
      label: "處理中", 
      className: "bg-amber-100 text-amber-800", 
      icon: <Package className="w-4 h-4" /> 
    },
  }

  const { label, className, icon } = statusMap[status] || {
    label: "未知",
    className: "bg-gray-100 text-gray-800",
    icon: <ShoppingBag className="w-4 h-4" />,
  }

  return (
    <div className={`px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-xs font-medium ${className}`}>
      {icon}
      {label}
    </div>
  )
}

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState("all")

  // 根據狀態篩選訂單
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="min-w-24">全部訂單</TabsTrigger>
          <TabsTrigger value="processing" className="min-w-24">處理中</TabsTrigger>
          <TabsTrigger value="shipping" className="min-w-24">運送中</TabsTrigger>
          <TabsTrigger value="completed" className="min-w-24">已完成</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-amber-50/50 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <CardTitle className="text-base font-medium">{order.id}</CardTitle>
                        <CardDescription>訂購日期: {order.date}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <span className="font-semibold text-lg text-amber-900">NT$ {order.total}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h4 className="mb-2 font-medium text-sm text-gray-600">訂購商品</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                          <div className="flex-1 truncate">{item.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 w-32 justify-end">
                            <span>NT$ {item.price}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <h4 className="mb-1 font-medium">配送地址</h4>
                      <p>{order.address}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2">
                      再次購買
                    </Button>
                    <Button size="sm">
                      訂單詳情
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">尚無訂單</h3>
                <p className="mt-1 text-gray-500">您目前還沒有符合此狀態的訂單。</p>
                <div className="mt-6">
                  <Button onClick={() => setActiveTab("all")}>查看全部訂單</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
